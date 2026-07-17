import { unstable_cache } from "next/cache";
import { chartToContext } from "./chart-context";
import {
  computeChartInsights,
  formatInsightsBlock,
  sanfangSizheng,
  type ChartInsights,
} from "./chart-insights";
import {
  PALACE_REPORT_EXAMPLE,
  PALACE_REPORT_VOICE_GUIDE,
} from "./palace-report-voice";
import { chatComplete, hasAiConfigured } from "./ai-provider";
import { STAR_TRAIT_HINTS, ZHONGZHOU_PATTERNS_HINT } from "./sunny-voice";
import { PALACE_PROMPT_RULES } from "./palace-prompt-rules";
import { meaningsForPalaceMajors } from "./star-palace-meanings";
import {
  formatDecadalBlock,
  formatPalaceDecadalFocus,
  findDecadalAtAge,
  nominalAge,
} from "@/lib/ziwei/chart-decadal";
import type { PalaceInfo, PalaceName, ZiWeiChart } from "@/lib/ziwei/types";

const REPORT_MIN_CHARS = 700;
const REPORT_MAX_CHARS = 1800;


const REPORT_SYSTEM = `${PALACE_REPORT_VOICE_GUIDE}

${STAR_TRAIT_HINTS}

${ZHONGZHOU_PATTERNS_HINT}

【任務 — 網上小師傅命書（付費詳批）】
- 只寫指定單一宮位，**800–1200 字**
- 必須引用「排盤摘要」「此宮三方四正」「十年大限」
- 主星解讀必須跟「此宮主星×宮位含義」，唔好套命宮性格去呢宮
- 十年大限要用虛歲段（如 23–32 虛歲），唔好估公曆年
- 只輸出 JSON 物件，不要 markdown：{"palace":"夫妻宮","text":"..."}

【示例（唔好照抄 — 結構同深度參考）】
${PALACE_REPORT_EXAMPLE}`;

export function isReportTooThin(text: string): boolean {
  const len = text.trim().length;
  return len < REPORT_MIN_CHARS || len > REPORT_MAX_CHARS;
}

function formatPalaceStars(p: PalaceInfo): string {
  const majors =
    p.stars
      .filter((s) => s.type !== "minor")
      .map((s) => {
        const parts = [s.name];
        if (s.brightness) parts.push(s.brightness);
        if (s.mutagen) parts.push(s.mutagen);
        return parts.length > 1 ? `${parts[0]}(${parts.slice(1).join("·")})` : s.name;
      })
      .join("、") || "空宮";
  const minors = p.stars
    .filter((s) => s.type === "minor")
    .map((s) => s.name)
    .join("、");
  const tags = [p.isSoulPalace ? "命" : "", p.isBodyPalace ? "身" : ""]
    .filter(Boolean)
    .join("/");
  return `${p.name}[${p.earthlyBranch}]${tags ? `(${tags})` : ""}：${majors}${minors ? `；輔 ${minors}` : ""}`;
}

function buildPalaceSanfangBlock(chart: ZiWeiChart, palace: PalaceName): string {
  const region = sanfangSizheng(chart.palaces, palace);
  const mutagens = region.flatMap((p) =>
    p.stars
      .filter((s) => s.mutagen)
      .map((s) => `${s.name}${s.mutagen}在${p.name}`),
  );
  const lines = [
    `════ 【${palace}】三方四正（必須分析）════`,
    ...region.map(formatPalaceStars),
  ];
  if (mutagens.length > 0) {
    lines.push(`四化：${mutagens.join("、")}`);
  }
  return lines.join("\n");
}

