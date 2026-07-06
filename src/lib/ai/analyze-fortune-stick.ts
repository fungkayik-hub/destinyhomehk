import { chatComplete, hasAiConfigured } from "@/lib/ai/ai-provider";
import { getLotByNumber } from "@/lib/fortune-stick/lots";
import {
  detectQuestionTheme,
  gradeSummaryForQuestion,
} from "@/lib/fortune-stick/question-theme";
import type { GuanyinLot } from "@/lib/fortune-stick/types";

const SYSTEM = `你係 Destiny Home Sunny 師傅門下嘅「小徒弟」，專門為客人解觀音靈籤。
語氣：謙虛、貼地、溫暖，用繁體中文（香港用語），8分鼓勵2分提醒。
你唔係師傅本人；解讀僅供參考，唔好扮權威斷言。

【最重要 — 必須直接答客人問題】
- 開頭第一句就要針對客人問題俾方向（例如「就你問嘅轉工一事…」），唔可以只背籤文
- 全文每一段都要同客人問題有關；唔好寫成通用百科
- 若籤意同問題看似無關，要解釋「點樣用籤意理解你件事」
- 禁止避開問題、禁止只複述籤詩而唔分析

【寫作要求】
- 800–1100 字，分段清晰，唔好用 markdown 標題符號
- 結構：
  1) 開場：直接回應客人問題 + 第幾籤、吉凶等級
  2) 籤詩白話解讀（逐句或整體）
  3) 針對客人問題嘅分析（現況、障礙、心態、宜守定宜攻）
  4) 具體建議 3–4 點（可行動，要同問題有關）
  5) 時間/走向提示（用「近期」「下半年」等，唔好估具體年份月份）
  6) 收尾：鼓勵 + 提醒深入問事可預約師傅（唔好寫 WhatsApp 電話）
- 必須結合籤文、典故同客人問題
- 禁止：醫療診斷、投資保證、「一定會」「100%」
- 禁止：請立即付費、訂閱等推銷`;

function lotContext(lot: GuanyinLot): string {
  return [
    `第 ${lot.number} 籤`,
    `等級：${lot.grade}`,
    `籤詩：\n${lot.poem}`,
    `籤文解釋：\n${lot.explanation}`,
    lot.aspects ? `各方面：\n${lot.aspects}` : "",
    lot.advice ? `忠告：${lot.advice}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function pickAspectSnippet(lot: GuanyinLot, theme: string): string {
  if (!lot.aspects) return "";
  const lines = lot.aspects.split("\n").filter(Boolean);
  const keywordMap: Record<string, RegExp> = {
    "事業／工作": /事業|工作|願望/,
    "感情／姻緣": /感情|姻緣|交往|結婚|盼望的人/,
    "健康／身體": /疾病|健康/,
    "財運／金錢": /財|願望/,
    "學業／考試": /學業|考試|願望/,
    "去留／變動": /旅行|搬家|移民/,
    "家庭／家人": /家庭|家人/,
  };
  const pattern = keywordMap[theme] ?? /願望/;
  const hit = lines.find((line) => pattern.test(line));
  return hit ?? lines[0] ?? "";
}

export function fallbackInterpretation(
  question: string,
  lot: GuanyinLot,
): string {
  const theme = detectQuestionTheme(question);
  const aspectLine = pickAspectSnippet(lot, theme);
  const themeSummary = gradeSummaryForQuestion(lot.grade, theme);
  const poemLine = lot.poem.split("\n").filter(Boolean).join("；");

  return [
    `【你的問題】${question.trim()}`,
    "",
    `就你問嘅「${theme}」，抽中第 ${lot.number} 籤（${lot.grade}）。`,
    "",
    themeSummary,
    "",
    `籤詩：${poemLine}。`,
    "",
    aspectLine ? `籤文相關提示：${aspectLine}` : "",
    lot.advice ? `籤文忠告：${lot.advice}` : "",
    "",
    "小徒弟建議你：",
    "一，先將問題拆做「而家可控」同「要等待」兩部分，唔好一次過想要全部答案；",
    `二，就「${theme}」而言，${lot.grade.includes("凶") ? "近一兩個月宜守勢，重要決定等多啲資訊" : "可以穩步推進，但唔好因心急而亂作決定"}；`,
    "三，對人保持誠意同行穩，貴人運會在你整理好心態之後慢慢出現。",
    "",
    "以上為小徒弟按籤文同你條問題整理嘅參考，非 Sunny 師傅親批。若想結合命盤同流年深入問事，歡迎預約師傅。",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function analyzeFortuneStick(
  question: string,
  lotNumber: number,
): Promise<{ text: string; provider: string }> {
  const lot = getLotByNumber(lotNumber);
  if (!lot) {
    throw new Error("invalid_lot");
  }

  const trimmed = question.trim();
  const theme = detectQuestionTheme(trimmed);

  if (!hasAiConfigured()) {
    return { text: fallbackInterpretation(trimmed, lot), provider: "fallback" };
  }

  const userPrompt = [
    `【客人問題 — 必須直接回答】`,
    trimmed,
    "",
    `【問題主題（供你參考）】${theme}`,
    "",
    `【籤資料】`,
    lotContext(lot),
    "",
    "請按系統要求寫完整解籤。記住：第一句就要針對客人問題俾方向，唔好只背籤文。",
  ].join("\n");

  try {
    const { text, provider } = await chatComplete(
      [
        { role: "system", content: SYSTEM },
        { role: "user", content: userPrompt },
      ],
      1800,
      { temperature: 0.75 },
    );
    return { text, provider };
  } catch (err) {
    console.error("Fortune stick AI failed:", err);
    return { text: fallbackInterpretation(trimmed, lot), provider: "fallback" };
  }
}
