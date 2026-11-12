import type { ZiWeiChart } from "@/lib/ziwei";
import type { PalaceScore } from "@/lib/ai/types";
import {
  getBirthYearMutagenTable,
  getBirthYearStem,
  MUTAGEN_BADGE_CLASS,
} from "@/lib/ziwei/mutagen";
import { PalaceCard } from "../layouts/palace-shared";

const POSITIONS: { idx: number; row: number; col: number }[] = [
  { idx: 9, row: 0, col: 0 },
  { idx: 8, row: 0, col: 1 },
  { idx: 7, row: 0, col: 2 },
  { idx: 6, row: 0, col: 3 },
  { idx: 5, row: 1, col: 3 },
  { idx: 4, row: 2, col: 3 },
  { idx: 3, row: 3, col: 3 },
  { idx: 2, row: 3, col: 2 },
  { idx: 1, row: 3, col: 1 },
  { idx: 0, row: 3, col: 0 },
  { idx: 11, row: 2, col: 0 },
  { idx: 10, row: 1, col: 0 },
];

interface Props {
  chart: ZiWeiChart;
  scoreByPalace: Map<string, PalaceScore>;
  compact?: boolean;
}

/** 十二宮傳統命盤（付費命書用；純展示、無宮位連結） */
export default function MingshuPalacePlate({ chart, scoreByPalace, compact }: Props) {
  const yearStem = getBirthYearStem(chart);
  const birthMutagens = getBirthYearMutagenTable(chart);

  return (
    <div className={compact ? "max-w-xl mx-auto" : "max-w-3xl mx-auto"}>
      <div
        className="grid gap-1.5 md:gap-2"
        style={{
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gridTemplateRows: compact
            ? "repeat(4, minmax(56px, auto))"
            : "repeat(4, minmax(72px, auto))",
        }}
      >
        {POSITIONS.map(({ idx, row, col }) => {
          const palace = chart.palaces[idx];
          return (
            <div key={palace.name} style={{ gridColumn: col + 1, gridRow: row + 1 }}>
              <PalaceCard
                palace={palace}
                rating={scoreByPalace.get(palace.name)}
                selected={palace.isSoulPalace}
                className="h-full"
              />
            </div>
          );
        })}

        <div
          className="rounded-2xl bg-gradient-to-br from-destiny-purple to-destiny-purple-light text-white p-3 md:p-4 flex flex-col justify-center shadow-md border border-destiny-gold/30"
          style={{ gridColumn: "2 / span 2", gridRow: "2 / span 2" }}
        >
          <p className="text-destiny-gold text-[10px] font-medium mb-0.5">馮命居 · 中宮</p>
          <p className="font-display text-sm md:text-lg font-bold mb-1">{chart.fiveElement}</p>
          <p className="text-white/80 text-[11px] leading-relaxed">
            命宮 · {chart.mingPalaceBranch}
            <br />
            身宮 · {chart.shenPalaceBranch}
          </p>
          {birthMutagens.length > 0 && (
            <div className="mt-1.5 pt-1.5 border-t border-white/15">
              <p className="text-[9px] text-white/45 mb-1">{yearStem}年生年四化</p>
              <div className="flex flex-wrap gap-1">
                {birthMutagens.map(({ star, label }) => (
                  <span
                    key={`${star}-${label}`}
                    className={`text-[9px] px-1 py-0.5 rounded border font-medium ${MUTAGEN_BADGE_CLASS[label]}`}
                  >
                    {star}化{label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
