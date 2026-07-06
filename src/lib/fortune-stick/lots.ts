import lotsData from "@/data/guanyin-lots.json";
import type { GuanyinLot } from "@/lib/fortune-stick/types";

const lots = lotsData as GuanyinLot[];

export const LOT_GRADE_ORDER = [
  "大吉",
  "吉",
  "小吉",
  "半吉",
  "末小吉",
  "末吉",
  "凶",
] as const;

function buildGradeStats(): { grade: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const lot of lots) {
    counts.set(lot.grade, (counts.get(lot.grade) ?? 0) + 1);
  }
  return LOT_GRADE_ORDER.filter((g) => counts.has(g)).map((grade) => ({
    grade,
    count: counts.get(grade) ?? 0,
  }));
}

/** 觀音靈籤吉凶等級分佈 */
export const LOT_GRADE_STATS = buildGradeStats();

export function getLotByNumber(number: number): GuanyinLot | undefined {
  return lots.find((l) => l.number === number);
}

export function getAllLots(): GuanyinLot[] {
  return lots;
}

export function lotCount(): number {
  return lots.length;
}
