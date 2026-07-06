import { NextRequest, NextResponse } from "next/server";
import { FORTUNE_STICK_PRODUCT } from "@/lib/fortune-stick/config";
import { getDrawById, linkStripeSession } from "@/lib/fortune-stick/store";
import { clientIp, checkRateLimit } from "@/lib/rate-limit";
import { getSiteUrl } from "@/lib/site-url";
import { getStripe, stripePaymentsEnabled } from "@/lib/stripe/client";
import { formatPriceHkd } from "@/lib/stripe/plans";

export async function POST(request: NextRequest) {
  if (!stripePaymentsEnabled()) {
    return NextResponse.json(
      { error: "網上付款暫未開通，請 WhatsApp 查詢" },
      { status: 503 },
    );
  }

  const rate = checkRateLimit(`fortune-stick-checkout:${clientIp(request)}`, 5, 60_000);
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
  const drawId = typeof input.drawId === "string" ? input.drawId.trim() : "";
  if (!drawId) {
    return NextResponse.json({ error: "缺少求籤編號" }, { status: 400 });
  }

  const draw = await getDrawById(drawId);
  if (!draw) {
    return NextResponse.json({ error: "找不到求籤記錄，請重新搖籤" }, { status: 404 });
  }

  if (draw.interpretationText) {
    return NextResponse.json({ error: "此籤已解鎖" }, { status: 400 });
  }

  const siteUrl = getSiteUrl();
  const product = FORTUNE_STICK_PRODUCT;

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
              description: `第 ${draw.lotNumber} 籤 · 觀音靈籤`,
            },
          },
        },
      ],
      metadata: {
        productType: "fortune-stick",
        drawId,
        lotNumber: String(draw.lotNumber),
      },
      success_url: `${siteUrl}/qiu-qian?stick_session={CHECKOUT_SESSION_ID}&draw=${encodeURIComponent(drawId)}`,
      cancel_url: `${siteUrl}/qiu-qian?draw=${encodeURIComponent(drawId)}`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "無法建立付款連結" }, { status: 500 });
    }

    await linkStripeSession(drawId, session.id);

    return NextResponse.json({
      url: session.url,
      amountLabel: formatPriceHkd(product.priceCents),
    });
  } catch (err) {
    console.error("Fortune stick checkout failed:", err);
    return NextResponse.json({ error: "付款系統暫時未能使用" }, { status: 500 });
  }
}
