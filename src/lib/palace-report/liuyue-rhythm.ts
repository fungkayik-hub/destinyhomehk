import { Solar } from "lunar-typescript";
import type { PalaceScore } from "@/lib/ai/types";
import type { PalaceName, ZiWeiChart } from "@/lib/ziwei/types";
import { getIztroAstrolabe, mapIztroPalaceName } from "@/lib/ziwei/iztro-adapter";
import { hourMinuteToTimeIndex } from "@/lib/ziwei/time";
import { scoreToEightGrade, scoreToEightGradeLevel } from "@/lib/chart-fortune-summary";
import {
  LIUYUE_MONTHS_ZH,
  type ParsedLiuyueMonth,
} from "@/lib/palace-report/parse-liuyue";

export type LiuyueRhythmTone = "順" | "平" | "慎";

export interface LiuyueRhythmMonth {
  monthLabel: string;
  lunarMonth: number;
  tone: LiuyueRhythmTone;
  /** iztro 流月宮位分數，或命書文字規則 */
  source: "chart" | "text";
  flowPalace?: PalaceName;
  palaceScore?: number;
  palaceGrade?: string;
  theme: string;
  yi: string;
  ji: string;
}

/**
 * iztro `horoscope(solarDate)` 嘅 `monthly.index` 指向本命十二宮陣列中「流月命宮」所在宮位；
 * 以該宮位現有小徒弟評分（八級 1–8）對照吉凶節奏。
 */
function toneFromPalaceScore(score: number): LiuyueRhythmTone {
  const level = scoreToEightGradeLevel(score);
  if (level >= 7) return "順";
  if (level >= 5) return "平";
  return "慎";
}

const TEXT_CAUTION =
  /衝|破|損|退|阻|波折|謹慎|收攏|壓力|衝動|透支|冷戰|冒進|賭|拖延|硬撐|投機|分心/;
const TEXT_SMOOTH = /拓展|開局|合作|進修|鞏固|順利|機遇|利|升|前進|確認|溝通/;

/** 僅在無法取得流月宮位分數時使用；依主題／宜／忌關鍵字，不用字數或欄位有無。 */
export function classifyLiuyueFromText(
  theme: string,
  yi: string,
  ji: string,
): LiuyueRhythmTone {
  const combined = `${theme}；${yi}；${ji}`;
  if (TEXT_CAUTION.test(combined)) return "慎";
  if (TEXT_SMOOTH.test(`${theme}；${yi}`) && !TEXT_CAUTION.test(ji)) return "順";
  return "平";
}

function findMidSolarDateInLunarMonth(lunarYear: number, lunarMonth: number): string | null {
  const hits: string[] = [];
  for (let solarYear = lunarYear - 1; solarYear <= lunarYear + 1; solarYear += 1) {
    for (let solarMonth = 1; solarMonth <= 12; solarMonth += 1) {
      for (let solarDay = 1; solarDay <= 31; solarDay += 1) {
        try {
          const solar = Solar.fromYmd(solarYear, solarMonth, solarDay);
          const lunar = solar.getLunar();
          if (lunar.getYear() === lunarYear && lunar.getMonth() === lunarMonth) {
            hits.push(`${solarYear}-${solarMonth}-${solarDay}`);
          }
        } catch {
          // skip invalid solar dates
        }
      }
    }
  }
  if (!hits.length) return null;
  return hits[Math.floor(hits.length / 2)];
}

function flowPalaceForLunarMonth(
  chart: ZiWeiChart,
  lunarYear: number,
  lunarMonth: number,
): PalaceName | null {
  const astrolabe = getIztroAstrolabe(chart.input, chart.plateType ?? "heaven");
  const timeIndex = hourMinuteToTimeIndex(
    chart.trueSolarTime?.correctedHour ?? chart.input.hour,
    chart.trueSolarTime?.correctedMinute ?? chart.input.minute,
  );
  const solarDate = findMidSolarDateInLunarMonth(lunarYear, lunarMonth);
  if (!solarDate) return null;

  const horoscope = astrolabe.horoscope(solarDate, timeIndex);
  const monthlyIndex = horoscope.monthly.index;
  if (monthlyIndex < 0 || monthlyIndex >= astrolabe.palaces.length) return null;

  const iztroPalace = astrolabe.palaces[monthlyIndex];
  return mapIztroPalaceName(iztroPalace.name);
}

export function buildLiuyueRhythmMonths(
  chart: ZiWeiChart,
  scoreByPalace: Map<string, PalaceScore>,
  parsed: ParsedLiuyueMonth[],
  forecastLunarYear: number,
): LiuyueRhythmMonth[] {
  return LIUYUE_MONTHS_ZH.map((monthLabel, idx) => {
    const lunarMonth = idx + 1;
    const parsedRow = parsed[idx] ?? {
      month: monthLabel,
      theme: "",
      yi: "",
      ji: "",
      raw: "",
    };

    const flowPalace = flowPalaceForLunarMonth(chart, forecastLunarYear, lunarMonth);
    if (flowPalace) {
      const palaceScore = scoreByPalace.get(flowPalace)?.score;
      if (palaceScore != null) {
        return {
          monthLabel,
          lunarMonth,
          tone: toneFromPalaceScore(palaceScore),
          source: "chart" as const,
          flowPalace,
          palaceScore,
          palaceGrade: scoreToEightGrade(palaceScore),
          theme: parsedRow.theme,
          yi: parsedRow.yi,
          ji: parsedRow.ji,
        };
      }
    }

    return {
      monthLabel,
      lunarMonth,
      tone: classifyLiuyueFromText(parsedRow.theme, parsedRow.yi, parsedRow.ji),
      source: "text" as const,
      theme: parsedRow.theme,
      yi: parsedRow.yi,
      ji: parsedRow.ji,
    };
  });
}
