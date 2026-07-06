import { NextRequest, NextResponse } from "next/server";
import { validateBookingRequest } from "@/lib/booking/validate-request";
import { getBookedTimesForDate, getBookingCountForDate } from "@/lib/booking/store";
import { BOOKING_CONFIG } from "@/lib/booking/config";
import { clientIp } from "@/lib/rate-limit";
import { turnstileEnabled, verifyTurnstileToken } from "@/lib/turnstile";
import { getSiteUrl } from "@/lib/site-url";
import { getStripe, stripePaymentsEnabled } from "@/lib/stripe/client";
import { formatPriceHkd, asPayablePlan } from "@/lib/stripe/plans";

export async function POST(request: NextRequest) {
  if (!stripePaymentsEnabled()) {
    return NextResponse.json(
      { error: "網上付款暫未開通，請 WhatsApp 預約" },
      { status: 503 },
    );
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

  const input = body as Record<string, string | undefined>;
  const { turnstileToken, ...rest } = input;

  if (turnstileEnabled()) {
    const ok = await verifyTurnstileToken(turnstileToken, clientIp(request));
    if (!ok) {
      return NextResponse.json({ error: "驗證失敗，請重新提交" }, { status: 403 });
    }
  }

  const validated = validateBookingRequest(rest);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: validated.status });
  }

  const { plan, date, time, name, phone, email } = validated.data;

  const payable = asPayablePlan(plan);
  if (!payable) {
    return NextResponse.json(
      { error: "此服務需按實際情況報價，請 WhatsApp 預約" },
      { status: 400 },
    );
  }

  const dayCount = await getBookingCountForDate(date);
  if (dayCount >= BOOKING_CONFIG.maxPerDay) {
    return NextResponse.json({ error: "當日預約已滿，請選擇其他日期" }, { status: 409 });
  }

  const booked = await getBookedTimesForDate(date);
  if (booked.includes(time)) {
    return NextResponse.json({ error: "此時段已被預約，請選擇其他時間" }, { status: 409 });
  }

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
            unit_amount: payable.priceCents,
            product_data: {
              name: `${payable.title} — Destiny Home 預約`,
              description: `${date} ${time} · Sunny 師傅`,
            },
          },
        },
      ],
      customer_email: email || undefined,
      metadata: {
        serviceId: payable.id,
        bookingDate: date,
        bookingTime: time,
        customerName: name,
        customerPhone: phone,
        customerEmail: email ?? "",
      },
      success_url: `${siteUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/book?cancelled=1`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "無法建立付款連結" }, { status: 500 });
    }

    return NextResponse.json({
      url: session.url,
      amountLabel: formatPriceHkd(payable.priceCents),
    });
  } catch (err) {
    console.error("Stripe checkout session failed:", err);
    return NextResponse.json({ error: "付款系統暫時未能使用" }, { status: 500 });
  }
}
