import type { PalaceScore } from "@/lib/ai/types";
import type { DecadalPeriod, PalaceName, ZiWeiChart } from "@/lib/ziwei/types";
import { findDecadalAtAge, nominalAge, decadalDisplayOffset } from "@/lib/ziwei/chart-decadal";

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
  gradeLevel: number;
  isCurrent: boolean;
  heavenlyStem: string;
  earthlyBranch: string;
}

export interface ChartFortuneSummaryData {
  nominalAge: number;
  decadalDisplayOffset: number;
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

/** 數值 → 八級（8級最好，1級最弱） */
export function scoreToEightGradeLevel(score: number): number {
  if (score >= 90) return 8;
  if (score >= 84) return 7;
  if (score >= 78) return 6;
  if (score >= 72) return 5;
  if (score >= 66) return 4;
  if (score >= 60) return 3;
  if (score >= 52) return 2;
  return 1;
}

export function scoreToEightGrade(score: number): string {
  return `${scoreToEightGradeLevel(score)}級`;
}

/** @deprecated 用 scoreToEightGrade */
export function scoreToLetterGrade(score: number): string {
  return scoreToEightGrade(score);
}

const GRADE_COLORS: Record<string, string> = {
  "8級": "bg-destiny-gold/25 text-destiny-gold border-destiny-gold/40",
  "7級": "bg-destiny-gold/20 text-destiny-gold border-destiny-gold/35",
  "6級": "bg-destiny-purple/10 text-destiny-purple border-destiny-purple/20",
  "5級": "bg-destiny-purple/10 text-destiny-purple border-destiny-purple/15",
  "4級": "bg-destiny-blue/10 text-destiny-blue border-destiny-blue/20",
  "3級": "bg-destiny-muted/15 text-destiny-muted border-destiny-muted/25",
  "2級": "bg-destiny-amber/12 text-destiny-amber border-destiny-amber/25",
  "1級": "bg-destiny-red/10 text-destiny-red border-destiny-red/25",
};

export function letterGradeStyle(grade: string): string {
  return GRADE_COLORS[grade] ?? GRADE_COLORS["5級"];
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
  const offset = decadalDisplayOffset(timeline);
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
      grade: scoreToEightGrade(score),
      palace: def.palaces[0].name,
    };
  });

  const decadalTrend: DecadalTrendPoint[] = timeline.map((d) => {
    const displayStart = d.ageStart - offset;
    const displayEnd = d.ageEnd - offset;
    const palaceScore = scoreForPalace(scoreMap, d.palace);
    return {
      ageStart: displayStart,
      ageEnd: displayEnd,
      ageMid: Math.round((displayStart + displayEnd) / 2),
      label: `${displayStart}〜${displayEnd}`,
      palace: d.palace,
      score: palaceScore,
      gradeLevel: scoreToEightGradeLevel(palaceScore),
      isCurrent: current?.palace === d.palace,
      heavenlyStem: d.heavenlyStem,
      earthlyBranch: d.earthlyBranch,
    };
  });

  const radarData = dimensions.map((d) => ({
    subject: d.label,
    score: scoreToEightGradeLevel(d.score) * 12.5,
    fullMark: 100,
    grade: d.grade,
  }));

  return {
    nominalAge: age,
    decadalDisplayOffset: offset,
    currentDecadal: current ?? null,
    currentDecadalPalaceScore: current
      ? scoreForPalace(scoreMap, current.palace)
      : null,
    dimensions,
    decadalTrend,
    radarData,
  };
}

/** 折線圖：以而家為中心，顯示前後共 8 段大限 */
export function sliceDecadalTrendForChart(
  trend: DecadalTrendPoint[],
  current: DecadalPeriod | null,
): DecadalTrendPoint[] {
  if (!trend.length) return [];
  if (!current) return trend.slice(0, 8);

  const idx = trend.findIndex((t) => t.isCurrent);
  if (idx < 0) return trend.slice(0, 8);

  const start = Math.max(0, idx - 3);
  const end = Math.min(trend.length, start + 8);
  return trend.slice(start, end);
}
