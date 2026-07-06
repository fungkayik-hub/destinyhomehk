import { BOOKING_CONFIG, type SlotTime } from "@/lib/booking/config";
import type { SlotAvailability } from "@/lib/booking/types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** 香港時間今日日期 YYYY-MM-DD */
export function todayInHongKong(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_CONFIG.timezone,
  }).format(new Date());
}

export function isValidBookingDate(date: string): boolean {
  if (!DATE_RE.test(date)) return false;
  const [y, m, d] = date.split("-").map(Number);
  const parsed = new Date(y, m - 1, d);
  if (
    parsed.getFullYear() !== y ||
    parsed.getMonth() !== m - 1 ||
    parsed.getDate() !== d
  ) {
    return false;
  }
  const weekday = parsed.getDay();
  if (!BOOKING_CONFIG.openWeekdays.includes(weekday as 1 | 2 | 3 | 4 | 5 | 6)) {
    return false;
  }
  return date >= todayInHongKong();
}

export function isValidSlotTime(time: string): time is SlotTime {
  return (BOOKING_CONFIG.slotTimes as readonly string[]).includes(time);
}

export function buildSlotAvailability(
  bookedTimes: string[],
  date: string,
): SlotAvailability[] {
  const booked = new Set(bookedTimes);
  const isToday = date === todayInHongKong();
  const nowHk = new Date(
    new Date().toLocaleString("en-US", { timeZone: BOOKING_CONFIG.timezone }),
  );
  const nowMinutes = nowHk.getHours() * 60 + nowHk.getMinutes();

  return BOOKING_CONFIG.slotTimes.map((time) => {
    if (booked.has(time)) {
      return { time, available: false };
    }
    if (isToday) {
      const [h, min] = time.split(":").map(Number);
      if (h * 60 + min <= nowMinutes) {
        return { time, available: false };
      }
    }
    return { time, available: true };
  });
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 8) return digits;
  if (digits.length === 11 && digits.startsWith("852")) {
    return digits.slice(3);
  }
  return digits;
}

export function isValidHongKongPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return /^[2-9]\d{7}$/.test(normalized);
}
