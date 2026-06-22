import Link from "next/link";
import type { ZiWeiChart } from "@/lib/ziwei";
import type { PalaceScore } from "@/lib/ai/types";
import { SCORE_LABEL_TEXT } from "@/lib/palace-score-styles";
import { PalaceStars, PalaceTags, type PalaceLayoutProps } from "./palace-shared";

interface Props extends PalaceLayoutProps {
  chart: ZiWeiChart;
  scores: PalaceScore[];
}

export default function ChartPalacesRanked({
  chart,
  scores,
  focusPalace,
  buildFocusHref,
}: Props) {
  const palaceByName = new Map(chart.palaces.map((p) => [p.name, p]));
  const sorted = [...scores].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-2">
      {sorted.map((rating, index) => {
        const palace = palaceByName.get(rating.palace);
        if (!palace) return null;
        const selected = palace.name === focusPalace;

        return (
          <Link
            key={rating.palace}
            href={buildFocusHref(palace.name)}
            className={`block rounded-xl border bg-white px-4 py-3 transition-colors hover:border-destiny-gold ${
              selected
                ? "border-destiny-gold ring-2 ring-destiny-gold/25"
                : palace.isSoulPalace
                  ? "border-destiny-gold/50"
                  : "border-destiny-purple/10"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-sm font-bold text-destiny-muted/60 w-5 shrink-0 pt-0.5">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="font-bold text-destiny-purple">{palace.name}</span>
                    <PalaceTags palace={palace} />
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-2xl font-bold tabular-nums ${SCORE_LABEL_TEXT[rating.label]}`}>
                      {rating.score}
                    </span>
                    <p className="text-[10px] text-destiny-muted">{rating.label}</p>
                  </div>
                </div>
                <PalaceStars palace={palace} />
                <p className="text-xs text-destiny-gold mt-1">
                  {selected ? "↓ 分析在下方" : "點擊睇 AI 分析 →"}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
