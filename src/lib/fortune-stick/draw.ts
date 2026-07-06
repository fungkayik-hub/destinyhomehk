import { createHash, randomUUID } from "crypto";
import { getLotByNumber, lotCount } from "@/lib/fortune-stick/lots";
import {
  detectQuestionTheme,
  gradeSummaryForQuestion,
} from "@/lib/fortune-stick/question-theme";
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

export function buildTeaser(question: string, lot: GuanyinLot): string {
  const theme = detectQuestionTheme(question);
  const lines = lot.poem.split("\n").filter(Boolean);
  const firstLine = lines[0] ?? lot.poem;
  const themeHint = gradeSummaryForQuestion(lot.grade, theme);

  return [
    `你問嘅係「${theme}」。`,
    `第 ${lot.number} 籤 · ${lot.grade}。籤詩首句「${firstLine}」。`,
    themeHint,
    "解鎖完整解讀後，小徒弟會按你條問題同籤文寫詳細分析。",
  ].join("");
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
    teaser: buildTeaser(question, lot),
  };
}
