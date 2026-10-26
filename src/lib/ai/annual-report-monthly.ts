import { PALACE_PROMPT_RULES } from "./palace-prompt-rules";
import { findDecadalAtAge, nominalAge } from "@/lib/ziwei/chart-decadal";
import type { PalaceName, ZiWeiChart } from "@/lib/ziwei/types";

export const MONTHS_ZH = [
  "正月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
] as const;

/** Legacy fallback fingerprint — identical 宜忌 across all months. */
export const GENERIC_MONTHLY_YI = "按計劃小步前進、溝通確認";
export const GENERIC_MONTHLY_JI = "情緒化決策、過度承諾";

const MONTH_LINE_RE =
  /^(正|二|三|四|五|六|七|八|九|十|十一|十二)月\s*—\s*主題：[^；\n]+；宜：([^；\n]+)；忌：([^。\n]+)/;

export interface ParsedMonthlyLine {
  month: string;
  yi: string;
  ji: string;
}

export function parseMonthlyLinesFromReport(text: string): ParsedMonthlyLine[] {
  const out: ParsedMonthlyLine[] = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    const m = trimmed.match(MONTH_LINE_RE);
    if (!m) continue;
    out.push({ month: m[1], yi: m[2].trim(), ji: m[3].trim() });
  }
  return out;
}

export function hasDistinctMonthlyYiJi(
  text: string,
  requiredCount = 12,
): boolean {
  const months = parseMonthlyLinesFromReport(text);
  if (months.length < requiredCount) return false;
  const signatures = new Set(months.map((m) => `${m.yi}|${m.ji}`));
  return signatures.size >= requiredCount;
}

export function isKnownGenericMonthlyTemplate(text: string): boolean {
  const hits = text.match(new RegExp(GENERIC_MONTHLY_YI, "g"));
  return (hits?.length ?? 0) >= 6;
}

export function isAnnualMonthlyContentAcceptable(
  text: string,
  requireTwelveMonths: boolean,
): boolean {
  if (isKnownGenericMonthlyTemplate(text)) return false;
  if (!requireTwelveMonths) return true;
  return hasDistinctMonthlyYiJi(text, 12);
}

function chartSeed(chart: ZiWeiChart): number {
  const soul = chart.palaces.find((p) => p.isSoulPalace);
  const stem = soul?.heavenlyStem ?? "甲";
  const branch = soul?.earthlyBranch ?? "子";
  let h = chart.input.year ^ (chart.input.month << 4) ^ chart.input.day;
  h = (h * 31 + stem.charCodeAt(0) * 17 + branch.charCodeAt(0)) | 0;
  return Math.abs(h);
}

const YI_POOL = [
  "按大限方向定一個小目標、寫低驗收標準",
  "重要約會前先列三點要講嘅重點",
  "財務支出留一成緩衝、大單分兩期決定",
  "固定兩次運動或散步，當作重置狀態",
  "主動約一位可信朋友傾計、唔好自己鑽牛角尖",
  "整理文件同訂閱，刪減唔再服務你嘅承諾",
  "學一樣實用技能，每次只進一小步",
  "睡眠優先，重要決定放精神好嘅日子",
  "合作前先講清楚分工同退出條件",
  "為重要關係留固定相處時間",
  "檢視保險同儲備，唔使一次做晒",
  "試新機會前先做低成本試驗",
  "記低做得好嘅事，建立自信清單",
  "減少無謂比較，專注自己節奏",
];

const JI_POOL = [
  "情緒化回覆訊息、連環追問",
  "一次承諾太多項目、透支體力",
  "賭氣簽約或即時拍板大支出",
  "熬夜硬撐、靠咖啡因撐過重要會議",
  "同家人同事冷戰、唔講清楚期望",
  "跟風投資、冇自己止損位",
  "為面子應酬過密、忽略休息",
  "在疲勞時做人事決定",
  "口快承諾幫人、冇掂自己時間",
  "同舊怨翻舊帳、擴大衝突",
  "忽略身體小警號、唔做檢查",
  "無計劃刷短視頻換取假放鬆",
  "把壓力全部自己扛、唔求助",
  "為一次失敗否定全年方向",
];

function palaceIndex(chart: ZiWeiChart, name: PalaceName): number {
  const i = chart.palaces.findIndex((p) => p.name === name);
  return i >= 0 ? i : 0;
}

function shortPalaceTheme(name: PalaceName): string {
  const rule = PALACE_PROMPT_RULES[name];
  const theme = rule.theme.split("、")[0] ?? rule.theme;
  return theme.length > 12 ? `${theme.slice(0, 12)}…` : theme;
}

function majorsInPalace(chart: ZiWeiChart, name: PalaceName): string {
  const p = chart.palaces.find((x) => x.name === name);
  if (!p) return "借星";
  const majors = p.stars
    .filter((s) => s.type !== "minor")
    .map((s) => s.name)
    .join("、");
  return majors || "借星";
}

function mutagenHint(chart: ZiWeiChart, name: PalaceName): string {
  const p = chart.palaces.find((x) => x.name === name);
  const star = p?.stars.find((s) => s.mutagen);
  if (!star?.mutagen) return "";
  return `（留意${star.name}化${star.mutagen}）`;
}

/** Chart-grounded 流月 — each month distinct even without AI. */
export function buildChartAwareMonthLines(
  chart: ZiWeiChart,
  year: number,
): string[] {
  const seed = chartSeed(chart);
  const soulIdx = palaceIndex(
    chart,
    chart.palaces.find((p) => p.isSoulPalace)?.name ?? "命宮",
  );
  const age = nominalAge(chart.input.year);
  const decadal = chart.decadalTimeline?.length
    ? findDecadalAtAge(chart.decadalTimeline, age)
    : undefined;

  return MONTHS_ZH.map((monthLabel, i) => {
    const palace = chart.palaces[((soulIdx + i) % 12 + 12) % 12];
    const palaceName = palace.name as PalaceName;
    const majors = majorsInPalace(chart, palaceName);
    const themeCore = shortPalaceTheme(palaceName);
    const decadalNote =
      decadal && decadal.palace === palaceName
        ? `呼應${year}流年同你而家【${decadal.palace}】大限`
        : `流月重點在【${palaceName}】`;
    const theme = `${decadalNote} · ${themeCore}（${majors}）${mutagenHint(chart, palaceName)}`;
    const yi = YI_POOL[(seed + i * 3) % YI_POOL.length];
    let ji = JI_POOL[(seed + i * 5 + 7) % JI_POOL.length];
    if (ji === yi) {
      ji = JI_POOL[(seed + i * 5 + 11) % JI_POOL.length];
    }
    return `${monthLabel} — 主題：${theme}；宜：${yi}；忌：${ji}。`;
  });
}
