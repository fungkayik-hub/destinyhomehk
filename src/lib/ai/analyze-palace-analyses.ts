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
- 命宮 **220–300 字**：必须「一開波」讲天生格局（钱/桃花/权/特殊格），主星要讲 2–3 个具体优点
- 其他宫 **140–200 字**：每宫要讲清「管咩」+ 主星特质 + 具体观察，唔好空泛
- 必须提及该宫主星同亮度；有辅星就一并讲
- 每宫结尾可轻留悬念，令人想睇下一宫或想知更多
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
          content: `請用 Sunny 師傅中洲派口吻寫十二宮分析。比例約 8分讚、2分事實。每宮要有料、具體，唔好太空泛好似乜都冇講。命宮最長最豐富；其他宮 140–200 字，講清呢宮管咩、主星帶出咩際遇，結尾可輕帶「配合成張盤仲有層次」令人想知多啲。\n\n${chartToContext(chart)}`,
        },
      ],
      5000,
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
