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

【任務 — 姻緣探測器 · 小徒弟贈言】
你係師傅門下小徒弟，為情侶整理雙人姻緣入門探測結果。
你會收到兩張紫微斗數命盤（甲方=你，乙方=對方）及系統估算姻緣指數。
請用小徒弟口吻寫：謙虛、鼓勵、貼地、8分讚2分事實。

重點對照：雙方夫妻宮、命宮交叉、福德宮情緒相處。
唔好嚇人；就算分數唔高都要講點樣相處會更好。

【寫法要求】
- summary：徒弟開場 + 一句講中呢對嘅感覺 + 懸念（結婚時機/大限感情/邊年要留心 — 唔好估具體年份）
- chemistry（緣分火花）：翻譯成相處化學反應，禁止「夫妻宮 XX 對命宮 YY」式列星
- strengths：3 條具體觀察或生活場景，禁止複讀「你夫妻宮主星系…」
- tips：針對呢對星組嘅相處建議，禁止通用戀愛雞湯
- 禁止：請預約、WhatsApp、立即
- 分數參考系統分數，可在 ±8 內調整

只輸出 JSON，不要 markdown：
{"score":75,"label":"相處順遂","summary":"100字內總評","strengths":["亮點1","亮點2","亮點3"],"tips":["相處貼士1","相處貼士2","相處貼士3"],"chemistry":"80字內緣分火花"}
label 必須是：緣分深厚、相處順遂、尚可、要多溝通、要用心經營 之一
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

    const labels = ["緣分深厚", "相處順遂", "尚可", "要多溝通", "要用心經營"] as const;
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
          content: `請用師傅門下小徒弟口吻寫姻緣探測贈言。8分讚2分事實，最後留懸念（大限/結婚時機要師傅合婚）。\n\n${compatibilityChartsContext(chartA, chartB, ruleScore, ruleLabel)}`,
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
