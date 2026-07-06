import type Stripe from "stripe";
import { createBooking } from "@/lib/booking/store";
import {
  sendBookingConfirmation,
  sendBookingNotification,
  sendPaymentIssueNotification,
} from "@/lib/booking/email";
import { isValidSlotTime } from "@/lib/booking/slots";
import { findPricingPlan, asPayablePlan } from "@/lib/stripe/plans";

export async function fulfillBookingFromCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<{ ok: boolean; bookingId?: string; error?: string }> {
  const metadata = session.metadata ?? {};
  const serviceId = metadata.serviceId;
  const date = metadata.bookingDate;
  const time = metadata.bookingTime;
  const name = metadata.customerName;
  const phone = metadata.customerPhone;
  const email = metadata.customerEmail || undefined;

  if (!serviceId || !date || !time || !name || !phone) {
    return { ok: false, error: "missing_metadata" };
  }

  if (!isValidSlotTime(time)) {
    return { ok: false, error: "invalid_time" };
  }

  const plan = findPricingPlan(serviceId);
  const payable = plan ? asPayablePlan(plan) : null;
  if (!payable) {
    return { ok: false, error: "invalid_plan" };
  }

  const amountPaidCents = session.amount_total ?? payable.priceCents;

  const result = await createBooking({
    serviceId: payable.id,
    serviceTitle: payable.title,
    bookingDate: date,
    bookingTime: time,
    customerName: name,
    customerPhone: phone,
    customerEmail: email,
    paymentStatus: "paid",
    stripeSessionId: session.id,
    amountPaidCents,
    currency: session.currency ?? "hkd",
  });

  if (!result.ok) {
    await sendPaymentIssueNotification({
      sessionId: session.id,
      serviceTitle: payable.title,
      bookingDate: date,
      bookingTime: time,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      amountPaidCents,
      error: result.error,
    });
    return { ok: false, error: result.error };
  }

  await Promise.all([
    sendBookingNotification(result.booking),
    sendBookingConfirmation(result.booking),
  ]);

  return { ok: true, bookingId: result.booking.id };
}
