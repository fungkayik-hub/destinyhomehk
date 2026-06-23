import type { ZiWeiChart } from "@/lib/ziwei";
import type { PalaceName } from "@/lib/ziwei/types";
import type { PalaceAnalysesResponse, PalaceScoresResponse } from "@/lib/ai/types";
import { buildChartHref, type ChartLayoutId } from "@/lib/chart-layout";
import { chartWhatsAppUrl } from "@/lib/chart-whatsapp";
import { formatClock } from "@/lib/ziwei/true-solar-time";
import MasterReadingCta from "@/components/MasterReadingCta";
import ChartSavedHistory from "./ChartSavedHistory";
import { PalaceScoresLegend } from "./PalaceScoreBadge";
import ChartPalacesFocus from "./layouts/ChartPalacesFocus";

interface Props {
  chart: ZiWeiChart;
  palaceScores: PalaceScoresResponse;
  palaceAnalyses: PalaceAnalysesResponse;
  focusPalace: PalaceName;
  layout: ChartLayoutId;
  searchParams: Record<string, string | string[] | undefined>;
  locale?: "zh" | "en";
}

export default function ChartDisplay({
  chart,
  palaceScores,
  palaceAnalyses,
  focusPalace,
  layout,
  searchParams,
  locale = "zh",
}: Props) {
  const waUrl = chartWhatsAppUrl(chart);
  const scoreByPalace = new Map(palaceScores.scores.map((s) => [s.palace, s]));
  const analysisByPalace = new Map(palaceAnalyses.analyses.map((a) => [a.palace, a]));
  const focusAnalysis = analysisByPalace.get(focusPalace) ?? palaceAnalyses.analyses[0];

  const buildFocusHref = (palace: PalaceName) =>
    buildChartHref(searchParams, { layout, focus: palace, hash: "analysis" });

  const layoutProps = { focusPalace, buildFocusHref };

  return (
    <div className="space-y-8">
      <ChartSavedHistory current={chart.input} locale={locale} />

      {chart.trueSolarTime?.applied && (
        <p className="text-sm text-destiny-gold bg-destiny-gold/10 border border-destiny-gold/25 rounded-lg px-4 py-3">
          {locale === "en" ? "True solar time: " : "真太陽時："}
          {chart.trueSolarTime.placeName} ·{" "}
          {formatClock(chart.trueSolarTime.civilHour, chart.trueSolarTime.civilMinute)}
          {" → "}
          {formatClock(chart.trueSolarTime.correctedHour, chart.trueSolarTime.correctedMinute)}
          {locale === "en"
            ? ` (${chart.trueSolarTime.offsetMinutes} min)`
            : `（${chart.trueSolarTime.offsetMinutes > 0 ? "+" : ""}${chart.trueSolarTime.offsetMinutes} 分鐘）`}
        </p>
      )}

      <div className="rounded-xl bg-destiny-purple text-white px-4 py-4 sm:px-6 sm:py-5">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-4 gap-y-2.5 text-sm">
          <span>
            <span className="text-white/50">陽曆 </span>
            <strong>{chart.solarDate}</strong>
          </span>
          <span>
            <span className="text-white/50">農曆 </span>
            <strong>{chart.lunarDateText}</strong>
          </span>
          <span>
            <span className="text-white/50">四柱 </span>
            <strong>{chart.chineseDate}</strong>
          </span>
          <span>
            <span className="text-white/50">五行局 </span>
            <strong className="text-destiny-gold">{chart.fiveElement}</strong>
          </span>
          <span>
            <span className="text-white/50">命宮 </span>
            <strong>{chart.mingPalaceBranch}</strong>
          </span>
          <span>
            <span className="text-white/50">身宮 </span>
            <strong>{chart.shenPalaceBranch}</strong>
          </span>
        </div>
      </div>

      <section id="palaces">
        <h2 className="font-display text-lg font-bold text-destiny-purple mb-1">十二宮位</h2>
        <p className="text-xs text-destiny-purple/45 mb-4">
          左右滑動揀宮 · 每宮都有 Sunny 師傅 AI 分析，越睇越清楚
        </p>

        {focusAnalysis && (
          <ChartPalacesFocus
            chart={chart}
            scoreByPalace={scoreByPalace}
            focusAnalysis={focusAnalysis}
            {...layoutProps}
          />
        )}

        <div className="mt-4">
          <PalaceScoresLegend />
        </div>
      </section>

      <MasterReadingCta whatsappHref={waUrl} locale={locale} variant="chart" />
    </div>
  );
}
