import { chatComplete, hasAiConfigured } from "@/lib/ai/ai-provider";
import { getLotByNumber } from "@/lib/fortune-stick/lots";
import type { GuanyinLot } from "@/lib/fortune-stick/types";

const SYSTEM = `你係 Destiny Home Sunny 師傅門下嘅「小徒弟」，專門為客人解觀音靈籤。
語氣：謙虛、貼地、溫暖，用繁體中文（香港用語），8分鼓勵2分提醒。
你唔係師傅本人；解讀僅供參考，唔好扮權威斷言。

【寫作要求】
- 800–1100 字，分段清晰，唔好用 markdown 標題符號
- 結構：
  1) 開場：重述客人問題 + 第幾籤、吉凶等級
  2) 籤詩白話解讀（逐句或整體）
  3) 針對客人問題嘅分析（現況、障礙、心態）
  4) 具體建議 3–4 點（可行動）
  5) 時間/走向提示（用「近期」「下半年」等，唔好估具體年份月份）
  6) 收尾：鼓勵 + 提醒深入問事可預約師傅（唔好寫 WhatsApp 電話）
- 必須結合籤文同典故，唔好只背百科
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

export function fallbackInterpretation(
  question: string,
  lot: GuanyinLot,
): string {
  const lines = lot.poem.split("\n").filter(Boolean);
  return [
    `你問：「${question}」`,
    "",
    `抽中第 ${lot.number} 籤（${lot.grade}）。籤詩：${lines.join("；")}。`,
    "",
    "小徒弟讀籤：呢支籤提醒你先穩住心，唔好因為心急而亂作決定。你而家面對嘅事，表面似卡住，其實係要你整理清楚自己真正想要咩。",
    "",
    "建議你：一，將問題寫低，分開「可控」同「不可控」；二，近一兩個月以守為主，重要決定等多啲資訊；三，對人保持誠意，貴人運會喺你放低執著之後出現。",
    "",
    "以上為小徒弟按籤文整理嘅參考，非 Sunny 師傅親批。若想結合命盤同流年深入問事，歡迎預約師傅。",
  ].join("\n");
}

export async function analyzeFortuneStick(
  question: string,
  lotNumber: number,
): Promise<{ text: string; provider: string }> {
  const lot = getLotByNumber(lotNumber);
  if (!lot) {
    throw new Error("invalid_lot");
  }

  if (!hasAiConfigured()) {
    return { text: fallbackInterpretation(question, lot), provider: "fallback" };
  }

  const userPrompt = `【客人問題】\n${question.trim()}\n\n【籤資料】\n${lotContext(lot)}\n\n請按系統要求寫完整解籤。`;

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
    return { text: fallbackInterpretation(question, lot), provider: "fallback" };
  }
}
