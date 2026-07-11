import type { ChartInsights } from "@/lib/ai/chart-insights";
import type { ZiWeiChart } from "@/lib/ziwei";
import type { ChartPlateType, PalaceName } from "@/lib/ziwei/types";
import type { PalaceAnalysesResponse, PalaceScoresResponse } from "@/lib/ai/types";
import { buildChartHref, getChartLayoutHint, CHART_LAYOUT } from "@/lib/chart-layout";
import { buildChartFortuneSummary } from "@/lib/chart-fortune-summary";
import { chartWhatsAppUrl } from "@/lib/chart-whatsapp";
import { formatClock } from "@/lib/ziwei/true-solar-time";
import MasterReadingCta from "@/components/MasterReadingCta";
import ChartSavedHistory from "./ChartSavedHistory";
import { PalaceScoresLegend } from "./PalaceScoreBadge";
import ChartPalacesGrid from "./layouts/ChartPalacesGrid";
import ChartPalaceAnalysis from "./ChartPalaceAnalysis";
import ChartPersonalInsights from "./ChartPersonalInsights";
import ChartFortuneSummary from "./ChartFortuneSummary";
import ChartPlatePicker from "./ChartPlatePicker";
import ChartPlateCompare from "./ChartPlateCompare";
import ChartDingPanQuiz from "./ChartDingPanQuiz";

interface Props {
  chart: ZiWeiChart;
  threePlates: Record<ChartPlateType, ZiWeiChart>;
  plate: ChartPlateType;
  suggestedPlate: ChartPlateType;
  birthKey: string;
  insights: ChartInsights;
  palaceScores: PalaceScoresResponse;
  palaceAnalyses: PalaceAnalysesResponse;
  focusPalace: PalaceName;
  searchParams: Record<string, string | string[] | undefined>;
  unlockedPalaces: PalaceName[];
  reportTexts: Partial<Record<PalaceName, string>>;
  locale?: "zh" | "en";
}

export default function ChartDisplay({
  chart,
  threePlates,
  plate,
  suggestedPlate,
  birthKey,
  insights,
  palaceScores,
  palaceAnalyses,
  focusPalace,
  searchParams,
  unlockedPalaces,
  reportTexts,
  locale = "zh",
}: Props) {
  const waUrl = chartWhatsAppUrl(chart);
  const scoreByPalace = new Map(palaceScores.scores.map((s) => [s.palace, s]));
  const analysisByPalace = new Map(palaceAnalyses.analyses.map((a) => [a.palace, a]));
  const focusAnalysis = analysisByPalace.get(focusPalace) ?? palaceAnalyses.analyses[0];
  const fortuneSummary = buildChartFortuneSummary(chart, palaceScores.scores);

  const buildFocusHref = (palace: PalaceName) =>
    buildChartHref(searchParams, { focus: palace, plate, hash: "analysis" }, locale);

  const layoutProps = { focusPalace, buildFocusHref };

  return (
    <div className="space-y-8 font-sans">
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

      <div id="chart-summary" className="rounded-xl bg-destiny-purple text-white px-4 py-4 sm:px-6 sm:py-5 space-y-4">
        <ChartPlatePicker
          current={plate}
          suggested={suggestedPlate}
          searchParams={searchParams}
          locale={locale}
          variant="bar"
        />
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-4 gap-y-2.5 text-sm border-t border-white/10 pt-4">
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

      <div className="space-y-3">
        <ChartPlateCompare plates={threePlates} activePlate={plate} locale={locale} />
        <ChartDingPanQuiz
          birthKey={birthKey}
          threePlates={threePlates}
          suggestedPlate={suggestedPlate}
          activePlate={plate}
          searchParams={searchParams}
          locale={locale}
        />
      </div>

      <section id="palaces">
        <div className="mb-4">
          <h2 className="font-display text-lg font-bold text-destiny-purple mb-1">
            {locale === "en" ? "Twelve palaces" : "十二宮位"}
          </h2>
          <p className="text-xs text-destiny-purple/45">{getChartLayoutHint(locale)}</p>
        </div>

        <div className="space-y-6">
          <ChartPalacesGrid chart={chart} scoreByPalace={scoreByPalace} {...layoutProps} />

          <ChartPersonalInsights insights={insights} locale={locale} />

          <ChartFortuneSummary
            data={fortuneSummary}
            focusPalace={focusPalace}
            locale={locale}
          />

          {focusAnalysis && (
            <ChartPalaceAnalysis
              chart={chart}
              focusPalace={focusPalace}
              focusAnalysis={focusAnalysis}
              scoreByPalace={scoreByPalace}
              unlockedPalaces={unlockedPalaces}
              reportTexts={reportTexts}
              layoutId={CHART_LAYOUT}
              locale={locale}
            />
          )}
        </div>

        <div className="mt-4">
          <PalaceScoresLegend locale={locale} />
        </div>
      </section>

      <MasterReadingCta whatsappHref={waUrl} locale={locale} variant="chart" />
    </div>
  );
}
