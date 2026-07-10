import {
  formatHongKongDateISO,
  getHongKongDateParts,
  getHongKongTodayISO,
} from "@/lib/hong-kong-time";

export const DEFAULT_RANGE_MONTHS = 18;
export const MAX_RANGE_MONTHS = 18;
export const MAX_RESULTS = 20;

function parseIsoDate(iso: string): { year: number; month: number; day: number } | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}

function addMonths(parts: { year: number; month: number; day: number }, months: number) {
  const total = parts.year * 12 + (parts.month - 1) + months;
  const year = Math.floor(total / 12);
  const month = (total % 12) + 1;
  const day = Math.min(parts.day, daysInMonth(year, month));
  return { year, month, day };
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getDefaultDateRange(now = new Date()): { startDate: string; endDate: string } {
  const start = getHongKongDateParts(now);
  const end = addMonths(start, DEFAULT_RANGE_MONTHS);
  return {
    startDate: formatHongKongDateISO(start),
    endDate: formatHongKongDateISO(end),
  };
}

export function* eachDayInRange(startIso: string, endIso: string): Generator<string> {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  if (!start || !end) return;

  let cursor = { ...start };
  const endKey = formatHongKongDateISO(end);

  while (true) {
    const key = formatHongKongDateISO(cursor);
    yield key;
    if (key >= endKey) break;

    const dim = daysInMonth(cursor.year, cursor.month);
    if (cursor.day < dim) {
      cursor = { ...cursor, day: cursor.day + 1 };
    } else if (cursor.month < 12) {
      cursor = { year: cursor.year, month: cursor.month + 1, day: 1 };
    } else {
      cursor = { year: cursor.year + 1, month: 1, day: 1 };
    }
  }
}

export function validateDateRange(
  startDate: string,
  endDate: string,
): string | undefined {
  const start = parseIsoDate(startDate);
  const end = parseIsoDate(endDate);
  if (!start || !end) return "請輸入有效日期（YYYY-MM-DD）";

  const today = getHongKongTodayISO();
  if (startDate < today) {
    return "開始日期不可早於今日（香港時間）";
  }
  if (endDate < startDate) return "結束日期不可早於開始日期";

  const maxEnd = formatHongKongDateISO(addMonths(start, MAX_RANGE_MONTHS));
  if (endDate > maxEnd) {
    return `搜尋範圍最長 ${MAX_RANGE_MONTHS} 個月`;
  }

  let count = 0;
  for (const _ of eachDayInRange(startDate, endDate)) {
    count += 1;
    if (count > 560) return `搜尋範圍最長 ${MAX_RANGE_MONTHS} 個月`;
  }

  return undefined;
}
