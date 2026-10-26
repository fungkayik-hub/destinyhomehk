import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { fulfillBookingFromCheckoutSession } from "@/lib/stripe/fulfill";
import { fulfillPalaceReportFromCheckoutSession } from "@/lib/palace-report/fulfill";
import { fulfillFortuneStickFromCheckoutSession } from "@/lib/fortune-stick/fulfill";
import {
  logWebhookEvent,
  notifyWebhookFailureIfNeeded,
} from "@/lib/stripe/webhook-observability";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!stripe || !webhookSecret) {
    logWebhookEvent({
      area: "stripe_webhook",
      eventType: "config",
      success: false,
      reason: "webhook_not_configured",
    });
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    logWebhookEvent({
      area: "stripe_webhook",
      eventType: "request",
      success: false,
      reason: "missing_signature",
    });
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "invalid_signature";
    logWebhookEvent({
      area: "stripe_webhook",
      eventType: "signature",
      success: false,
      reason: "signature_verification_failed",
      detail: { message },
    });
    await notifyWebhookFailureIfNeeded({
      area: "stripe_webhook",
      eventType: "signature",
      reason: "signature_verification_failed",
      detail: { message },
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  logWebhookEvent({
    area: "stripe_webhook",
    eventType: event.type,
    success: true,
    reason: "event_received",
  });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const sessionId = session.id;
    const productType = session.metadata?.productType;

    if (session.payment_status === "paid") {
      if (productType === "palace-report") {
        const result = await fulfillPalaceReportFromCheckoutSession(session);
        if (!result.ok) {
          logWebhookEvent({
            area: "stripe_webhook",
            eventType: event.type,
            sessionId,
            productType,
            success: false,
            reason: "palace_report_fulfill_failed",
            detail: { error: result.error },
          });
          await notifyWebhookFailureIfNeeded({
            area: "stripe_webhook",
            eventType: event.type,
            sessionId,
            productType,
            reason: result.error ?? "palace_report_fulfill_failed",
          });
        } else {
          logWebhookEvent({
            area: "stripe_webhook",
            eventType: event.type,
            sessionId,
            productType,
            success: true,
            reason: "palace_report_fulfilled",
          });
        }
      } else if (productType === "fortune-stick") {
        const result = await fulfillFortuneStickFromCheckoutSession(session);
        if (!result.ok) {
          logWebhookEvent({
            area: "stripe_webhook",
            eventType: event.type,
            sessionId,
            productType,
            success: false,
            reason: "fortune_stick_fulfill_failed",
            detail: { error: result.error },
          });
        } else {
          logWebhookEvent({
            area: "stripe_webhook",
            eventType: event.type,
            sessionId,
            productType,
            success: true,
            reason: "fortune_stick_fulfilled",
          });
        }
      } else {
        const result = await fulfillBookingFromCheckoutSession(session);
        if (!result.ok && result.error !== "slot_taken" && result.error !== "day_full") {
          logWebhookEvent({
            area: "stripe_webhook",
            eventType: event.type,
            sessionId,
            productType: productType ?? "booking",
            success: false,
            reason: "booking_fulfill_failed",
            detail: { error: result.error },
          });
        } else if (result.ok) {
          logWebhookEvent({
            area: "stripe_webhook",
            eventType: event.type,
            sessionId,
            productType: productType ?? "booking",
            success: true,
            reason: "booking_fulfilled",
          });
        }
      }
    } else {
      logWebhookEvent({
        area: "stripe_webhook",
        eventType: event.type,
        sessionId,
        productType,
        success: false,
        reason: "checkout_not_paid",
        detail: { paymentStatus: session.payment_status },
      });
    }
  }

  return NextResponse.json({ received: true });
}
