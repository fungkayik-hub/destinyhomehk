import { Solar } from "lunar-typescript";
import { officerCopy } from "./copy";
import type { DailyAlmanac } from "./types";
import { zodiacHintsForDay } from "./zodiac";

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

function parseDateInput(input?: string): Date {
  if (!input) return new Date();
  const m = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return new Date();
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(d.getTime())) return new Date();
  return d;
}

function formatSolar(d: Date): string {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function filterJi(items: string[]): string[] {
  return items.filter((x) => x && x !== "无" && x !== "無");
}

/** 由 lunar-typescript 計算每日流日資料（宜忌、神煞以庫為準） */
export function computeDailyAlmanac(dateInput?: string): DailyAlmanac {
  const date = parseDateInput(dateInput);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const day = date.getDate();

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
    date: `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    solarLabel: formatSolar(date),
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
