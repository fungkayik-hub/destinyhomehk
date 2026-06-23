import { unstable_cache } from "next/cache";
import { analyzePalaceAnalyses } from "@/lib/ai/analyze-palace-analyses";
import { analyzePalaceScores } from "@/lib/ai/analyze-palace-scores";
import { generateChart } from "@/lib/ziwei/iztro-adapter";
import type { BirthInput } from "@/lib/ziwei/types";

function inputKey(input: BirthInput): string {
  return [
    input.year,
    input.month,
    input.day,
    input.hour,
    input.minute,
    input.gender,
    input.calendarType,
    input.isLeapMonth ?? false,
    input.birthPlaceId ?? "",
    input.useTrueSolarTime ?? true,
  ].join("-");
}

/** 同一出生資料只 call 一次 AI，換排版唔使再等 */
export async function getCachedChartResults(input: BirthInput) {
  const key = inputKey(input);
  return unstable_cache(
    async () => {
      const chart = generateChart(input);
      const [palaceScores, palaceAnalyses] = await Promise.all([
        analyzePalaceScores(chart),
        analyzePalaceAnalyses(chart),
      ]);
      return { chart, palaceScores, palaceAnalyses };
    },
    ["chart-results-v6", key],
    { revalidate: 86400 },
  )();
}