function buildPalaceReportPrompt(
  chart: ZiWeiChart,
  palace: PalaceName,
  insights: ChartInsights,
): string {
  const palaceInfo = chart.palaces.find((p) => p.name === palace);
  const theme = PALACE_PROMPT_RULES[palace].theme;
  const starMeanings = palaceInfo ? meaningsForPalaceMajors(palaceInfo) : [];

  return [
    `請為以下命盤撰寫【${palace}】網上小師傅命書。`,
    `此宮主題：${theme}`,
    `字數：800–1200 字。必須引用排盤摘要、此宮三方四正、十年大限虛歲段，唔好寫到其他宮。`,
    starMeanings.length > 0
      ? `【此宮主星×宮位含義 — 必須跟】\n${starMeanings.map((l) => `• ${l}`).join("\n")}`
      : "",
    palace === "官祿宮"
      ? "官祿宮必須包含 1–2 個具體事業方向 + 實操建議。"
      : "",
    palace === "夫妻宮"
      ? "夫妻宮必須包含相處模式 + 適合另一半 2–3 個特質。"
      : "",
    palace === "遷移宮"
      ? "遷移宮：只有天機入陷先寫一生漂泊／雀鳥／迷路；其他主星唔好套用。"
      : "",
    palace === "疾厄宮"
      ? "疾厄宮只講作息體質傾向，禁止病名同恐嚇。"
      : "",
    "",
    buildPalaceSanfangBlock(chart, palace),
    "",
    formatPalaceDecadalFocus(chart, palace),
    "",
    formatDecadalBlock(chart),
    "",
    formatInsightsBlock(insights),
    "",
    "完整命盤：",
    chartToContext(chart, insights),
    "",
    palaceInfo ? `【此宮主星速覽】${formatPalaceStars(palaceInfo)}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function fallbackPalaceReport(chart: ZiWeiChart, palace: PalaceName): string {
  const insights = computeChartInsights(chart);
  const palaceInfo = chart.palaces.find((p) => p.name === palace);
  const theme = PALACE_PROMPT_RULES[palace].theme;
  const region = sanfangSizheng(chart.palaces, palace);
  const stars = formatPalaceStars(palaceInfo ?? region[0]);
  const sanfangLines = region.slice(1).map((p) => `${p.name}：${formatPalaceStars(p).split("：")[1] ?? "—"}`);

  const patternNote =
    insights.patterns.length > 0
      ? `命盤格局參考：${insights.patterns
          .slice(0, 2)
          .map((p) => p.slug)
          .join("、")}。`
      : "主星亮度同三方四正已經話到你好大一部分潛力。";

  const bodyNote = insights.bodyVsSoul ? `\n\n【身命】${insights.bodyVsSoul}` : "";
  const decadal = chart.decadalTimeline?.find((d) => d.palace === palace);
  const age = nominalAge(chart.input.year);
  const current = chart.decadalTimeline?.length
    ? findDecadalAtAge(chart.decadalTimeline, age)
    : undefined;
  const decadalNote = decadal
    ? `\n\n【十年大限】${decadal.ageStart}–${decadal.ageEnd} 虛歲大限走【${palace}】${decadal.heavenlyStem}${decadal.earthlyBranch}。${
        current?.palace === palace
          ? `你而家約 ${age} 虛歲，正行緊呢段大限。`
          : age < decadal.ageStart
            ? `呢段大限喺前方。`
            : age > decadal.ageEnd
              ? `呢段大限已過去，可對照當年經歷。`
              : ""
      }`
    : "";

  return [
    `【${palace}網上小師傅命書】`,
    "",
    `網上小師傅先幫你整理${palace} — 此宮管${theme}。${stars}。${patternNote}${bodyNote}${decadalNote}`,
    "",
    "【三方四正】",
    ...sanfangLines.map((l) => `- ${l}`),
    "對宮同三合會影響此宮嘅表現方式；空宮就要多睇借星同會照。",
    "",
    "【生活方向】",
    palace === "官祿宮"
      ? "事業上宜揀能發揮主星特質、又有自主空間嘅路；具體轉工、創業或進修窗口要配合大限。"
      : palace === "夫妻宮"
        ? "感情上宜揀情緒成熟、肯溝通、價值觀一致嘅伴侶；相處節奏要定期傾清楚期望。"
        : `日常生活裡，${theme}往往同你命宮性格互相呼應 — 留意自己喺呢方面嘅習慣同強項。`,
    "",
    "【十年大限】",
    decadal
      ? `${decadal.ageStart}–${decadal.ageEnd} 虛歲行【${palace}】大限時，此宮主題會特別突出；配合本命主星同三方四正一齊睇。`
      : `邊段大限${palace}較活躍，要配合全盤大限表。`,
    current ? `目前約 ${age} 虛歲，行【${current.palace}】大限（${current.ageStart}–${current.ageEnd} 虛歲）。` : "",
    "",
    "【建議】",
    "按中洲派排盤，此宮方向已經有跡可尋；想定盤、拆大限流年，建議預約師傅 60–90 分鐘全批，逐項講足你關心嘅問題。",
  ].join("\n");
}

export function parsePalaceReportJson(
  raw: string,
  expectedPalace: PalaceName,
): string | null {
  const trimmed = raw.trim();
  const jsonText = trimmed.startsWith("{")
    ? trimmed
    : trimmed.match(/\{[\s\S]*\}/)?.[0]?.trim() ?? null;

  if (!jsonText) return null;

  try {
    const obj = JSON.parse(jsonText) as { palace?: string; text?: string };
    if (obj.palace !== expectedPalace || typeof obj.text !== "string") return null;
    return obj.text.trim();
  } catch {
    return null;
  }
}

export async function analyzePalaceReport(
  chart: ZiWeiChart,
  palace: PalaceName,
): Promise<{ text: string; provider: "openai" | "azure" | "fallback" }> {
  const fallback = fallbackPalaceReport(chart, palace);

  if (!hasAiConfigured()) {
    return { text: fallback, provider: "fallback" };
  }

  const insights = computeChartInsights(chart);
  const userPrompt = buildPalaceReportPrompt(chart, palace, insights);

  try {
    const { text, provider } = await chatComplete(
      [
        { role: "system", content: REPORT_SYSTEM },
        { role: "user", content: userPrompt },
      ],
      2500,
      { temperature: 0.75 },
    );

    const parsed = parsePalaceReportJson(text, palace);
    if (parsed && !isReportTooThin(parsed)) {
      return { text: parsed, provider };
    }
    return { text: fallback, provider: "fallback" };
  } catch {
    return { text: fallback, provider: "fallback" };
  }
}

/** 同一 chartKey + 宮位只 call 一次 AI（同 chart-analysis-cache 模式） */
export async function getCachedPalaceReport(
  chartKey: string,
  chart: ZiWeiChart,
  palace: PalaceName,
): Promise<{ text: string; provider: "openai" | "azure" | "fallback" }> {
  return unstable_cache(
    () => analyzePalaceReport(chart, palace),
    ["palace-report-v2", chartKey, palace],
    { revalidate: 86400 },
  )();
}
