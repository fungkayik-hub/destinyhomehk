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

const BRIEF_MIN = 350;
const BRIEF_MAX = 900;
const DETAILED_MIN = 1200;
const DETAILED_MAX = 4500;

function forecastYear(): number {
  return new Date().getFullYear();
}

function tierInstructions(tier: PalaceReportTier, year: number): string {
  if (tier === "brief") {
    return `【任務 — ${year} 流年簡批（HK$88 檔）】
- 聚焦該公曆年流年對此命盤嘅整體氣場同主題
- 必含：流年重點（2–4 點）、短總結、整體宜／忌方向（各 2–4 條，生活化）
- 字數約 400–800 字
- **禁止**：十二個月流月表、風水佈局清單、長篇化解 checklist、獨立「風水佈局」章節
- 只輸出 JSON：{"year":${year},"tier":"brief","text":"..."}`;
  }

  return `【任務 — ${year} 流年詳批（HK$198 檔）】
- 完整流年分析：主題、機遇、壓力位、與大限／命宮如何呼應
- **必含十二個月流月**：每月一段，格式「農曆X月／公曆約… — 主題：…；宜：…；忌：…」（可簡潔）
- **必含 3–5 條實用化解／加強行動**：行為、時機、溝通、節奏調整；唔寫空泛迷信口號
- 字數約 1500–3500 字
- **禁止**：獨立完整「風水佈局」章節或家居方位佈局清單（簡短提及作息／環境整理可以）
- 只輸出 JSON：{"year":${year},"tier":"detailed","text":"..."}`;
}

function buildAnnualReportSystem(tier: PalaceReportTier, year: number): string {
  return `${PALACE_REPORT_VOICE_GUIDE}

${tierInstructions(tier, year)}`;
}

function buildAnnualReportPrompt(
  chart: ZiWeiChart,
  insights: ChartInsights,
  tier: PalaceReportTier,
  year: number,
): string {
  const age = nominalAge(chart.input.year);
  const currentDecadal = chart.decadalTimeline?.length
    ? findDecadalAtAge(chart.decadalTimeline, age)
    : undefined;

  return [
    `請為以下命盤撰寫 ${year} 年流年命書（${tier === "brief" ? "簡批" : "詳批"}）。`,
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

function fallbackAnnualReport(
  chart: ZiWeiChart,
  tier: PalaceReportTier,
  year: number,
): string {
  const age = nominalAge(chart.input.year);
  const decadal = chart.decadalTimeline?.length
    ? findDecadalAtAge(chart.decadalTimeline, age)
    : undefined;

  const header = `【${year} 流年${tier === "brief" ? "簡批" : "詳批"} · 網上小師傅命書】`;
  const intro = decadal
    ? `你而家約 ${age} 虛歲，行【${decadal.palace}】大限（${decadal.ageStart}–${decadal.ageEnd} 虛歲）。${year} 年流年要同呢段大限一齊睇。`
    : `${year} 年流年要配合命宮主星同大限方向一齊睇。`;

  if (tier === "brief") {
    return [
      header,
      "",
      intro,
      "",
      "【流年重點】",
      "• 工作節奏宜穩中求進，唔好一次賭晒所有資源。",
      "• 人際同合作位要講清楚期望，減少誤會。",
      "• 健康作息先係本錢，忙都要留恢復時間。",
      "",
      "【短總結】",
      "今年整體係「調結構、守基本盤」嘅年份；有機會但要揀位出手。",
      "",
      "【宜】",
      "定目標、整理財務、鞏固技能、定期運動、重要決定留多一日諗。",
      "",
      "【忌】",
      "衝動簽約、過度透支、情緒化斷裂關係、熬夜硬撐。",
      "",
      "以上為 AI 參考整理，非師傅親批；想定盤同深入流年可 WhatsApp 預約師傅。",
    ].join("\n");
  }

  const months = [
    "正月", "二月", "三月", "四月", "五月", "六月",
    "七月", "八月", "九月", "十月", "十一月", "十二月",
  ];

  return [
    header,
    "",
    intro,
    "",
    "【流年總述】",
    `${year} 年對你係整理方向同取捨嘅年份：大限主題會透過日常選擇浮現；宜先守再攻。`,
    "",
    "【十二個月流月】",
    ...months.map(
      (m, i) =>
        `${m} — 主題：${i < 4 ? "開局佈局" : i < 8 ? "推進與調整" : "收尾與總結"}；宜：按計劃小步前進、溝通確認；忌：情緒化決策、過度承諾。`,
    ),
    "",
    "【實用化解／加強行動】",
    "1. 每季一次檢視目標，刪減唔再服務你嘅承諾。",
    "2. 重要對話選精神好嘅日子，先寫三點要講嘅重點。",
    "3. 財務大支出留緩衝期，唔好臨急簽約。",
    "4. 固定每周兩次運動或散步，當作「重置鍵」。",
    "",
    "以上為 AI 參考整理，非師傅親批；想定盤同深入流年可 WhatsApp 預約師傅。",
  ].join("\n");
}

function parseAnnualReportJson(
  raw: string,
  tier: PalaceReportTier,
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

function isLengthOk(text: string, tier: PalaceReportTier): boolean {
  const len = text.trim().length;
  if (tier === "brief") return len >= BRIEF_MIN && len <= BRIEF_MAX;
  return len >= DETAILED_MIN && len <= DETAILED_MAX;
}

export async function analyzeAnnualReport(
  chart: ZiWeiChart,
  tier: PalaceReportTier,
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
      tier === "brief" ? 1200 : 4000,
      { temperature: 0.72 },
    );

    const parsed = parseAnnualReportJson(text, tier, year);
    if (parsed && isLengthOk(parsed, tier)) {
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
  tier: PalaceReportTier,
): Promise<{ text: string; provider: "openai" | "azure" | "fallback" }> {
  const year = forecastYear();
  return unstable_cache(
    () => analyzeAnnualReport(chart, tier),
    ["annual-report-v1", chartKey, tier, String(year)],
    { revalidate: 86400 },
  )();
}
