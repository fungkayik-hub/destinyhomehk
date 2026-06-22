import type { PalaceScore } from "@/lib/ai/types";
import { SCORE_LABEL_TEXT } from "@/lib/palace-score-styles";

interface Props {
  score: PalaceScore;
  variant?: "inline" | "full";
}

export default function PalaceScoreBadge({ score, variant = "inline" }: Props) {
  if (variant === "inline") {
    return (
      <div className="flex items-center gap-1.5 shrink-0" title={score.brief}>
        <span className={`text-lg font-bold tabular-nums leading-none ${SCORE_LABEL_TEXT[score.label]}`}>
          {score.score}
        </span>
        <span className="text-[10px] text-destiny-muted leading-tight">{score.label}</span>
      </div>
    );
  }

  return (
    <div className="mt-2 pt-2 border-t border-destiny-purple/8">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className={`text-xs font-medium ${SCORE_LABEL_TEXT[score.label]}`}>{score.label}</span>
        <span className="text-sm font-bold text-destiny-purple tabular-nums">{score.score}</span>
      </div>
      <p className="text-xs text-destiny-muted leading-snug">{score.brief}</p>
    </div>
  );
}

export function PalaceScoresLegend() {
  return (
    <p className="text-xs text-destiny-muted text-center">
      評分僅供參考（AI 估算），非師傅親批。
    </p>
  );
}
