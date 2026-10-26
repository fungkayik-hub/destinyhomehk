import { unstable_cache } from "next/cache";
import {
  buildChartAwareMonthLines,
  isAnnualMonthlyContentAcceptable,
  isKnownGenericMonthlyTemplate,
  MONTHS_ZH,
} from "./annual-report-monthly";
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
const FULL_MIN = 2500;
const LEGACY_BRIEF_MIN = 350;
const LEGACY_BRIEF_MAX = 900;

/** Soft upper bounds — only logged; do not reject AI text solely for length. */
const STANDARD_SOFT_MAX = 12_000;
const FULL_SOFT_MAX = 16_000;

function forecastYear(): number {
  return new Date().getFullYear();
}

function tierRequiresTwelveMonths(tier: AnnualGenerationTier): boolean {
  return tier === "standard" || tier === "full";
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
- **必含十二個月流月**：每月一段，格式「農曆X月 — 主題：…；宜：…；忌：…」
- **十二個月宜、忌必須逐月不同**，要扣大限、流年、四化、流月宮位（唔可以十二個月複製同一句）
- **必含 3–5 條實用化解／加強行動**：行為、時機、溝通、節奏調整
- 字數約 1500–3500 字
- **禁止**：獨立完整「風水佈局」章節或家居方位佈局清單
- 只輸出 JSON：{"year":${year},"tier":"standard","text":"..."}`;
  }

  return `【任務 — ${year} 流年全批（HK$688 檔）】
- **必須包含流年詳批（HK$128）全部要素**：完整流年、十二個月流月、3–5 條實用化解行動
- **十二個月宜、忌必須逐月不同**，要扣大限、流年、四化、流月宮位
- **另加【流年風水點化】**：坐向、床頭、財位、門路／動線等實用提示
- **另加【完整化解清單】**：比詳批更長（8–12 條），涵蓋行為、時機、溝通、簡易空間整理
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
    tierRequiresTwelveMonths(tier)
      ? "流月表要寫足農曆正月至十二月；每月宜忌唔可以重複上一個月。"
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

  const monthLines = buildChartAwareMonthLines(chart, year);
  const insights = computeChartInsights(chart);
  const patternNote =
    insights.patterns.length > 0
      ? `命盤格局參考：${insights.patterns
          .slice(0, 2)
          .map((p) => p.slug)
          .join("、")}。`
      : "宜配合三方四正同大限一齊睇流月。";

  const standardBody = [
    header,
    "",
    intro,
    "",
    "【流年總述】",
    `${year} 年對你係整理方向同取捨嘅年份；${patternNote}宜先守再攻。`,
    "",
    "【十二個月流月】",
    ...monthLines,
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

  return [
    ...standardBody,
    "",
    "【流年風水點化】",
    "• 坐向：書桌宜背靠實牆，面向開闊位。",
    "• 床頭：靠實牆，避免腳直對門。",
    "• 財位：入口對角線附近保持明亮整潔。",
    "• 門路：門口勿阻塞，動線順暢。",
    "",
    "【完整化解清單】",
    "5. 大決定前留 48 小時冷靜期。",
    "6. 每月整理桌面同電子檔。",
    "7. 與家人固定短會同步行程。",
    "8. 壓力高時先處理睡眠同飲食。",
    "9. 重要文件分類存放。",
    "10. 想針對家居方位深入佈局，可 WhatsApp 預約 Sunny 師傅面談（另計）。",
    "",
    "以上為 AI 參考整理，非師傅親批。",
  ].join("\n");
}

export function parseAnnualReportJson(
  raw: string,
  tier: AnnualGenerationTier,
  year: number,
): string | null {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced?.[1]?.trim() ?? trimmed;
  const jsonText = candidate.startsWith("{")
    ? candidate
    : candidate.match(/\{[\s\S]*\}/)?.[0]?.trim() ?? null;
  if (!jsonText) return null;
  try {
    const obj = JSON.parse(jsonText) as {
      tier?: string;
      year?: number | string;
      text?: string;
    };
    const objYear =
      typeof obj.year === "number" ? obj.year : Number.parseInt(String(obj.year), 10);
    if (!Number.isFinite(objYear) || objYear !== year) return null;
    const objTier = typeof obj.tier === "string" ? obj.tier.trim() : tier;
    if (objTier !== tier) return null;
    if (typeof obj.text !== "string") return null;
    return obj.text.trim();
  } catch {
    return null;
  }
}

function isLengthOk(text: string, tier: AnnualGenerationTier): boolean {
  const len = text.trim().length;
  if (tier === "legacyBrief") {
    return len >= LEGACY_BRIEF_MIN && len <= LEGACY_BRIEF_MAX;
  }
  if (tier === "standard") {
    return len >= STANDARD_MIN && len <= STANDARD_SOFT_MAX;
  }
  return len >= FULL_MIN && len <= FULL_SOFT_MAX;
}

function isAnnualReportTextAcceptable(
  text: string,
  tier: AnnualGenerationTier,
): boolean {
  if (!isLengthOk(text, tier)) return false;
  return isAnnualMonthlyContentAcceptable(text, tierRequiresTwelveMonths(tier));
}

function maxTokensForTier(tier: AnnualGenerationTier): number {
  if (tier === "legacyBrief") return 1200;
  if (tier === "standard") return 4000;
  return 6500;
}

function logAnnualFallback(
  reason: string,
  detail: Record<string, unknown>,
): void {
  console.warn("[annual-report] using fallback:", reason, detail);
}

/** Stored reports with the old template or duplicate 宜忌 should regenerate. */
export function shouldRegenerateStoredAnnualReport(
  text: string,
  tier: AnnualGenerationTier,
): boolean {
  if (!tierRequiresTwelveMonths(tier)) return false;
  return (
    isKnownGenericMonthlyTemplate(text) ||
    !isAnnualMonthlyContentAcceptable(text, true)
  );
}

async function generateAnnualReportFromAi(
  chart: ZiWeiChart,
  tier: AnnualGenerationTier,
  year: number,
): Promise<{ text: string; provider: "openai" | "azure" } | null> {
  const insights = computeChartInsights(chart);
  const userPrompt = buildAnnualReportPrompt(chart, insights, tier, year);
  const messages = [
    { role: "system" as const, content: buildAnnualReportSystem(tier, year) },
    { role: "user" as const, content: userPrompt },
  ];

  for (let attempt = 0; attempt < 2; attempt++) {
    const { text, provider } = await chatComplete(
      messages,
      maxTokensForTier(tier),
      { temperature: attempt === 0 ? 0.72 : 0.55 },
    );

    const parsed = parseAnnualReportJson(text, tier, year);
    if (parsed && isAnnualReportTextAcceptable(parsed, tier)) {
      return { text: parsed, provider };
    }

    logAnnualFallback("ai_output_rejected", {
      tier,
      year,
      attempt,
      rawLength: text.length,
      parsedLength: parsed?.length ?? 0,
      parsedOk: Boolean(parsed),
      lengthOk: parsed ? isLengthOk(parsed, tier) : false,
      monthlyOk: parsed
        ? isAnnualMonthlyContentAcceptable(
            parsed,
            tierRequiresTwelveMonths(tier),
          )
        : false,
    });
  }

  return null;
}

export async function analyzeAnnualReport(
  chart: ZiWeiChart,
  tier: AnnualGenerationTier,
): Promise<{ text: string; provider: "openai" | "azure" | "fallback" }> {
  const year = forecastYear();
  const fallback = fallbackAnnualReport(chart, tier, year);

  if (!hasAiConfigured()) {
    logAnnualFallback("no_ai_configured", { tier, year });
    return { text: fallback, provider: "fallback" };
  }

  try {
    const aiResult = await generateAnnualReportFromAi(chart, tier, year);
    if (aiResult) {
      return aiResult;
    }
    return { text: fallback, provider: "fallback" };
  } catch (err) {
    logAnnualFallback("ai_exception", {
      tier,
      year,
      message: err instanceof Error ? err.message : String(err),
    });
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

/** @internal re-export for scripts */
export { MONTHS_ZH };
