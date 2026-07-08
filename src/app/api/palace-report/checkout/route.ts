import { NextRequest, NextResponse } from "next/server";
import { buildChartKey } from "@/lib/chart-key";
import { birthInputFromSearchParams, birthInputToSearchParams } from "@/lib/chart-parse-params";
import { clientIp, checkRateLimit } from "@/lib/rate-limit";
import {
  getPalaceReportProduct,
  PALACE_REPORT_PRODUCTS,
  type PalaceReportProductKey,
} from "@/lib/palace-report/config";
import { getUnlockedPalaces } from "@/lib/palace-report/store";
import { getSiteUrl } from "@/lib/site-url";
import { getStripe, stripePaymentsEnabled } from "@/lib/stripe/client";
import { formatPriceHkd } from "@/lib/stripe/plans";
import { generateChart } from "@/lib/ziwei/iztro-adapter";
import { PALACES, type BirthInput, type PalaceName } from "@/lib/ziwei/types";

function isProductKey(value: string): value is PalaceReportProductKey {
  return value in PALACE_REPORT_PRODUCTS;
}

function isPalaceName(value: string): value is PalaceName {
  return (PALACES as readonly string[]).includes(value);
}

function parseBirthInput(body: Record<string, unknown>): BirthInput | null {
  const sp: Record<string, string> = {};
  for (const key of [
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "gender",
    "calendarType",
    "isLeapMonth",
    "birthPlaceId",
    "useTrueSolarTime",
  ]) {
    const val = body[key];
    if (typeof val === "string" && val.trim()) sp[key] = val.trim();
    if (typeof val === "number") sp[key] = String(val);
  }
  const parsed = birthInputFromSearchParams(sp);
  if (!parsed.submitted || parsed.error) return null;
  return parsed.input;
}

export async function POST(request: NextRequest) {
  if (!stripePaymentsEnabled()) {
    return NextResponse.json(
      { error: "網上付款暫未開通，請 WhatsApp 查詢網上小師傅命書" },
      { status: 503 },
    );
  }

  const rate = checkRateLimit(`palace-report-checkout:${clientIp(request)}`, 5, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "請求太頻繁，請稍後再試" }, { status: 429 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "付款系統暫時未能使用" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "無效的請求" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const productKeyRaw = typeof input.productKey === "string" ? input.productKey : "";
  if (!isProductKey(productKeyRaw)) {
    return NextResponse.json({ error: "無效產品" }, { status: 400 });
  }

  const birthInput = parseBirthInput(input);
  if (!birthInput) {
    return NextResponse.json({ error: "出生資料無效" }, { status: 400 });
  }

  generateChart(birthInput);
  const chartKey = buildChartKey(birthInput);
  const product = getPalaceReportProduct(productKeyRaw);

  let palaces: PalaceName[];
  if (productKeyRaw === "full") {
    palaces = [...PALACES];
  } else {
    const rawPalaces = input.palaces;
    if (!Array.isArray(rawPalaces)) {
      return NextResponse.json({ error: "請選擇宮位" }, { status: 400 });
    }
    palaces = rawPalaces
      .filter((p): p is string => typeof p === "string")
      .filter(isPalaceName);
    if (palaces.length !== product.maxPalaces) {
      return NextResponse.json(
        { error: `請選擇 ${product.maxPalaces} 個宮位` },
        { status: 400 },
      );
    }
    if (new Set(palaces).size !== palaces.length) {
      return NextResponse.json({ error: "宮位不可重複" }, { status: 400 });
    }
  }

  const alreadyUnlocked = await getUnlockedPalaces(chartKey);
  const overlap = palaces.filter((p) => alreadyUnlocked.includes(p));
  if (overlap.length > 0) {
    return NextResponse.json(
      { error: `以下宮位已解鎖：${overlap.join("、")}` },
      { status: 400 },
    );
  }

  const returnPath =
    input.returnPath === "/en/chart" ? "/en/chart" : "/chart";
  const layout =
    typeof input.layout === "string" && input.layout ? input.layout : "5";
  const returnParams = birthInputToSearchParams(birthInput);
  returnParams.set("layout", layout);
  const returnQuery = returnParams.toString();
  const firstPalace = encodeURIComponent(palaces[0]);
  const siteUrl = getSiteUrl();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "hkd",
            unit_amount: product.priceCents,
            product_data: {
              name: `${product.title} — Destiny Home`,
              description: palaces.join("、"),
            },
          },
        },
      ],
      metadata: {
        productType: "palace-report",
        productId: product.id,
        chartKey,
        palaces: palaces.join(","),
        returnQuery,
      },
      success_url: `${siteUrl}${returnPath}?${returnQuery}&report_session={CHECKOUT_SESSION_ID}&focus=${firstPalace}#analysis`,
      cancel_url: `${siteUrl}${returnPath}?${returnQuery}&focus=${firstPalace}#analysis`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "無法建立付款連結" }, { status: 500 });
    }

    return NextResponse.json({
      url: session.url,
      amountLabel: formatPriceHkd(product.priceCents),
    });
  } catch (err) {
    console.error("Palace report checkout failed:", err);
    return NextResponse.json({ error: "付款系統暫時未能使用" }, { status: 500 });
  }
}
