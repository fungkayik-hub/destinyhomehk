import { NextRequest, NextResponse } from "next/server";
import { getBookedTimesForDate } from "@/lib/booking/store";
import {
  buildSlotAvailability,
  isValidBookingDate,
} from "@/lib/booking/slots";
import { BOOKING_CONFIG } from "@/lib/booking/config";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");

  if (!date || !isValidBookingDate(date)) {
    return NextResponse.json(
      { error: "請選擇有效的預約日期（星期一至六）" },
      { status: 400 },
    );
  }

  const bookedTimes = await getBookedTimesForDate(date);
  const slots = buildSlotAvailability(bookedTimes, date);
  const availableCount = slots.filter((s) => s.available).length;

  return NextResponse.json({
    date,
    slots,
    dayFull: bookedTimes.length >= BOOKING_CONFIG.maxPerDay,
    availableCount,
  });
}
