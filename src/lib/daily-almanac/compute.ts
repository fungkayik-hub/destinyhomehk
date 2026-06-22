import { Solar } from "lunar-typescript";
import {
  formatHongKongDateISO,
  getHongKongDateParts,
} from "@/lib/hong-kong-time";
import { officerCopy } from "./copy";
import type { DailyAlmanac } from "./types";
import { zodiacHintsForDay } from "./zodiac";

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

function resolveDateParts(input?: string): { year: number; month: number; day: number } {
  if (input) {
    const m = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) {
      const year = Number(m[1]);
      const month = Number(m[2]);
      const day = Number(m[3]);
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        return { year, month, day };
      }
    }
  }
  return getHongKongDateParts();
}

function formatSolar(parts: { year: number; month: number; day: number }): string {
  return `${parts.year}年${parts.month}月${parts.day}日`;
}

function filterJi(items: string[]): string[] {
  return items.filter((x) => x && x !== "无" && x !== "無");
}

/** 由 lunar-typescript 計算每日流日資料（宜忌、神煞以庫為準） */
export function computeDailyAlmanac(dateInput?: string): DailyAlmanac {
  const parts = resolveDateParts(dateInput);
  const { year: y, month: m, day } = parts;

  const solar = Solar.fromYmd(y, m, day);
  const lunar = solar.getLunar();

  const dayOfficer = lunar.getZhiXing();
  const copy = officerCopy(dayOfficer);

  const yi = lunar.getDayYi().slice(0, 8);
  const jiRaw = filterJi(lunar.getDayJi());
  const ji = jiRaw.length > 0 ? jiRaw.slice(0, 6) : ["大事宜謹慎，以曆法「無」忌為參考"];

  const luckyStars = lunar.getDayJiShen().slice(0, 6);
  const unluckyStars = lunar.getDayXiongSha().slice(0, 4);

  const lunarMonth = lunar.getMonthInChinese();
  const lunarDay = lunar.getDayInChinese();

  let lunarLabel = `農曆${lunarMonth}月${lunarDay}`;
  if (lunar.getMonth() < 0) {
    lunarLabel = `農曆閏${Math.abs(lunar.getMonth())}月${lunarDay}`;
  }

  const weekIndex = solar.getWeek();
  const weekday = `星期${WEEKDAYS[weekIndex] ?? "?"}`;

  const starNote =
    luckyStars.length > 0
      ? `吉星${luckyStars.slice(0, 3).join("、")}護航，宜把握貴人緣。`
      : "今日宜穩扎穩打，以守為攻。";

  return {
    date: formatHongKongDateISO(parts),
    solarLabel: formatSolar(parts),
    weekday,
    ganzhi: {
      year: lunar.getYearInGanZhiExact(),
      month: lunar.getMonthInGanZhiExact(),
      day: lunar.getDayInGanZhiExact(),
    },
    lunarLabel: `${lunarLabel} · ${dayOfficer}日`,
    dayOfficer,
    dayOfficerFull: `${dayOfficer}日`,
    tianShen: lunar.getDayTianShen(),
    tianShenLuck: lunar.getDayTianShenLuck(),
    headline: copy.headline,
    specialTip: copy.special,
    masterTip: copy.tip,
    luckyStars,
    unluckyStars,
    starNote,
    yi,
    ji,
    zodiacs: zodiacHintsForDay(lunar.getDayZhiExact()),
    closing: copy.closing,
    quote: copy.quote,
    chong: lunar.getDayChongDesc(),
    sha: `煞${lunar.getDaySha()}`,
  };
}
