import { NextRequest, NextResponse } from "next/server";
import { buildBirthKey } from "@/lib/chart-key";
import { birthInputFromSearchParams, birthInputToSearchParams } from "@/lib/chart-parse-params";
import { clientIp, checkRateLimit } from "@/lib/rate-limit";
import {
  checkoutDescriptionForTier,
  getPalaceReportProduct,
  PALACE_REPORT_PRODUCTS,
  storageSlotForTier,
  STRIPE_STATEMENT_DESCRIPTOR_SUFFIX,
  stripeCheckoutProductName,
  type PalaceReportProductKey,
} from "@/lib/palace-report/config";
import { logWebhookEvent } from "@/lib/stripe/webhook-observability";
import { getAnnualReportAccess } from "@/lib/palace-report/store";
import { getSiteUrl } from "@/lib/site-url";
import { getStripe, stripePaymentsEnabled } from "@/lib/stripe/client";
import { formatPriceHkd } from "@/lib/stripe/plans";
import { generateChart } from "@/lib/ziwei/iztro-adapter";

function isProductKey(value: string): value is PalaceReportProductKey {
  return value in PALACE_REPORT_PRODUCTS;
}

function parseBirthInput(body: Record<string, unknown>) {
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
  const chartKey = buildBirthKey(birthInput);
  const product = getPalaceReportProduct(productKeyRaw);
  const access = await getAnnualReportAccess(chartKey);

  if (access[product.tier]) {
    return NextResponse.json(
      { error: `你已解鎖「${product.title}」，請刷新頁面查看。` },
      { status: 400 },
    );
  }

  const returnPath =
    input.returnPath === "/en/chart" ? "/en/chart" : "/chart";
  const returnParams = birthInputToSearchParams(birthInput);
  const returnQuery = returnParams.toString();
  const siteUrl = getSiteUrl();
  const slot = storageSlotForTier(product.tier);
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      payment_intent_data: {
        statement_descriptor_suffix: STRIPE_STATEMENT_DESCRIPTOR_SUFFIX,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "hkd",
            unit_amount: product.priceCents,
            product_data: {
              name: stripeCheckoutProductName(product.tier),
              description: checkoutDescriptionForTier(product.tier),
            },
          },
        },
      ],
      metadata: {
        productType: "palace-report",
        productId: product.id,
        reportTier: product.tier,
        chartKey,
        palaces: slot,
        returnQuery,
      },
      success_url: `${siteUrl}${returnPath}?${returnQuery}&report_session={CHECKOUT_SESSION_ID}#annual-report`,
      cancel_url: `${siteUrl}${returnPath}?${returnQuery}#annual-report`,
    });

    if (!session.url) {
      logWebhookEvent({
        area: "palace_report_session",
        success: false,
        reason: "checkout_no_url",
        detail: { chartKey, productId: product.id },
      });
      return NextResponse.json({ error: "無法建立付款連結" }, { status: 500 });
    }

    logWebhookEvent({
      area: "palace_report_session",
      sessionId: session.id,
      productType: "palace-report",
      success: true,
      reason: "checkout_created",
      detail: { chartKey, tier: product.tier },
    });

    return NextResponse.json({
      url: session.url,
      amountLabel: formatPriceHkd(product.priceCents),
    });
  } catch (err) {
    logWebhookEvent({
      area: "palace_report_session",
      success: false,
      reason: "checkout_exception",
      detail: {
        chartKey,
        productId: product.id,
        message: err instanceof Error ? err.message : "unknown",
      },
    });
    return NextResponse.json({ error: "付款系統暫時未能使用" }, { status: 500 });
  }
}
