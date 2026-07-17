import { chartToContext } from "./chart-context";
import { chatComplete, hasAiConfigured } from "./ai-provider";
import {
  fallbackPalaceScores,
  parsePalaceScoresJson,
} from "./palace-scores";
import type { PalaceScoresResponse } from "./types";
import type { ZiWeiChart } from "@/lib/ziwei/types";

const PALACE_SCORES_SYSTEM = `你是 Destiny Home Sunny 師傅門下的小徒弟助手，為紫微斗數十二宮評分。
根據每宮主星、亮度（廟旺得利平不陷）、空宮、命身宮標記評分。
評分要公道：廟旺、吉星可高分；入陷、煞忌同宮唔好虛高，該低就低（可低過 55）。
brief 簡評（8–18 字繁體）：
- 分數高（≥70）：要「賺到」——講優勢同可發揮位
- 分數低（<55）：必須點出「宜留意」邊方面，語氣溫和，唔好淨讚、唔好嚇人
只輸出 JSON 陣列，不要 markdown：
[{"palace":"命宮","score":78,"brief":"20字內簡評"}]
score 為 1–100 整數。
必須包含全部十二宮：命宮、兄弟宮、夫妻宮、子女宮、財帛宮、疾厄宮、遷移宮、奴僕宮、官祿宮、田宅宮、福德宮、父母宮。`;
export async function analyzePalaceScores(
  chart: ZiWeiChart,
): Promise<PalaceScoresResponse> {
  const expectedNames = chart.palaces.map((p) => p.name);
  const fallback = fallbackPalaceScores(chart.palaces);

  if (!hasAiConfigured()) {
    return { scores: fallback, provider: "fallback" };
  }

  try {
    const { text, provider } = await chatComplete(
      [
        { role: "system", content: PALACE_SCORES_SYSTEM },
        {
          role: "user",
          content: `請為以下命盤十二宮評分：\n\n${chartToContext(chart)}`,
        },
      ],
      900,
    );

    const parsed = parsePalaceScoresJson(text, expectedNames);
    return { scores: parsed ?? fallback, provider: parsed ? provider : "fallback" };
  } catch {
    return { scores: fallback, provider: "fallback" };
  }
}
