import Link from "next/link";
import type { ChartInsights } from "@/lib/ai/chart-insights";
import type { ZiWeiChart } from "@/lib/ziwei";
import type { PalaceName } from "@/lib/ziwei/types";
import type { PalaceAnalysis, PalaceScore } from "@/lib/ai/types";
import { buildChartFortuneSummary } from "@/lib/chart-fortune-summary";
import type { PalaceLayoutProps } from "./palace-shared";
import ChartFortuneSummary from "../ChartFortuneSummary";
import ChartPersonalInsights from "../ChartPersonalInsights";
import ChartPalaceAnalysis from "../ChartPalaceAnalysis";

interface Props extends PalaceLayoutProps {
  chart: ZiWeiChart;
  insights: ChartInsights;
  scoreByPalace: Map<string, PalaceScore>;
  focusAnalysis: PalaceAnalysis;
  unlockedPalaces: PalaceName[];
  reportTexts: Partial<Record<PalaceName, string>>;
  layoutId: string;
  locale?: "zh" | "en";
}

/** 版本 5：橫向揀宮 + 下方整合星曜與小徒弟贈言 */
export default function ChartPalacesFocus({
  chart,
  insights,
  scoreByPalace,
  focusPalace,
  focusAnalysis,
  buildFocusHref,
  unlockedPalaces,
  reportTexts,
  layoutId,
  locale = "zh",
}: Props) {
  const fortuneSummary = buildChartFortuneSummary(
    chart,
    Array.from(scoreByPalace.values()),
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide">
        {chart.palaces.map((p) => {
          const score = scoreByPalace.get(p.name);
          const active = p.name === focusPalace;
          return (
            <Link
              key={p.name}
              href={buildFocusHref(p.name)}
              className={`snap-start shrink-0 flex flex-col items-center min-w-[5rem] px-3 py-3 rounded-xl border text-center transition-all ${
                active
                  ? "bg-destiny-purple text-white border-destiny-purple shadow-md scale-[1.02]"
                  : "bg-white text-destiny-purple border-destiny-purple/12 hover:border-destiny-gold"
              }`}
            >
              <span className="text-xs font-bold leading-tight">{p.name.replace("宮", "")}</span>
              {score && (
                <span
                  className={`text-sm font-bold tabular-nums mt-0.5 ${active ? "text-destiny-gold" : ""}`}
                >
                  {score.score}
                </span>
              )}
              {p.isSoulPalace && (
                <span className={`text-[9px] mt-0.5 ${active ? "text-white/70" : "text-destiny-gold"}`}>
                  命
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <ChartPalaceAnalysis
        chart={chart}
        focusPalace={focusPalace}
        focusAnalysis={focusAnalysis}
        scoreByPalace={scoreByPalace}
        unlockedPalaces={unlockedPalaces}
        reportTexts={reportTexts}
        layoutId={layoutId}
        locale={locale}
      />

      <ChartPersonalInsights insights={insights} locale={locale} />

      <ChartFortuneSummary
        data={fortuneSummary}
        focusPalace={focusPalace}
        locale={locale}
      />
    </div>
  );
}
