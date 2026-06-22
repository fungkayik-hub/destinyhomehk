import type { PalaceScoreLabel } from "@/lib/ai/types";

/** 方案 A「星盤夜色」— 評分文字色 */
export const SCORE_LABEL_TEXT: Record<PalaceScoreLabel, string> = {
  極佳: "text-destiny-gold",
  佳: "text-destiny-gold-light",
  平: "text-destiny-muted",
  待加強: "text-destiny-amber",
  需注意: "text-destiny-red",
};

/** 評分標籤背景（焦點詳解等） */
export const SCORE_LABEL_BG: Record<PalaceScoreLabel, string> = {
  極佳: "bg-destiny-gold/25 text-destiny-gold",
  佳: "bg-destiny-gold/15 text-destiny-purple",
  平: "bg-destiny-muted/15 text-destiny-muted",
  待加強: "bg-destiny-amber/15 text-destiny-amber",
  需注意: "bg-destiny-red/10 text-destiny-red",
};
