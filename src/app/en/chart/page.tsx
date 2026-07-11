import type { Metadata } from "next";
import { PageBanner } from "@/components/SiteImage";
import ChartBirthForm from "@/components/chart/ChartBirthForm";
import ChartDisplay from "@/components/chart/ChartDisplay";
import ChartEditBirthLink from "@/components/chart/ChartEditBirthLink";
import { computeChartInsights } from "@/lib/ai/chart-insights";
import { getCachedChartResults } from "@/lib/chart-analysis-cache";
import { buildBirthKey } from "@/lib/chart-key";
import { birthInputFromSearchParams } from "@/lib/chart-parse-params";
import { parseChartPlate, parseFocusPalace } from "@/lib/chart-layout";
import { logToolUsage } from "@/lib/usage/log";
import { generateThreePlates } from "@/lib/ziwei/iztro-adapter";
import { suggestPlateFromBirthTime } from "@/lib/ziwei/zhongzhou-plates";
import ToolUsageBeacon from "@/components/ToolUsageBeacon";
import {
  getReportContentsForChart,
  getUnlockedPalaces,
} from "@/lib/palace-report/store";
import { siteImages } from "@/lib/site-images";
import { getSiteUrl } from "@/lib/site-url";
import type { PalaceName } from "@/lib/ziwei/types";

export const metadata: Metadata = {
  title: "Free Zi Wei Chart | True Solar Time",
  description:
    "Free unlimited Purple Star (Zi Wei Dou Shu) chart with true solar time correction. Hong Kong Zhong Zhou school method — no sign-up.",
  alternates: {
    canonical: `${getSiteUrl()}/en/chart`,
    languages: { "zh-HK": "/chart", en: "/en/chart" },
  },
  keywords: [
    "zi wei dou shu",
    "purple star astrology",
    "hong kong fortune telling",
    "free birth chart",
    "true solar time",
  ],
};

export default async function EnChartPage({
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
      chartError = "Chart generation failed. Please check your birth details.";
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
    await logToolUsage("chart-en", "en");
  }

  return (
    <>
      {!hasResults && (
        <PageBanner
          src={siteImages.services.chart}
          title="Free Zi Wei Chart"
          subtitle="Unlimited · True solar time · No sign-up"
          overlay="subtle"
        />
      )}
      <div className={hasResults ? "py-6 px-4" : "py-10 px-4"}>
        {!hasResults && (
          <ChartBirthForm input={parsed.input} error={chartError} locale="en" action="/en/chart" />
        )}

        {hasResults && (
          <div id="chart-results" className="max-w-4xl mx-auto scroll-mt-20">
            <ChartEditBirthLink locale="en" />
            <ToolUsageBeacon event="tool_submit" params={{ tool: "chart-en" }} />
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
              locale="en"
            />
          </div>
        )}
      </div>
    </>
  );
}
