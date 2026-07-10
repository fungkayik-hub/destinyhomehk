import { Solar } from "lunar-typescript";
import { computeDailyAlmanac } from "@/lib/daily-almanac/compute";
import { getWeddingCeremony } from "./event-types";
import { eachDayInRange, MAX_RESULTS } from "./date-range";
import { scoreWeddingDay } from "./score-day";
import { canonicalZodiac, getBirthZodiac } from "./zodiac";
import type { WeddingDatePickerInput, WeddingDatePickerResult } from "./types";

function filterJi(items: string[]): string[] {
  return items.filter((x) => x && x !== "无" && x !== "無");
}

/** 掃描日期範圍，黃曆篩選 + 個人冲煞，回傳最佳吉日 */
export function computeWeddingDates(input: WeddingDatePickerInput): WeddingDatePickerResult {
  const ceremony = getWeddingCeremony(input.ceremonyId);
  const personAZodiac = canonicalZodiac(getBirthZodiac(input.personA).animal);
  const personBZodiac = canonicalZodiac(getBirthZodiac(input.personB).animal);

  const scored: WeddingDatePickerResult["dates"] = [];
  let totalDaysScanned = 0;

  for (const date of eachDayInRange(input.startDate, input.endDate)) {
    totalDaysScanned += 1;

    const almanac = computeDailyAlmanac(date);
    const solar = Solar.fromYmd(
      Number(date.slice(0, 4)),
      Number(date.slice(5, 7)),
      Number(date.slice(8, 10)),
    );
    const lunar = solar.getLunar();
    const yi = lunar.getDayYi();
    const ji = filterJi(lunar.getDayJi());
    const unluckyStars = lunar.getDayXiongSha().slice(0, 8);
    const dayChongAnimal = lunar.getDayChongShengXiao();

    const result = scoreWeddingDay({
      ceremony,
      personA: input.personA,
      personB: input.personB,
      yi,
      ji,
      unluckyStars,
      dayChongAnimal,
    });

    if (!result.passes) continue;

    scored.push({
      date,
      solarLabel: almanac.solarLabel,
      weekday: almanac.weekday,
      lunarDate: almanac.lunarLabel,
      dayOfficer: almanac.dayOfficer,
      score: result.score,
      rating: result.rating,
      yi: yi.slice(0, 8),
      ji,
      luckyStars: [],
      unluckyStars,
      chong: almanac.chong,
      notes: result.notes,
      warnings: result.warnings,
    });
  }

  scored.sort((a, b) => b.score - a.score || a.date.localeCompare(b.date));

  return {
    ceremonyId: ceremony.id,
    ceremonyLabel: ceremony.label,
    startDate: input.startDate,
    endDate: input.endDate,
    totalDaysScanned,
    matchCount: scored.length,
    dates: scored.slice(0, MAX_RESULTS),
    personAZodiac,
    personBZodiac,
  };
}
