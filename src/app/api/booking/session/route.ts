import { NextRequest, NextResponse } from "next/server";
import { getBookingByStripeSessionId } from "@/lib/booking/store";
import { getStripe } from "@/lib/stripe/client";
import { formatPriceHkd } from "@/lib/stripe/plans";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id")?.trim();
  if (!sessionId) {
    return NextResponse.json({ error: "缺少 session_id" }, { status: 400 });
  }

  const booking = await getBookingByStripeSessionId(sessionId);
  if (booking) {
    return NextResponse.json({
      status: "confirmed",
      booking: {
        id: booking.id,
        serviceTitle: booking.serviceTitle,
        date: booking.bookingDate,
        time: booking.bookingTime,
        name: booking.customerName,
        email: booking.customerEmail ?? null,
        paid: booking.paymentStatus === "paid",
        amountLabel:
          booking.amountPaidCents != null
            ? formatPriceHkd(booking.amountPaidCents)
            : null,
      },
    });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ status: "pending" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      return NextResponse.json({
        status: "processing",
        message: "付款已收到，正在確認預約…",
      });
    }
    return NextResponse.json({ status: "pending" });
  } catch {
    return NextResponse.json({ error: "無法查詢付款狀態" }, { status: 404 });
  }
}
