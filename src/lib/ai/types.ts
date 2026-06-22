import type { PalaceName } from "@/lib/ziwei/types";

export type PalaceScoreLabel = "極佳" | "佳" | "平" | "待加強" | "需注意";

export interface PalaceScore {
  palace: PalaceName;
  score: number;
  label: PalaceScoreLabel;
  brief: string;
}

export interface PalaceScoresResponse {
  scores: PalaceScore[];
  provider: "openai" | "azure" | "fallback";
}

export interface PalaceAnalysis {
  palace: PalaceName;
  text: string;
}

export interface PalaceAnalysesResponse {
  analyses: PalaceAnalysis[];
  provider: "openai" | "azure" | "fallback";
}
