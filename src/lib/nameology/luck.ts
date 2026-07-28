import luckTable from "@/data/wuge-luck.json";
import type { FiveElement, WugeLuckLabel } from "./types";

interface LuckRow {
  n: number;
  element: FiveElement;
  luck: WugeLuckLabel;
  desc: string;
}

const BY_NUMBER = new Map<number, LuckRow>(
  (luckTable as LuckRow[]).map((row) => [row.n, row]),
);

/** 五格數理：超過 81 取餘，餘 0 視為 81。 */
export function reduceTo81(strokes: number): number {
  if (strokes <= 0) return 1;
  const r = strokes % 81;
  return r === 0 ? 81 : r;
}

export function lookupLuck(strokes: number): LuckRow {
  const n = reduceTo81(strokes);
  const row = BY_NUMBER.get(n);
  if (!row) {
    return { n, element: "木", luck: "吉多於凶", desc: "數理待查" };
  }
  return row;
}
