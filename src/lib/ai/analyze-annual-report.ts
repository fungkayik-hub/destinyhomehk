import { unstable_cache } from "next/cache";
import { chartToContext } from "./chart-context";
import {
  computeChartInsights,
  formatInsightsBlock,
  type ChartInsights,
} from "./chart-insights";
import { PALACE_REPORT_VOICE_GUIDE } from "./palace-report-voice";
import { chatComplete, hasAiConfigured } from "./ai-provider";
import { formatDecadalBlock, findDecadalAtAge, nominalAge } from "@/lib/ziwei/chart-decadal";
import type { PalaceReportTier } from "@/lib/palace-report/config";
import type { ZiWeiChart } from "@/lib/ziwei/types";

/** Includes legacy brief regeneration for old purchases only. */
export type AnnualGenerationTier = PalaceReportTier | "legacyBrief";

const STANDARD_MIN = 1200;
const STANDARD_MAX = 4500;
const FULL_MIN = 2500;
const FULL_MAX = 9000;
const LEGACY_BRIEF_MIN = 350;
const LEGACY_BRIEF_MAX = 900;

function forecastYear(): number {
  return new Date().getFullYear();
}

function tierInstructions(tier: AnnualGenerationTier, year: number): string {
  if (tier === "legacyBrief") {
    return `【任務 — ${year} 流年簡批（舊版檔）】
- 流年重點、短總結、整體宜／忌
- 字數約 400–800 字
- **禁止**流月表、風水章節、長化解清單
- 只輸出 JSON：{"year":${year},"tier":"legacyBrief","text":"..."}`;
  }

  if (tier === "standard") {
    return `【任務 — ${year} 流年詳批（HK$128 檔）】
- 完整流年分析：主題、機遇、壓力位、與大限／命宮如何呼應
- **必含十二個月流月**：每月一段，格式「農曆X月 — 主題：…；宜：…；忌：…」；十二個月主題必須互相區分
- **必含 3–5 條實用化解／加強行動**：行為、時機、溝通、節奏調整
- 字數約 1500–3500 字
- **禁止**：獨立完整「風水佈局」章節或家居方位佈局清單
- 只輸出 JSON：{"year":${year},"tier":"standard","text":"..."}`;
  }

  return `【任務 — ${year} 流年全批（HK$688 檔）】
必須用清楚章節標題，三層缺一不可：

1. **【一生大運】** — 本命層：命盤格局、命宮主星與三方四正、身宮（如有）、一生宜忌主軸；唔需要逐宮長文
2. **【十年大運】** — 大限層：必引用下方「十年大限」程式資料，列出各段虛歲大限並附可讀註解；標明▶ 而家行緊邊段
3. **【流年命運】** — 當年層：${year} 年流年總述；**必含十二個月流月**（格式「農曆X月 — 主題：…；宜：…；忌：…」），十二個月主題必須互相區分；**必含 3–5 條實用化解／加強行動**

- 風水佈局章節可選，唔係本檔定義重點；唔好將全批等同「詳批加風水」
- 字數約 3000–7000 字
- 可文末一句：想師傅親批面談可 WhatsApp 預約（唔開新收費項目）
- 只輸出 JSON：{"year":${year},"tier":"full","text":"..."}`;
}

function buildAnnualReportSystem(tier: AnnualGenerationTier, year: number): string {
  return `${PALACE_REPORT_VOICE_GUIDE}

${tierInstructions(tier, year)}`;
}

function tierLabelZh(tier: AnnualGenerationTier): string {
  switch (tier) {
    case "legacyBrief":
      return "簡批";
    case "standard":
      return "詳批";
    case "full":
      return "全批";
  }
}

function buildAnnualReportPrompt(
  chart: ZiWeiChart,
  insights: ChartInsights,
  tier: AnnualGenerationTier,
  year: number,
): string {
  const age = nominalAge(chart.input.year);
  const currentDecadal = chart.decadalTimeline?.length
    ? findDecadalAtAge(chart.decadalTimeline, age)
    : undefined;

  return [
    `請為以下命盤撰寫 ${year} 年流年命書（${tierLabelZh(tier)}）。`,
    `客人而家約 ${age} 虛歲。`,
    currentDecadal
      ? `目前大限：${currentDecadal.ageStart}–${currentDecadal.ageEnd} 虛歲走【${currentDecadal.palace}】。`
      : "",
    "",
    formatDecadalBlock(chart),
    "",
    formatInsightsBlock(insights),
    "",
    chartToContext(chart, insights),
  ]
    .filter(Boolean)
    .join("\n");
}

