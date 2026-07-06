import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { fulfillBookingFromCheckoutSession } from "@/lib/stripe/fulfill";
import { fulfillPalaceReportFromCheckoutSession } from "@/lib/palace-report/fulfill";
import { fulfillFortuneStickFromCheckoutSession } from "@/lib/fortune-stick/fulfill";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.payment_status === "paid") {
      const productType = session.metadata?.productType;
      if (productType === "palace-report") {
        const result = await fulfillPalaceReportFromCheckoutSession(session);
        if (!result.ok) {
          console.error("Palace report fulfillment failed:", result.error, session.id);
        }
      } else if (productType === "fortune-stick") {
        const result = await fulfillFortuneStickFromCheckoutSession(session);
        if (!result.ok) {
          console.error("Fortune stick fulfillment failed:", result.error, session.id);
        }
      } else {
        const result = await fulfillBookingFromCheckoutSession(session);
        if (!result.ok && result.error !== "slot_taken" && result.error !== "day_full") {
          console.error("Booking fulfillment failed:", result.error, session.id);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
