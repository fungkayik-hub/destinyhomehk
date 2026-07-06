/** 從客人問題抽出主題 — 免費提示同 fallback 解籤用 */
export function detectQuestionTheme(question: string): string {
  const q = question.trim();
  if (/工作|事業|轉工|辭職|升職|生意|創業|面試|同事|老闆/.test(q)) {
    return "事業／工作";
  }
  if (/感情|姻緣|拍拖|結婚|離婚|復合|分手|暗戀|佢對我|喜歡我|伴侶|男友|女友|老公|老婆/.test(q)) {
    return "感情／姻緣";
  }
  if (/健康|病|身體|手術|懷孕|生育/.test(q)) {
    return "健康／身體";
  }
  if (/財|錢|投資|借貸|還款|生意/.test(q)) {
    return "財運／金錢";
  }
  if (/學業|考試|讀書|升學|面試/.test(q)) {
    return "學業／考試";
  }
  if (/搬家|移民|旅行|出國|去留/.test(q)) {
    return "去留／變動";
  }
  if (/家庭|父母|子女|家人|婆媳/.test(q)) {
    return "家庭／家人";
  }
  return "你關心嘅事";
}

export function gradeTone(grade: string): "good" | "mixed" | "caution" {
  if (grade.includes("凶")) return "caution";
  if (grade.includes("末")) return "mixed";
  return "good";
}

export function gradeSummaryForQuestion(grade: string, theme: string): string {
  const tone = gradeTone(grade);
  if (tone === "good") {
    return `就「${theme}」而言，${grade}帶有順遂、可積極推進之意；但仍要配合籤詩提醒，唔好急躁。`;
  }
  if (tone === "caution") {
    return `就「${theme}」而言，${grade}提醒你宜守不宜攻，先穩住心再作決定。`;
  }
  return `就「${theme}」而言，${grade}屬平穩過渡，宜謹慎觀察，唔好一次過博太大。`;
}