const MONTHS_ZH = [
  "正月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "十一月", "十二月",
];

const FALLBACK_MONTH_THEMES = [
  "開局定調",
  "人際拓展",
  "理財修整",
  "職涯節奏",
  "感情溝通",
  "健康作息",
  "進修充電",
  "合作簽約",
  "守成鞏固",
  "變動應對",
  "收攏資源",
  "總結鋪排",
] as const;

function monthLines(): string[] {
  return MONTHS_ZH.map(
    (m, i) =>
      `${m} — 主題：${FALLBACK_MONTH_THEMES[i]}；宜：按計劃小步前進、溝通確認；忌：情緒化決策、過度承諾。`,
  );
}

/** 流月主題唔可以全部雷同（standard / full 品質門檻） */
export function monthlyThemesDistinctEnough(text: string): boolean {
  const themes: string[] = [];
  for (const m of MONTHS_ZH) {
    const re = new RegExp(`${m}[^\\n]*主題[：:]([^；;\\n]+)`);
    const match = text.match(re);
    if (match?.[1]) themes.push(match[1].trim());
  }
  if (themes.length < 12) return false;
  return new Set(themes).size >= 8;
}

export function fullTierStructureOk(text: string): boolean {
  return (
    /【一生大運】/.test(text) &&
    /【十年大運】/.test(text) &&
    /【流年命運】/.test(text)
  );
}

function tierContentQualityOk(text: string, tier: AnnualGenerationTier): boolean {
  if (tier === "standard") return monthlyThemesDistinctEnough(text);
  if (tier === "full") {
    return fullTierStructureOk(text) && monthlyThemesDistinctEnough(text);
  }
  return true;
}

function fallbackAnnualReport(
  chart: ZiWeiChart,
  tier: AnnualGenerationTier,
  year: number,
): string {
  const age = nominalAge(chart.input.year);
  const decadal = chart.decadalTimeline?.length
    ? findDecadalAtAge(chart.decadalTimeline, age)
    : undefined;

  const header = `【${year} 流年${tierLabelZh(tier)} · 網上小師傅命書】`;
  const intro = decadal
    ? `你而家約 ${age} 虛歲，行【${decadal.palace}】大限（${decadal.ageStart}–${decadal.ageEnd} 虛歲）。${year} 年流年要同呢段大限一齊睇。`
    : `${year} 年流年要配合命宮主星同大限方向一齊睇。`;

  if (tier === "legacyBrief") {
    return [
      header,
      "",
      intro,
      "",
      "【流年重點】",
      "• 工作節奏宜穩中求進，唔好一次賭晒所有資源。",
      "• 人際同合作位要講清楚期望，減少誤會。",
      "",
      "【短總結】",
      "今年整體係「調結構、守基本盤」嘅年份。",
      "",
      "【宜】定目標、整理財務、定期運動。",
      "【忌】衝動簽約、過度透支、熬夜硬撐。",
      "",
      "以上為 AI 參考整理，非師傅親批。",
    ].join("\n");
  }

  const standardBody = [
    header,
    "",
    intro,
    "",
    "【流年總述】",
    `${year} 年對你係整理方向同取捨嘅年份；宜先守再攻。`,
    "",
    "【十二個月流月】",
    ...monthLines(),
    "",
    "【實用化解／加強行動】",
    "1. 每季一次檢視目標，刪減唔再服務你嘅承諾。",
    "2. 重要對話選精神好嘅日子，先寫三點要講嘅重點。",
    "3. 財務大支出留緩衝期，唔好臨急簽約。",
    "4. 固定每周兩次運動或散步，當作「重置鍵」。",
  ];

  if (tier === "standard") {
    return [
      ...standardBody,
      "",
      "以上為 AI 參考整理，非師傅親批；想定盤同深入流年可 WhatsApp 預約師傅。",
    ].join("\n");
  }

  const soul = chart.palaces.find((p) => p.isSoulPalace);
  const soulStars =
    soul?.stars
      .filter((s) => s.type !== "minor")
      .map((s) => s.name)
      .join("、") || "空宮";
  const bodyPalace = chart.palaces.find((p) => p.isBodyPalace)?.name;

  const decadalLines =
    chart.decadalTimeline?.map((d) => {
      const mark =
        decadal && d.palace === decadal.palace ? "▶ 而家 " : "";
      return `${mark}${d.ageStart}–${d.ageEnd} 虛歲走【${d.palace}】：配合本命此宮主題，留意該十年嘅取捨同人際節奏。`;
    }) ?? ["排盤未載大限資料，請以命宮同流年層為主。"];

  return [
    header,
    "",
    "【一生大運】",
    `命宮（${soulStars}）為一生格局核心；宜先守基本盤、再按大限節奏取捨。`,
    bodyPalace ? `身宮在【${bodyPalace}】，後天際遇同決策風格會偏向此宮主題。` : "",
    "一生宜：定方向、累積專長、維持可持續人際。忌：賭一把式轉向、長期透支健康。",
    "",
    "【十年大運】",
    ...decadalLines,
    "",
    "【流年命運】",
    intro,
    "",
    "【流年總述】",
    `${year} 年對你係整理方向同取捨嘅年份；宜先守再攻，配合而家大限主題。`,
    "",
    "【十二個月流月】",
    ...monthLines(),
    "",
    "【實用化解／加強行動】",
    "1. 每季一次檢視目標，刪減唔再服務你嘅承諾。",
    "2. 重要對話選精神好嘅日子，先寫三點要講嘅重點。",
    "3. 財務大支出留緩衝期，唔好臨急簽約。",
    "4. 固定每周兩次運動或散步，當作「重置鍵」。",
    "",
    "以上為 AI 參考整理，非師傅親批；想定盤同深入大限流年可 WhatsApp 預約師傅。",
  ]
    .filter(Boolean)
    .join("\n");
}

