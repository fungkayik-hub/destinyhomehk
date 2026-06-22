import { unstable_cache } from "next/cache";
import {
  getHongKongTodayISO,
  getSecondsUntilNextHkDailyUpdate,
} from "@/lib/hong-kong-time";
import { computeDailyAlmanac } from "./compute";
import type { DailyAlmanac } from "./types";

/** 今日流日（快取至香港 00:01）；指定日期則即時計算 */
export async function getDailyAlmanacForPage(
  dateInput?: string,
): Promise<DailyAlmanac> {
  if (dateInput) return computeDailyAlmanac(dateInput);

  const hkDate = getHongKongTodayISO();
  return unstable_cache(
    async () => computeDailyAlmanac(),
    ["daily-almanac-today", hkDate],
    {
      revalidate: getSecondsUntilNextHkDailyUpdate(),
      tags: ["daily-almanac", `daily-${hkDate}`],
    },
  )();
}
