import { unstable_cache } from "next/cache";
import { analyzePalaceAnalyses } from "@/lib/ai/analyze-palace-analyses";
import { analyzePalaceScores } from "@/lib/ai/analyze-palace-scores";
import { buildChartKey } from "@/lib/chart-key";
import { generateChart } from "@/lib/ziwei/iztro-adapter";
import type { BirthInput, ChartPlateType } from "@/lib/ziwei/types";

/** 同一出生資料 + 盤類型只 call 一次 AI */
export async function getCachedChartResults(
  input: BirthInput,
  plate: ChartPlateType = "heaven",
) {
  const key = buildChartKey(input, plate);
  return unstable_cache(
    async () => {
      const chart = generateChart(input, plate);
      const palaceScores = await analyzePalaceScores(chart);
      const palaceAnalyses = await analyzePalaceAnalyses(chart, palaceScores.scores);
      return { chart, palaceScores, palaceAnalyses };
    },
    ["chart-results-v13", key],
    { revalidate: 86400 },
  )();
}
