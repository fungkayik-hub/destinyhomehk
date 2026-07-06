import { createHash, randomUUID } from "crypto";
import { getLotByNumber, lotCount } from "@/lib/fortune-stick/lots";
import type { DrawResult, GuanyinLot } from "@/lib/fortune-stick/types";

function hashSeed(input: string): number {
  const hex = createHash("sha256").update(input).digest("hex");
  return parseInt(hex.slice(0, 8), 16);
}

export function drawLotNumber(question: string, drawId: string): number {
  const normalized = question.trim().replace(/\s+/g, " ");
  const seed = hashSeed(`${drawId}|${normalized}`);
  return (seed % lotCount()) + 1;
}

export function buildTeaser(lot: GuanyinLot): string {
  const lines = lot.poem.split("\n").filter(Boolean);
  const firstLine = lines[0] ?? lot.poem;
  const gradeHint =
    lot.grade.includes("凶") || lot.grade.includes("末")
      ? "此籤帶有提醒之意，細節要睇完整解讀。"
      : lot.grade.includes("吉")
        ? "此籤帶有順遂之意，但要結合你嘅問題先至準。"
        : "籤意要配合你嘅具體問題先至有用。";

  return `第 ${lot.number} 籤 · ${lot.grade}。籤詩首句「${firstLine}」— ${gradeHint}`;
}

export function createDrawResult(question: string, drawId?: string): DrawResult {
  const id = drawId?.trim() || randomUUID();
  const lotNumber = drawLotNumber(question, id);
  const lot = getLotByNumber(lotNumber);
  if (!lot) {
    throw new Error(`Invalid lot number: ${lotNumber}`);
  }
  return {
    drawId: id,
    lot,
    teaser: buildTeaser(lot),
  };
}
