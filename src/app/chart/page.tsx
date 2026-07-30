import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/SiteImage";
import ChartBirthForm from "@/components/chart/ChartBirthForm";
import ChartDisplay from "@/components/chart/ChartDisplay";
import ChartEditBirthLink from "@/components/chart/ChartEditBirthLink";
import ToolUsageBeacon from "@/components/ToolUsageBeacon";
import FaqSection from "@/components/FaqSection";
import { faqJsonLd } from "@/components/JsonLd";
import { FAQ_BY_PAGE } from "@/lib/faq-content";
import { computeChartInsights } from "@/lib/ai/chart-insights";
import { getCachedChartResults } from "@/lib/chart-analysis-cache";
import { buildBirthKey } from "@/lib/chart-key";
import { birthInputFromSearchParams } from "@/lib/chart-parse-params";
import { parseChartPlate, parseFocusPalace } from "@/lib/chart-layout";
import { logToolUsage } from "@/lib/usage/log";
import { generateThreePlates } from "@/lib/ziwei/iztro-adapter";
import { suggestPlateFromBirthTime } from "@/lib/ziwei/zhongzhou-plates";
import {
  getReportContentsForChart,
  getUnlockedPalaces,
} from "@/lib/palace-report/store";
import { buildPageMetadata } from "@/lib/seo";
import { siteImages } from "@/lib/site-images";
import type { PalaceName } from "@/lib/ziwei/types";

export const metadata: Metadata = buildPageMetadata({
  title: "免費紫微排盤 — 香港天地人盤即時起盤",
  description:
    "免費紫微排盤｜香港中洲派天地人盤、真太陽時校正、十二宮小徒弟贈言。想深入全批？灣仔 Sunny 師傅 HK$2,000，WhatsApp 預約。",
  path: "/chart",
  image: siteImages.services.chart,
  keywords: [
    "免費紫微排盤",
    "紫微排盤",
    "紫微斗數排盤",
    "紫微斗數天地人盤排盤",
    "天地人盤",
    "免費算命",
    "真太陽時",
    "十二宮",
    "香港紫微斗數",
  ],
});

export default async function ChartPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const parsed = birthInputFromSearchParams(sp);
  const plate = parseChartPlate(sp.plate);

  let chart = null;
  let threePlates = null;
  let chartError: string | null = parsed.error ?? null;
  let palaceScores = null;
  let palaceAnalyses = null;
  let suggestedPlate = suggestPlateFromBirthTime(
    parsed.input.hour,
    parsed.input.minute,
  );

  if (parsed.submitted && !parsed.error) {
    try {
      const results = await getCachedChartResults(parsed.input, plate);
      chart = results.chart;
      palaceScores = results.palaceScores;
      palaceAnalyses = results.palaceAnalyses;
      threePlates = generateThreePlates(parsed.input);
      suggestedPlate = suggestPlateFromBirthTime(
        chart.trueSolarTime?.correctedHour ?? parsed.input.hour,
        chart.trueSolarTime?.correctedMinute ?? parsed.input.minute,
      );
    } catch {
      chartError = "排盤失敗，請檢查輸入資料";
    }
  }

  const focusPalace = chart
    ? parseFocusPalace(sp, chart.palaces.find((p) => p.isSoulPalace)?.name ?? "命宮")
    : parseFocusPalace(sp);

  let unlockedPalaces: PalaceName[] = [];
  let reportTexts: Partial<Record<PalaceName, string>> = {};
  let birthKey = "";
  if (parsed.submitted && !parsed.error) {
    birthKey = buildBirthKey(parsed.input);
    unlockedPalaces = await getUnlockedPalaces(birthKey);
    const contents = await getReportContentsForChart(birthKey);
    reportTexts = Object.fromEntries(contents.map((c) => [c.palace, c.text]));
  }

  const hasResults = Boolean(chart && palaceScores && palaceAnalyses && threePlates);

  if (chart && palaceScores && palaceAnalyses) {
    await logToolUsage("chart");
  }

  return (
    <>
      {!hasResults && (
        <PageBanner
          src={siteImages.services.chart}
          title="免費紫微排盤"
          subtitle="香港中洲派天地人盤 · 輸入出生資料即時起盤 · 過千好評 Sunny 師傅"
          overlay="subtle"
        />
      )}
      <div className={hasResults ? "py-6 px-4" : "py-10 px-4"}>
        {!hasResults && (
          <>
            <div className="max-w-5xl mx-auto mb-6 rounded-2xl border border-destiny-gold/30 bg-destiny-gold/5 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-display font-bold text-destiny-purple">
                  排盤免費 · 想真人算命？
                </p>
                <p className="text-sm text-destiny-purple/70 mt-1">
                  小徒弟贈言只係入門；紫微全批 HK$2,000，Sunny 師傅親批大限流年。
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <Link href="/book" className="btn-primary text-sm">
                  預約全批
                </Link>
                <Link href="/booking#full-reading" className="btn-secondary text-sm">
                  睇收費
                </Link>
              </div>
            </div>
            <ChartBirthForm input={parsed.input} error={chartError} />
          </>
        )}

        {hasResults && (
          <div id="chart-results" className="max-w-4xl mx-auto scroll-mt-20">
            <ChartEditBirthLink locale="zh" />
            <ToolUsageBeacon event="tool_submit" params={{ tool: "chart" }} />
            <ChartDisplay
              chart={chart!}
              threePlates={threePlates!}
              plate={plate}
              suggestedPlate={suggestedPlate}
              birthKey={birthKey}
              insights={computeChartInsights(chart!)}
              palaceScores={palaceScores!}
              palaceAnalyses={palaceAnalyses!}
              focusPalace={focusPalace}
              searchParams={sp}
              unlockedPalaces={unlockedPalaces}
              reportTexts={reportTexts}
              locale="zh"
            />
          </div>
        )}
      </div>
      <div className="px-4 pb-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ_BY_PAGE.chart)) }}
        />
        <FaqSection items={FAQ_BY_PAGE.chart} />
      </div>
    </>
  );
}
