import { chartToContext } from "./chart-context";
import { computeChartInsights } from "./chart-insights";
import { chatComplete, hasAiConfigured } from "./ai-provider";
import {
  fallbackPalaceAnalyses,
  isAnalysisTooThin,
  parseMingPalaceJson,
  parsePalaceAnalysesJson,
} from "./palace-analyses";
import {
  MING_PALACE_OPENING_EXAMPLE,
  PALACE_ANALYSIS_EXAMPLE,
  STAR_TRAIT_HINTS,
  SUNNY_VOICE_GUIDE,
} from "./sunny-voice";
import type { PalaceAnalysesResponse, PalaceAnalysis } from "./types";
import type { PalaceName, ZiWeiChart } from "@/lib/ziwei/types";
import { PALACES } from "@/lib/ziwei/types";

const OTHER_PALACES = PALACES.filter((p) => p !== "命宮");

const MING_SYSTEM = `${SUNNY_VOICE_GUIDE}

${STAR_TRAIT_HINTS}

【任務 — 只寫命宮】
- 用**小徒弟**口吻，唔好扮 Sunny 師傅本人
- **開頭先要讚優點**，再講主星、格局、生活場景（8分讚2分事實）
- **280–380 字**，唔好只寫兩三句就收工；要有標籤、2–3個生活場景、輔星/四化、格局
- 禁止「一開波睇成張盤」
- **必須引用** prompt 入面「排盤摘要」嘅格局名、主星組合標籤、身命差異
- 若程式寫「未命中常見格名」，要解釋主星組合仍有咩力，唔好話冇格局
- 有 ✓ 格局就直講格名；△ 就講「有呢個傾向，師傅定盤會確認」
- 最後一句必須係懸念句（大限/定盤/時間軸）
- 只輸出 JSON 物件，不要 markdown：{"palace":"命宮","text":"..."}

【命宮示例（唔好照抄 — 徒弟口吻 + 懸念）】
${MING_PALACE_OPENING_EXAMPLE}`;

const OTHER_SYSTEM = `${SUNNY_VOICE_GUIDE}

${STAR_TRAIT_HINTS}

【任務 — 寫除命宮外十一宮】
- 用**小徒弟**口吻，每宮 **180–240 字**
- 標籤 + 場景 + 觀察，唔好寫到人人一樣
- **唔好重複命宮已用嘅標籤、用字、場景**
- 官祿宮：1–2 個具體事業方向 + 一句實操建議
- 夫妻宮：相處模式 + 適合另一半 2–3 個特質
- 每宮最後一句必須係**懸念句**（唔同句式，唔同宮用唔同懸念類型）
- 必須提及該宮主星同亮度
- 只輸出 JSON 陣列，不要 markdown：
[{"palace":"兄弟宮","text":"..."}]
- 必須包含：兄弟宮、夫妻宮、子女宮、財帛宮、疾厄宮、遷移宮、奴僕宮、官祿宮、田宅宮、福德宮、父母宮（唔包括命宮）

【其他宮示例（唔好照抄）】
${PALACE_ANALYSIS_EXAMPLE}`;

async function analyzeMingPalace(
  chart: ZiWeiChart,
  context: string,
): Promise<{ analysis: PalaceAnalysis; provider: "openai" | "azure" | "fallback" }> {
  const fallback = fallbackPalaceAnalyses(chart).find((a) => a.palace === "命宮")!;

  const { text, provider } = await chatComplete(
    [
      { role: "system", content: MING_SYSTEM },
      {
        role: "user",
        content: `請用 Sunny 師傅門下小徒弟口吻只寫命宮贈言。**至少 280 字**。開頭先要讚佢嘅優點同潛力，再講主星、輔星、四化、格局、2–3個生活場景。必須引用下面「排盤摘要」。最後一句留懸念（大限/師傅親批）。8分讚2分事實。\n\n${context}`,
      },
    ],
    1200,
    { temperature: 0.85 },
  );

  const parsed = parseMingPalaceJson(text);
  const analysis =
    parsed && !isAnalysisTooThin(parsed.text, "命宮") ? parsed : fallback;
  return {
    analysis,
    provider: parsed && !isAnalysisTooThin(parsed.text, "命宮") ? provider : "fallback",
  };
}

async function analyzeOtherPalaces(
  context: string,
  mingAnalysis: PalaceAnalysis,
): Promise<{ analyses: PalaceAnalysis[] | null; provider: "openai" | "azure" | "fallback" }> {
  const { text, provider } = await chatComplete(
    [
      { role: "system", content: OTHER_SYSTEM },
      {
        role: "user",
        content: `請用師傅門下小徒弟口吻寫除命宮外十一宮贈言，每宮至少 180 字。命宮已寫好（唔好重複）：
「${mingAnalysis.text.slice(0, 160)}…」
命宮標籤同用字唔好喺其他宮再抄。官祿講具體事業方向；夫妻講適合伴侶特質。每宮最後一句懸念句。8分讚2分事實。\n\n${context}`,
      },
    ],
    4800,
    { temperature: 0.75 },
  );

  const parsed = parsePalaceAnalysesJson(text, OTHER_PALACES as PalaceName[]);
  return { analyses: parsed, provider: parsed ? provider : "fallback" };
}

export async function analyzePalaceAnalyses(
  chart: ZiWeiChart,
): Promise<PalaceAnalysesResponse> {
  const fallback = fallbackPalaceAnalyses(chart);

  if (!hasAiConfigured()) {
    return { analyses: fallback, provider: "fallback" };
  }

  const insights = computeChartInsights(chart);
  const context = chartToContext(chart, insights);

  try {
    const mingResult = await analyzeMingPalace(chart, context);
    const otherResult = await analyzeOtherPalaces(context, mingResult.analysis);

    if (!otherResult.analyses) {
      return { analyses: fallback, provider: "fallback" };
    }

    const analyses: PalaceAnalysis[] = [
      mingResult.analysis,
      ...otherResult.analyses.map((a) => {
        if (isAnalysisTooThin(a.text, a.palace)) {
          const fb = fallback.find((f) => f.palace === a.palace);
          return fb ?? a;
        }
        return a;
      }),
    ];

    const provider =
      mingResult.provider !== "fallback" || otherResult.provider !== "fallback"
        ? mingResult.provider !== "fallback"
          ? mingResult.provider
          : otherResult.provider
        : "fallback";

    return { analyses, provider };
  } catch {
    return { analyses: fallback, provider: "fallback" };
  }
}
