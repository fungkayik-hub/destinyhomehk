import { unstable_cache } from "next/cache";
import { analyzePalaceAnalyses } from "@/lib/ai/analyze-palace-analyses";
import { analyzePalaceScores } from "@/lib/ai/analyze-palace-scores";
import { buildChartKey } from "@/lib/chart-key";
import { generateChart } from "@/lib/ziwei/iztro-adapter";
import type { BirthInput } from "@/lib/ziwei/types";

/** 同一出生資料只 call 一次 AI，換排版唔使再等 */
export async function getCachedChartResults(input: BirthInput) {
  const key = buildChartKey(input);
  return unstable_cache(
    async () => {
      const chart = generateChart(input);
      const [palaceScores, palaceAnalyses] = await Promise.all([
        analyzePalaceScores(chart),
        analyzePalaceAnalyses(chart),
      ]);
      return { chart, palaceScores, palaceAnalyses };
    },
    ["chart-results-v9", key],
    { revalidate: 86400 },
  )();
}
