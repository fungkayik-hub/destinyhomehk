import type { ZiWeiChart } from "@/lib/ziwei";
import type { PalaceScore } from "@/lib/ai/types";
import { PalaceCard, type PalaceLayoutProps } from "./palace-shared";

interface Props extends PalaceLayoutProps {
  chart: ZiWeiChart;
  scoreByPalace: Map<string, PalaceScore>;
}

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

export default function ChartPalacesClassic({
  chart,
  scoreByPalace,
  focusPalace,
  buildFocusHref,
}: Props) {
  return (
    <div className="max-w-3xl mx-auto">
      <div
        className="grid gap-1.5 md:gap-2"
        style={{
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gridTemplateRows: "repeat(4, minmax(72px, auto))",
        }}
      >
        {POSITIONS.map(({ idx, row, col }) => {
          const palace = chart.palaces[idx];
          return (
            <div key={palace.name} style={{ gridColumn: col + 1, gridRow: row + 1 }}>
              <PalaceCard
                palace={palace}
                rating={scoreByPalace.get(palace.name)}
                href={buildFocusHref(palace.name)}
                selected={palace.name === focusPalace}
                className="h-full"
              />
            </div>
          );
        })}

        <div
          className="rounded-2xl bg-gradient-to-br from-destiny-purple to-destiny-purple-light text-white p-3 md:p-5 flex flex-col justify-center shadow-lg border border-destiny-gold/30"
          style={{ gridColumn: "2 / span 2", gridRow: "2 / span 2" }}
        >
          <p className="text-destiny-gold text-xs font-medium mb-1">中宮</p>
          <p className="font-display text-base md:text-xl font-bold mb-1">{chart.fiveElement}</p>
          <p className="text-white/80 text-xs leading-relaxed">
            命宮 · {chart.mingPalaceBranch}
            <br />
            身宮 · {chart.shenPalaceBranch}
          </p>
          <p className="text-white/55 text-xs mt-2">點擊外圍宮位睇 AI 分析</p>
        </div>
      </div>
    </div>
  );
}
