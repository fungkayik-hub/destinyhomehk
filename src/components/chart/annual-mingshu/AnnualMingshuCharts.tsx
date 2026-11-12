"use client";

import { useMemo } from "react";
import type { ZiWeiChart } from "@/lib/ziwei";
import type { PalaceScore } from "@/lib/ai/types";
import type { ChartFortuneSummaryData } from "@/lib/chart-fortune-summary";
import type { AnnualReportViewId } from "@/lib/palace-report-copy";
import { parseLiuyueFromReport } from "@/lib/palace-report/parse-liuyue";
import MingshuPalacePlate from "./MingshuPalacePlate";
import MingshuWuXingChart from "./MingshuWuXingChart";
import MingshuDecadalCharts from "./MingshuDecadalCharts";
import MingshuLiuyueChart from "./MingshuLiuyueChart";
import MingshuLiunianChart from "./MingshuLiunianChart";

function forecastYear(): number {
  return new Date().getFullYear();
}

function isFullTierCharts(view: AnnualReportViewId): boolean {
  return view === "full" || view === "legacyDetailed";
}

interface Props {
  chart: ZiWeiChart;
  scoreByPalace: Map<string, PalaceScore>;
  fortuneSummary: ChartFortuneSummaryData;
  reportText: string;
  activeView: AnnualReportViewId;
  locale?: "zh" | "en";
  /** PDF 擷取時用緊湊排版 */
  forPdf?: boolean;
}

export default function AnnualMingshuCharts({
  chart,
  scoreByPalace,
  fortuneSummary,
  reportText,
  activeView,
  locale = "zh",
  forPdf = false,
}: Props) {
  const zh = locale === "zh";
  const year = forecastYear();
  const months = useMemo(() => parseLiuyueFromReport(reportText), [reportText]);
  const fullDecadal = isFullTierCharts(activeView);

  return (
    <div className={`space-y-5 ${forPdf ? "bg-white text-destiny-purple p-4" : ""}`} data-mingshu-charts>
      <ChartsIntro zh={zh} year={year} forPdf={forPdf} />

      <div>
        <SectionLabel zh={zh} title={zh ? "十二宮命盤" : "Twelve palaces"} forPdf={forPdf} />
        <MingshuPalacePlate chart={chart} scoreByPalace={scoreByPalace} compact={forPdf} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <SectionLabel zh={zh} title={zh ? "流年五維" : "Annual dimensions"} forPdf={forPdf} />
          <MingshuLiunianChart data={fortuneSummary} year={year} locale={locale} />
        </div>
        <div>
          <SectionLabel zh={zh} title={zh ? "五行強弱" : "Five elements"} forPdf={forPdf} />
          <MingshuWuXingChart chineseDate={chart.chineseDate} locale={locale} />
        </div>
      </div>

      <div>
        <SectionLabel
          zh={zh}
          title={fullDecadal ? (zh ? "大運時間軸" : "Decadal luck") : (zh ? "大運摘要" : "Decadal note")}
          forPdf={forPdf}
        />
        <MingshuDecadalCharts
          data={fortuneSummary}
          mode={fullDecadal ? "full" : "teaser"}
          locale={locale}
        />
      </div>

      <div>
        <SectionLabel zh={zh} title={zh ? "十二流月" : "Monthly flow"} forPdf={forPdf} />
        <MingshuLiuyueChart months={months} year={year} locale={locale} />
      </div>
    </div>
  );
}

function SectionLabel({ title }: { zh: boolean; title: string; forPdf?: boolean }) {
  return <h4 className="font-display font-bold text-destiny-purple text-sm mb-2">{title}</h4>;
}

function ChartsIntro({ zh, year, forPdf }: { zh: boolean; year: number; forPdf?: boolean }) {
  if (forPdf) {
    return (
      <div className="border-b border-destiny-gold/30 pb-4 mb-2 text-center">
        <p className="text-destiny-gold text-xs tracking-widest mb-1">馮命居 Destiny Home</p>
        <p className="font-display text-xl font-bold text-destiny-purple">{year} 流年命書</p>
        <p className="text-[11px] text-destiny-purple/55 mt-1">網上小師傅命書 · 圖表與文字對照版</p>
      </div>
    );
  }
  return (
    <p className="text-xs text-destiny-purple/50 leading-relaxed border-b border-destiny-gold/20 pb-3">
      {zh
        ? `以下圖表按你嘅本命排盤與 ${year} 流年命書文字同步整理，方便對照閱讀。`
        : `Charts align with your chart data and the ${year} report text.`}
    </p>
  );
}
