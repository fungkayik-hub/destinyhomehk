import type { PalaceScore } from "@/lib/ai/types";
import type { DecadalPeriod, PalaceName, ZiWeiChart } from "@/lib/ziwei/types";
import { findDecadalAtAge, nominalAge } from "@/lib/ziwei/chart-decadal";

export type FortuneDimensionKey =
  | "career"
  | "wealth"
  | "love"
  | "social"
  | "wellness";

export interface FortuneDimension {
  key: FortuneDimensionKey;
  label: string;
  labelEn: string;
  score: number;
  grade: string;
  palace: PalaceName;
}

export interface DecadalTrendPoint {
  ageStart: number;
  ageEnd: number;
  ageMid: number;
  label: string;
  palace: PalaceName;
  score: number;
  isCurrent: boolean;
  heavenlyStem: string;
  earthlyBranch: string;
}

export interface ChartFortuneSummaryData {
  nominalAge: number;
  currentDecadal: DecadalPeriod | null;
  currentDecadalPalaceScore: number | null;
  dimensions: FortuneDimension[];
  decadalTrend: DecadalTrendPoint[];
  radarData: { subject: string; score: number; fullMark: number }[];
}

const DIMENSION_PALACES: Record<
  FortuneDimensionKey,
  { label: string; labelEn: string; palaces: { name: PalaceName; weight: number }[] }
> = {
  career: {
    label: "事業運",
    labelEn: "Career",
    palaces: [
      { name: "官祿宮", weight: 0.75 },
      { name: "命宮", weight: 0.25 },
    ],
  },
  wealth: {
    label: "財運",
    labelEn: "Wealth",
    palaces: [{ name: "財帛宮", weight: 1 }],
  },
  love: {
    label: "姻緣運",
    labelEn: "Love",
    palaces: [
      { name: "夫妻宮", weight: 0.8 },
      { name: "福德宮", weight: 0.2 },
    ],
  },
  social: {
    label: "人緣運",
    labelEn: "Social",
    palaces: [
      { name: "奴僕宮", weight: 0.6 },
      { name: "兄弟宮", weight: 0.4 },
    ],
  },
  wellness: {
    label: "身心運",
    labelEn: "Wellness",
    palaces: [
      { name: "疾厄宮", weight: 0.55 },
      { name: "福德宮", weight: 0.45 },
    ],
  },
};

/** 數值 → 明明式字母評級 */
export function scoreToLetterGrade(score: number): string {
  if (score >= 88) return "A";
  if (score >= 80) return "A-";
  if (score >= 74) return "B+";
  if (score >= 68) return "B";
  if (score >= 62) return "B-";
  if (score >= 56) return "C+";
  if (score >= 50) return "C";
  if (score >= 44) return "C-";
  if (score >= 38) return "D+";
  return "D";
}

const GRADE_COLORS: Record<string, string> = {
  A: "bg-destiny-gold/25 text-destiny-gold border-destiny-gold/40",
  "A-": "bg-destiny-gold/20 text-destiny-gold border-destiny-gold/35",
  "B+": "bg-destiny-purple/10 text-destiny-purple border-destiny-purple/20",
  B: "bg-destiny-purple/10 text-destiny-purple border-destiny-purple/15",
  "B-": "bg-destiny-blue/10 text-destiny-blue border-destiny-blue/20",
  "C+": "bg-destiny-muted/15 text-destiny-muted border-destiny-muted/25",
  C: "bg-destiny-amber/12 text-destiny-amber border-destiny-amber/25",
  "C-": "bg-destiny-amber/15 text-destiny-amber border-destiny-amber/30",
  "D+": "bg-destiny-red/8 text-destiny-red border-destiny-red/20",
  D: "bg-destiny-red/10 text-destiny-red border-destiny-red/25",
};

export function letterGradeStyle(grade: string): string {
  return GRADE_COLORS[grade] ?? GRADE_COLORS.C;
}

function scoreForPalace(
  scores: Map<PalaceName, PalaceScore>,
  palace: PalaceName,
): number {
  return scores.get(palace)?.score ?? 52;
}

function weightedScore(
  scores: Map<PalaceName, PalaceScore>,
  entries: { name: PalaceName; weight: number }[],
): number {
  let total = 0;
  let weightSum = 0;
  for (const { name, weight } of entries) {
    total += scoreForPalace(scores, name) * weight;
    weightSum += weight;
  }
  return Math.round(total / weightSum);
}

export function buildChartFortuneSummary(
  chart: ZiWeiChart,
  scores: PalaceScore[],
  asOfYear?: number,
): ChartFortuneSummaryData {
  const scoreMap = new Map(scores.map((s) => [s.palace, s]));
  const age = nominalAge(chart.input.year, asOfYear);
  const timeline = chart.decadalTimeline ?? [];
  const current = timeline.length ? findDecadalAtAge(timeline, age) : null;

  const dimensions: FortuneDimension[] = (
    Object.keys(DIMENSION_PALACES) as FortuneDimensionKey[]
  ).map((key) => {
    const def = DIMENSION_PALACES[key];
    const score = weightedScore(scoreMap, def.palaces);
    return {
      key,
      label: def.label,
      labelEn: def.labelEn,
      score,
      grade: scoreToLetterGrade(score),
      palace: def.palaces[0].name,
    };
  });

  const decadalTrend: DecadalTrendPoint[] = timeline.map((d) => ({
    ageStart: d.ageStart,
    ageEnd: d.ageEnd,
    ageMid: Math.round((d.ageStart + d.ageEnd) / 2),
    label: `${d.ageStart}–${d.ageEnd}`,
    palace: d.palace,
    score: scoreForPalace(scoreMap, d.palace),
    isCurrent: current?.palace === d.palace,
    heavenlyStem: d.heavenlyStem,
    earthlyBranch: d.earthlyBranch,
  }));

  const radarData = dimensions.map((d) => ({
    subject: d.label,
    score: d.score,
    fullMark: 100,
  }));

  return {
    nominalAge: age,
    currentDecadal: current ?? null,
    currentDecadalPalaceScore: current
      ? scoreForPalace(scoreMap, current.palace)
      : null,
    dimensions,
    decadalTrend,
    radarData,
  };
}

/** 折線圖：以而家為中心，顯示前後各 5 段大限（最多 10 點） */
export function sliceDecadalTrendForChart(
  trend: DecadalTrendPoint[],
  current: DecadalPeriod | null,
): DecadalTrendPoint[] {
  if (!trend.length) return [];
  if (!current) return trend.slice(0, 10);

  const idx = trend.findIndex((t) => t.palace === current.palace);
  if (idx < 0) return trend.slice(0, 10);

  const start = Math.max(0, idx - 2);
  const end = Math.min(trend.length, start + 6);
  return trend.slice(start, end);
}
