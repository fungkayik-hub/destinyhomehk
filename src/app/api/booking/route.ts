import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/booking/store";
import { validateBookingRequest } from "@/lib/booking/validate-request";
import {
  sendBookingConfirmation,
  sendBookingNotification,
} from "@/lib/booking/email";
import { clientIp } from "@/lib/rate-limit";
import { turnstileEnabled, verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: NextRequest) {
  let body: Record<string, string | undefined>;
  try {
    body = (await request.json()) as Record<string, string | undefined>;
  } catch {
    return NextResponse.json({ error: "無效的請求" }, { status: 400 });
  }

  const { turnstileToken, ...rest } = body;

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

  const result = await createBooking({
    serviceId: plan.id,
    serviceTitle: plan.title,
    bookingDate: date,
    bookingTime: time,
    customerName: name,
    customerPhone: phone,
    customerEmail: email,
    paymentStatus: "unpaid",
  });

  if (!result.ok) {
    const messages = {
      slot_taken: "此時段已被預約，請選擇其他時間",
      day_full: "當日預約已滿，請選擇其他日期",
      storage_error: "系統暫時無法處理預約，請稍後再試或 WhatsApp 聯絡",
      duplicate_payment: "此付款已處理，請檢查電郵確認",
    };
    return NextResponse.json(
      { error: messages[result.error] },
      { status: result.error === "storage_error" ? 503 : 409 },
    );
  }

  const [masterEmail, customerEmail] = await Promise.all([
    sendBookingNotification(result.booking),
    sendBookingConfirmation(result.booking),
  ]);

  return NextResponse.json({
    success: true,
    emailSent: masterEmail.sent,
    confirmationSent: customerEmail.sent,
    booking: {
      id: result.booking.id,
      serviceTitle: result.booking.serviceTitle,
      date: result.booking.bookingDate,
      time: result.booking.bookingTime,
      name: result.booking.customerName,
      email: result.booking.customerEmail ?? null,
    },
  });
}
