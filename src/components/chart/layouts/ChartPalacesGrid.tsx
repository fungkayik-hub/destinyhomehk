import type { ZiWeiChart } from "@/lib/ziwei";
import type { PalaceScore } from "@/lib/ai/types";
import { PalaceCard, type PalaceLayoutProps } from "./palace-shared";

interface Props extends PalaceLayoutProps {
  chart: ZiWeiChart;
  scoreByPalace: Map<string, PalaceScore>;
}

export default function ChartPalacesGrid({ chart, scoreByPalace, focusPalace, buildFocusHref }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {chart.palaces.map((palace) => (
        <PalaceCard
          key={palace.name}
          palace={palace}
          rating={scoreByPalace.get(palace.name)}
          href={buildFocusHref(palace.name)}
          selected={palace.name === focusPalace}
        />
      ))}
    </div>
  );
}
