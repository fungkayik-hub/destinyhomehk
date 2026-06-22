import { chartToContext } from "./chart-context";
import { chatComplete, hasAiConfigured } from "./ai-provider";
import {
  fallbackPalaceScores,
  parsePalaceScoresJson,
} from "./palace-scores";
import type { PalaceScoresResponse } from "./types";
import type { ZiWeiChart } from "@/lib/ziwei/types";

const PALACE_SCORES_SYSTEM = `你是 Destiny Home 的 Sunny 師傅助手，為紫微斗數十二宮評分。
根據每宮主星、亮度（廟旺得利平不陷）、空宮、命身宮標記評分。
評分傾向正面：廟旺、吉格、貴人星適度加分；陷落唔好過低，60–75 仍可接受。
brief 簡評要 8分讚2分事實 — 講優點同潛力，唔好列缺點。
只輸出 JSON 陣列，不要 markdown：
[{"palace":"命宮","score":78,"brief":"20字內簡評"}]
score 為 1–100 整數。brief 為繁體中文 8–18 字，語氣鼓勵。
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
