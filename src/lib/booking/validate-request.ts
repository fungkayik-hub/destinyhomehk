import { pricingPlans } from "@/lib/site-config";
import type { SlotTime } from "@/lib/booking/config";
import {
  isValidBookingDate,
  isValidHongKongPhone,
  isValidSlotTime,
  normalizePhone,
} from "@/lib/booking/slots";

export interface BookingRequestInput {
  serviceId?: string;
  date?: string;
  time?: string;
  name?: string;
  phone?: string;
  email?: string;
  turnstileToken?: string;
}

export type ValidatedBookingRequest = {
  plan: (typeof pricingPlans)[number];
  date: string;
  time: SlotTime;
  name: string;
  phone: string;
  email?: string;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateBookingRequest(
  body: BookingRequestInput,
):
  | { ok: true; data: ValidatedBookingRequest }
  | { ok: false; error: string; status: number } {
  const { serviceId, date, time, name, phone, email } = body;

  if (!serviceId || !date || !time || !name?.trim() || !phone?.trim()) {
    return {
      ok: false,
      error: "請填寫服務、日期、時間、姓名及電話",
      status: 400,
    };
  }

  const trimmedEmail = email?.trim();
  if (trimmedEmail && !isValidEmail(trimmedEmail)) {
    return { ok: false, error: "請輸入有效的電郵地址", status: 400 };
  }

  const plan = pricingPlans.find((p) => p.id === serviceId);
  if (!plan) {
    return { ok: false, error: "請選擇有效的服務項目", status: 400 };
  }

  if (!isValidBookingDate(date)) {
    return {
      ok: false,
      error: "請選擇有效的預約日期（星期一至六）",
      status: 400,
    };
  }

  if (!isValidSlotTime(time)) {
    return { ok: false, error: "請選擇有效的預約時間", status: 400 };
  }

  if (!isValidHongKongPhone(phone)) {
    return {
      ok: false,
      error: "請輸入有效的香港電話號碼（8 位數字）",
      status: 400,
    };
  }

  return {
    ok: true,
    data: {
      plan,
      date,
      time: time as SlotTime,
      name: name.trim(),
      phone: normalizePhone(phone),
      email: trimmedEmail || undefined,
    },
  };
}
