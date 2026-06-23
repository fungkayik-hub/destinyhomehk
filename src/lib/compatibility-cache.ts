import { unstable_cache } from "next/cache";
import { analyzeCompatibility } from "@/lib/ai/analyze-compatibility";
import { generateChart } from "@/lib/ziwei/iztro-adapter";
import type { BirthInput } from "@/lib/ziwei/types";

function inputKey(prefix: string, input: BirthInput): string {
  return [
    prefix,
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

/** 同一對出生資料只 call 一次 AI */
export async function getCachedCompatibilityResults(personA: BirthInput, personB: BirthInput) {
  const key = `${inputKey("a", personA)}__${inputKey("b", personB)}`;
  return unstable_cache(
    async () => {
      const chartA = generateChart(personA);
      const chartB = generateChart(personB);
      const result = await analyzeCompatibility(chartA, chartB);
      return { chartA, chartB, result };
    },
    ["compatibility-v1", key],
    { revalidate: 86400 },
  )();
}
