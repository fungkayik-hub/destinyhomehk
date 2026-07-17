import { chartToContext } from "./chart-context";
import { computeChartInsights } from "./chart-insights";
import { chatComplete, hasAiConfigured } from "./ai-provider";
import {
  fallbackPalaceAnalyses,
  isAnalysisTooThin,
  parseMingPalaceJson,
  parsePalaceAnalysesJson,
} from "./palace-analyses";
import { formatPalacePromptRulesBlock } from "./palace-prompt-rules";
import { formatStarPalaceHintsForChart } from "./star-palace-meanings";
import {
  MING_PALACE_OPENING_EXAMPLE,
  PALACE_ANALYSIS_EXAMPLE,
  STAR_TRAIT_HINTS,
  SUNNY_VOICE_GUIDE,
} from "./sunny-voice";
import type { PalaceAnalysesResponse, PalaceAnalysis, PalaceScore } from "./types";
import type { PalaceName, ZiWeiChart } from "@/lib/ziwei/types";
import { PALACES } from "@/lib/ziwei/types";

const OTHER_PALACES = PALACES.filter((p) => p !== "命宮");

function formatScoresBlock(scores: PalaceScore[]): string {
  if (!scores.length) return "";
  const lines = scores.map((s) => `${s.palace}：${s.score}分（${s.label}）${s.brief ? ` — ${s.brief}` : ""}`);
  return [
    "════ 十二宮評分（寫贈言必須跟從）════",
    "極佳／佳：要賺到呢個分，講清楚優勢同點發揮",
    "待加強／需注意：必須 1–2 句講要留意邊方面（生活場景），語氣「宜／要留意」，即刻補解法，唔好裝睇唔到、唔好嚇人",
    ...lines,
  ].join("\n");
}

const MING_SYSTEM = `${SUNNY_VOICE_GUIDE}

${STAR_TRAIT_HINTS}

${formatPalacePromptRulesBlock("ming")}

【任務 — 只寫命宮】
- 用**小徒弟**口吻，唔好扮 Sunny 師傅本人
- **嚴格跟上面「命宮」專屬規則**
- **必須跟「十二宮評分」**：命宮高分要賺、低分要講留意位
- **必須跟「本盤主星×宮位含義」**寫命宮主星，唔好套錯宮
- **280–380 字**，唔好只寫兩三句就收工
- 禁止「一開波睇成張盤」
- **必須引用** prompt 入面「排盤摘要」嘅格局名、主星組合標籤、身命差異
- 若程式寫「未命中常見格名」，要解釋主星組合仍有咩力，唔好話冇格局
- 有 ✓ 格局就直講格名；△ 就講「有呢個傾向，師傅定盤會確認」
- 最後一句必須係命宮懸念句
- 只輸出 JSON 物件，不要 markdown：{"palace":"命宮","text":"..."}

【命宮示例（唔好照抄 — 徒弟口吻 + 懸念）】
${MING_PALACE_OPENING_EXAMPLE}`;

const OTHER_SYSTEM = `${SUNNY_VOICE_GUIDE}

${STAR_TRAIT_HINTS}

${formatPalacePromptRulesBlock("others")}

【任務 — 寫除命宮外十一宮】
- 用**小徒弟**口吻，每宮 **180–240 字**
- **每一宮嚴格跟上面該宮專屬規則**（主題／必寫／條件／懸念）
- **必須跟「十二宮評分」**：該宮高分要賺優勢；低分（待加強／需注意）必須講留意位 + 溫和解法
- **必須跟「本盤主星×宮位含義」**：寫邊宮就用該星@該宮，禁止把命宮性格句抄去其他宮
- 標籤 + 場景 + 觀察要貼該宮生活範疇，唔好九唔搭八
- **唔好重複命宮已用嘅標籤、用字、場景**
- 唔好十一宮用同一句收尾
- 必須提及該宮主星同亮度
- 只輸出 JSON 陣列，不要 markdown：
[{"palace":"兄弟宮","text":"..."}]
- 必須包含：兄弟宮、夫妻宮、子女宮、財帛宮、疾厄宮、遷移宮、奴僕宮、官祿宮、田宅宮、福德宮、父母宮（唔包括命宮）

【其他宮示例（唔好照抄 — 呢個係財帛宮味道）】
${PALACE_ANALYSIS_EXAMPLE}`;

async function analyzeMingPalace(
  chart: ZiWeiChart,
  context: string,
  scores: PalaceScore[],
): Promise<{ analysis: PalaceAnalysis; provider: "openai" | "azure" | "fallback" }> {
  const fallback = fallbackPalaceAnalyses(chart, scores).find((a) => a.palace === "命宮")!;
  const mingScore = scores.find((s) => s.palace === "命宮");
  const scoreHint = mingScore
    ? `命宮評分 ${mingScore.score}（${mingScore.label}）。${mingScore.score >= 70 ? "高分要賺到優勢。" : mingScore.score < 55 ? "低分必須講留意位。" : "平規，優點為主加一句可執位。"}`
    : "";

  const { text, provider } = await chatComplete(
    [
      { role: "system", content: MING_SYSTEM },
      {
        role: "user",
        content: `請用 Sunny 師傅門下小徒弟口吻只寫命宮贈言。**至少 280 字**。${scoreHint}
開頭可讚潛力，但要跟評分：高分賺優勢、低分講留意。引用「排盤摘要」格局。最後留懸念。\n\n${context}`,
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
  scores: PalaceScore[],
): Promise<{ analyses: PalaceAnalysis[] | null; provider: "openai" | "azure" | "fallback" }> {
  const lowPalaces = scores
    .filter((s) => s.palace !== "命宮" && (s.label === "需注意" || s.label === "待加強" || s.score < 55))
    .map((s) => `${s.palace}(${s.label})`)
    .join("、");
  const highPalaces = scores
    .filter((s) => s.palace !== "命宮" && (s.label === "極佳" || s.label === "佳" || s.score >= 70))
    .map((s) => `${s.palace}(${s.label})`)
    .join("、");

  const { text, provider } = await chatComplete(
    [
      { role: "system", content: OTHER_SYSTEM },
      {
        role: "user",
        content: `請用師傅門下小徒弟口吻寫除命宮外十一宮贈言，每宮至少 180 字。
**每一宮必須跟 system 專屬規則 + 十二宮評分**。
高分宮（要賺）：${highPalaces || "按評分表"}
低分宮（必須講留意位）：${lowPalaces || "若評分表有待加強／需注意就要寫"}
**寫每宮必須引用「本盤主星×宮位含義」該宮嗰句，唔好套錯宮。**
命宮已寫好（唔好重複標籤同用字）：
「${mingAnalysis.text.slice(0, 160)}…」
特別留意：遷移宮只有天機入陷先寫漂泊迷路；官祿要事業方向；夫妻要伴侶特質；疾厄唔講病名。
每宮最後一句用該宮專屬懸念。\n\n${context}`,
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
  scores: PalaceScore[] = [],
): Promise<PalaceAnalysesResponse> {
  const fallback = fallbackPalaceAnalyses(chart, scores);

  if (!hasAiConfigured()) {
    return { analyses: fallback, provider: "fallback" };
  }

  const insights = computeChartInsights(chart);
  const scoreBlock = formatScoresBlock(scores);
  const starPalaceBlock = formatStarPalaceHintsForChart(chart);
  const context = [chartToContext(chart, insights), scoreBlock, starPalaceBlock]
    .filter(Boolean)
    .join("\n\n");

  try {
    const mingResult = await analyzeMingPalace(chart, context, scores);
    const otherResult = await analyzeOtherPalaces(context, mingResult.analysis, scores);

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
