import lotsData from "@/data/guanyin-lots.json";
import type { GuanyinLot } from "@/lib/fortune-stick/types";

const lots = lotsData as GuanyinLot[];

export function getLotByNumber(number: number): GuanyinLot | undefined {
  return lots.find((l) => l.number === number);
}

export function getAllLots(): GuanyinLot[] {
  return lots;
}

export function lotCount(): number {
  return lots.length;
}
