import Link from "next/link";
import type { ZiWeiChart } from "@/lib/ziwei";
import type { PalaceScore } from "@/lib/ai/types";
import { SCORE_LABEL_TEXT } from "@/lib/palace-score-styles";
import { PalaceStars, PalaceTags, type PalaceLayoutProps } from "./palace-shared";

interface Props extends PalaceLayoutProps {
  chart: ZiWeiChart;
  scoreByPalace: Map<string, PalaceScore>;
}

export default function ChartPalacesList({
  chart,
  scoreByPalace,
  focusPalace,
  buildFocusHref,
}: Props) {
  return (
    <div className="rounded-xl border border-destiny-purple/10 overflow-hidden divide-y divide-destiny-purple/8 bg-white">
      {chart.palaces.map((palace) => {
        const rating = scoreByPalace.get(palace.name);
        const selected = palace.name === focusPalace;
        return (
          <Link
            key={palace.name}
            href={buildFocusHref(palace.name)}
            className={`block px-4 py-3 flex items-center gap-4 transition-colors hover:bg-destiny-gold/8 ${
              selected ? "bg-destiny-purple/5 border-l-4 border-l-destiny-gold" : ""
            } ${palace.isSoulPalace && !selected ? "bg-destiny-gold/5" : ""}`}
          >
            {rating && (
              <div className="w-10 text-center shrink-0">
                <div className={`text-xl font-bold tabular-nums ${SCORE_LABEL_TEXT[rating.label]}`}>
                  {rating.score}
                </div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-destiny-purple">{palace.name}</span>
                <span className="text-xs text-destiny-muted">
                  {palace.heavenlyStem}
                  {palace.earthlyBranch}
                </span>
                <PalaceTags palace={palace} />
              </div>
              <PalaceStars palace={palace} />
            </div>
            <span className="text-xs text-destiny-gold shrink-0 hidden sm:inline">
              {selected ? "↓ 分析" : "睇分析 →"}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
