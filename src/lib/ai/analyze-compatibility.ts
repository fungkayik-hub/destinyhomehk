import { compatibilityChartsContext } from "./compatibility-context";
import {
  computeCompatibilityScore,
  fallbackCompatibilityText,
  scoreToCompatibilityLabel,
} from "./compatibility-score";
import { chatComplete, hasAiConfigured } from "./ai-provider";
import { SUNNY_VOICE_GUIDE } from "./sunny-voice";
import type { CompatibilityResult } from "@/lib/compatibility/types";
import type { ZiWeiChart } from "@/lib/ziwei/types";

const COMPAT_SYSTEM = `${SUNNY_VOICE_GUIDE}

【任務 — 夾桃花配對分析】
你會收到兩張紫微斗數命盤（甲方=你，乙方=對方）及系統估算夾度分數。
請用 Sunny 師傅口吻寫配對分析：鼓勵、貼地、8分讚2分事實。
重點對照：雙方夫妻宮、命宮交叉、福德宮情緒相處。
唔好嚇人；就算分數唔高都要講點樣相處會更好。
分數要合理，參考系統分數，可在 ±8 內調整。

只輸出 JSON，不要 markdown：
{"score":75,"label":"幾夾","summary":"80字內總評","strengths":["亮點1","亮點2","亮點3"],"tips":["相處貼士1","相處貼士2","相處貼士3"],"chemistry":"60字內講雙方化學反應"}
label 必須是：超夾、幾夾、尚可、要多溝通、要用心經營 之一
score 為 40–95 整數`;

function parseCompatibilityJson(raw: string): Omit<CompatibilityResult, "factors" | "provider"> | null {
  const trimmed = raw.trim();
  const jsonText = trimmed.startsWith("{")
    ? trimmed
    : trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1]?.trim() ?? null;

  if (!jsonText) return null;

  try {
    const p = JSON.parse(jsonText) as {
      score?: number;
      label?: string;
      summary?: string;
      strengths?: string[];
      tips?: string[];
      chemistry?: string;
    };

    const score = typeof p.score === "number" ? Math.round(p.score) : NaN;
    if (Number.isNaN(score) || score < 40 || score > 95) return null;

    const labels = ["超夾", "幾夾", "尚可", "要多溝通", "要用心經營"] as const;
    const label =
      labels.find((l) => l === p.label) ?? scoreToCompatibilityLabel(score);

    if (!p.summary || !Array.isArray(p.strengths) || !Array.isArray(p.tips)) return null;

    return {
      score,
      label,
      summary: p.summary,
      strengths: p.strengths.slice(0, 4),
      tips: p.tips.slice(0, 4),
      chemistry: p.chemistry ?? "",
    };
  } catch {
    return null;
  }
}

export async function analyzeCompatibility(
  chartA: ZiWeiChart,
  chartB: ZiWeiChart,
): Promise<CompatibilityResult> {
  const { score: ruleScore, label: ruleLabel, factors } = computeCompatibilityScore(
    chartA,
    chartB,
  );
  const fallbackText = fallbackCompatibilityText(chartA, chartB, ruleScore, ruleLabel);

  if (!hasAiConfigured()) {
    return {
      score: ruleScore,
      label: ruleLabel,
      factors,
      provider: "fallback",
      ...fallbackText,
    };
  }

  try {
    const { text, provider } = await chatComplete(
      [
        { role: "system", content: COMPAT_SYSTEM },
        {
          role: "user",
          content: compatibilityChartsContext(chartA, chartB, ruleScore, ruleLabel),
        },
      ],
      1200,
    );

    const parsed = parseCompatibilityJson(text);
    if (!parsed) {
      return {
        score: ruleScore,
        label: ruleLabel,
        factors,
        provider: "fallback",
        ...fallbackText,
      };
    }

    return {
      ...parsed,
      factors,
      provider,
    };
  } catch {
    return {
      score: ruleScore,
      label: ruleLabel,
      factors,
      provider: "fallback",
      ...fallbackText,
    };
  }
}
