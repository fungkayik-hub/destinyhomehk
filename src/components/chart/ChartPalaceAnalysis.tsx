import { Suspense } from "react";
import type { ZiWeiChart } from "@/lib/ziwei";
import type { PalaceName } from "@/lib/ziwei/types";
import type { PalaceAnalysis, PalaceScore } from "@/lib/ai/types";
import { getApprenticeCopy } from "@/lib/apprentice-copy";
import { SCORE_LABEL_BG } from "@/lib/palace-score-styles";
import { PalaceStars, PalaceTags } from "./layouts/palace-shared";
import PalaceReportSection from "./PalaceReportSection";

interface Props {
  chart: ZiWeiChart;
  focusPalace: PalaceName;
  focusAnalysis: PalaceAnalysis;
  scoreByPalace: Map<string, PalaceScore>;
  unlockedPalaces: PalaceName[];
  reportTexts: Partial<Record<PalaceName, string>>;
  layoutId: string;
  locale?: "zh" | "en";
}

export default function ChartPalaceAnalysis({
  chart,
  focusPalace,
  focusAnalysis,
  scoreByPalace,
  unlockedPalaces,
  reportTexts,
  layoutId,
  locale = "zh",
}: Props) {
  const copy = getApprenticeCopy(locale);
  const palace = chart.palaces.find((p) => p.name === focusPalace);
  const rating = scoreByPalace.get(focusPalace);
  const stars =
    palace?.stars
      .filter((s) => s.type !== "minor")
      .map((s) => s.name)
      .join("、") || (locale === "en" ? "Empty" : "空宮");

  return (
    <div
      id="analysis"
      className="scroll-mt-20 rounded-2xl border border-destiny-purple/10 bg-white shadow-sm overflow-hidden"
    >
      <div className="bg-gradient-to-r from-destiny-purple to-destiny-purple-light text-white px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-destiny-gold text-xs font-medium mb-1">
              {copy.badge} · {copy.tagline}
            </p>
            <h3 className="font-display text-xl font-bold">{focusPalace}</h3>
            {palace && (
              <p className="text-white/70 text-sm mt-1">
                {palace.heavenlyStem}
                {palace.earthlyBranch} · {locale === "en" ? "Major stars " : "主星 "}
                {stars}
              </p>
            )}
            {palace && <PalaceTags palace={palace} />}
          </div>
          {rating && (
            <div className="text-right">
              <div className="text-4xl font-bold text-destiny-gold tabular-nums leading-none">
                {rating.score}
              </div>
              <span
                className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${SCORE_LABEL_BG[rating.label]}`}
              >
                {rating.label}
              </span>
            </div>
          )}
        </div>
      </div>

      {palace && (
        <div className="px-5 py-4 border-b border-destiny-purple/8 bg-destiny-cream/30">
          <p className="text-xs text-destiny-purple/50 mb-2">
            {locale === "en" ? "Star distribution" : "主星分佈"}
          </p>
          <PalaceStars palace={palace} />
        </div>
      )}

      <div className="px-5 py-5">
        <p className="text-destiny-purple/85 leading-relaxed text-base">{focusAnalysis.text}</p>
        <p className="text-xs text-destiny-purple/45 mt-4 leading-relaxed">
          {copy.analysisDisclaimer}{" "}
          <strong className="text-destiny-purple/60">{copy.notMasterNote}</strong>
          {locale === "en" ? ". " : "，"}
          {copy.dingPanNote}
          {locale === "en" ? ". " : "。"}
          {copy.swipeHint}
        </p>

        <Suspense fallback={null}>
          <PalaceReportSection
            chart={chart}
            focusPalace={focusPalace}
            unlockedPalaces={unlockedPalaces}
            initialReports={Object.entries(reportTexts)
              .filter((entry): entry is [PalaceName, string] => Boolean(entry[1]))
              .map(([palace, text]) => ({ palace, text }))}
            layout={layoutId}
            locale={locale}
          />
        </Suspense>
      </div>
    </div>
  );
}
