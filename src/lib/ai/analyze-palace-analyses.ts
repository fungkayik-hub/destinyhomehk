import { chartToContext } from "./chart-context";
import { chatComplete, hasAiConfigured } from "./ai-provider";
import {
  fallbackPalaceAnalyses,
  parsePalaceAnalysesJson,
} from "./palace-analyses";
import {
  MING_PALACE_OPENING_EXAMPLE,
  PALACE_ANALYSIS_EXAMPLE,
  STAR_TRAIT_HINTS,
  SUNNY_VOICE_GUIDE,
  ZHONGZHOU_PATTERNS_HINT,
} from "./sunny-voice";
import type { PalaceAnalysesResponse } from "./types";
import type { ZiWeiChart } from "@/lib/ziwei/types";

const SYSTEM = `${SUNNY_VOICE_GUIDE}

${ZHONGZHOU_PATTERNS_HINT}

${STAR_TRAIT_HINTS}

【任務】為以下命盤十二宮各寫一段免費分析。
- 命宮 **220–300 字**：禁止「一開波睇成張盤」；開頭要有**個人標籤**；講清命宮格局 + 至少一個生活場景
- 其他宮 **140–200 字**：每宮都要有標籤 + 場景 + 觀察，唔好寫到人人一樣
- 官祿宮要有 1–2 個具體事業方向（工種/崗位/工作模式）+ 一句實操建議
- 夫妻宮要講相處模式 + 適合另一半 2–3 個特質（要寫到具體）
- 必須提及該宮主星同亮度；有輔星就一併講
- 語氣要肯定、有特色，少講「可能」「類似」「整體」
- 只輸出 JSON 陣列，不要 markdown：
[{"palace":"命宮","text":"..."}]
- 必須包含全部十二宮：命宮、兄弟宮、夫妻宮、子女宮、財帛宮、疾厄宮、遷移宮、奴僕宮、官祿宮、田宅宮、福德宮、父母宮

【命宮示例（唔好照抄）】
${MING_PALACE_OPENING_EXAMPLE}

【其他宮示例（唔好照抄）】
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
          content: `請用 Sunny 師傅中洲派口吻寫十二宮分析。每宮要有個人特色：一句標籤、一個生活場景、一個明顯觀察。命宮開頭要醒，直接講主星同你係咩型人；格局有就直講格名。官祿宮請講具體事業方向；夫妻宮請講適合另一半特質。唔好空泛、唔好人人同一套字。8分讚2分事實。\n\n${chartToContext(chart)}`,
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