function parseAnnualReportJson(
  raw: string,
  tier: AnnualGenerationTier,
  year: number,
): string | null {
  const trimmed = raw.trim();
  const jsonText = trimmed.startsWith("{")
    ? trimmed
    : trimmed.match(/\{[\s\S]*\}/)?.[0]?.trim() ?? null;
  if (!jsonText) return null;
  try {
    const obj = JSON.parse(jsonText) as { tier?: string; year?: number; text?: string };
    if (obj.tier !== tier || obj.year !== year || typeof obj.text !== "string") return null;
    return obj.text.trim();
  } catch {
    return null;
  }
}

function isLengthOk(text: string, tier: AnnualGenerationTier): boolean {
  const len = text.trim().length;
  if (tier === "legacyBrief") return len >= LEGACY_BRIEF_MIN && len <= LEGACY_BRIEF_MAX;
  if (tier === "standard") return len >= STANDARD_MIN && len <= STANDARD_MAX;
  return len >= FULL_MIN && len <= FULL_MAX;
}

function maxTokensForTier(tier: AnnualGenerationTier): number {
  if (tier === "legacyBrief") return 1200;
  if (tier === "standard") return 4000;
  return 6500;
}

export async function analyzeAnnualReport(
  chart: ZiWeiChart,
  tier: AnnualGenerationTier,
): Promise<{ text: string; provider: "openai" | "azure" | "fallback" }> {
  const year = forecastYear();
  const fallback = fallbackAnnualReport(chart, tier, year);

  if (!hasAiConfigured()) {
    return { text: fallback, provider: "fallback" };
  }

  const insights = computeChartInsights(chart);
  const userPrompt = buildAnnualReportPrompt(chart, insights, tier, year);

  try {
    const { text, provider } = await chatComplete(
      [
        { role: "system", content: buildAnnualReportSystem(tier, year) },
        { role: "user", content: userPrompt },
      ],
      maxTokensForTier(tier),
      { temperature: 0.72 },
    );

    const parsed = parseAnnualReportJson(text, tier, year);
    if (parsed && isLengthOk(parsed, tier) && tierContentQualityOk(parsed, tier)) {
      return { text: parsed, provider };
    }
    return { text: fallback, provider: "fallback" };
  } catch {
    return { text: fallback, provider: "fallback" };
  }
}

export async function getCachedAnnualReport(
  chartKey: string,
  chart: ZiWeiChart,
  tier: AnnualGenerationTier,
): Promise<{ text: string; provider: "openai" | "azure" | "fallback" }> {
  const year = forecastYear();
  return unstable_cache(
    () => analyzeAnnualReport(chart, tier),
    ["annual-report-v4", chartKey, tier, String(year)],
    { revalidate: 86400 },
  )();
}
