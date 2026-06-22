import { chartToContext } from "./chart-context";
import { chatComplete, hasAiConfigured } from "./ai-provider";
import {
  fallbackPalaceAnalyses,
  parsePalaceAnalysesJson,
} from "./palace-analyses";
import {
  MING_PALACE_OPENING_EXAMPLE,
  PALACE_ANALYSIS_EXAMPLE,
  SUNNY_VOICE_GUIDE,
  ZHONGZHOU_PATTERNS_HINT,
} from "./sunny-voice";
import type { PalaceAnalysesResponse } from "./types";
import type { ZiWeiChart } from "@/lib/ziwei/types";

const SYSTEM = `${SUNNY_VOICE_GUIDE}

${ZHONGZHOU_PATTERNS_HINT}

【任務】為以下命盤十二宮各寫一段免費分析。
- 命宮 150–200 字：必须「一開波」讲天生格局（钱/桃花/权/特殊格名），再讲主星
- 其他宫 80–120 字：短句 + 实用贴士
- 必须提及该宫主星同亮度；有辅星就一并讲
- 只输出 JSON 数组，不要 markdown：
[{"palace":"命宮","text":"..."}]
- 必须包含全部十二宫：命宮、兄弟宮、夫妻宮、子女宮、財帛宮、疾厄宮、遷移宮、奴僕宮、官祿宮、田宅宮、福德宮、父母宮

【命宮開波示例（唔好照抄）】
${MING_PALACE_OPENING_EXAMPLE}

【其他宫示例（唔好照抄）】
${PALACE_ANALYSIS_EXAMPLE}`;
export async function analyzePalaceAnalyses(
  chart: ZiWeiChart,
): Promise<PalaceAnalysesResponse> {
  const expected = chart.palaces.map((p) => p.name);
  const fallback = fallbackPalaceAnalyses(chart.palaces);

  if (!hasAiConfigured()) {
    return { analyses: fallback, provider: "fallback" };
  }

  try {
    const { text, provider } = await chatComplete(
      [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `請用 Sunny 師傅中洲派口吻寫十二宮分析。比例約 8分讚、2分事實 — 多講優點同潛力，星名格局作點綴，缺點輕帶。命宮一開波讚天生格局。其他宮短句+正面貼士。\n\n${chartToContext(chart)}`,
        },
      ],
      2800,
    );

    const parsed = parsePalaceAnalysesJson(text, expected);
    return {
      analyses: parsed ?? fallback,
      provider: parsed ? provider : "fallback",
    };
  } catch {
    return { analyses: fallback, provider: "fallback" };
  }
}
