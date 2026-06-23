import type { Metadata } from "next";
import { PageBanner } from "@/components/SiteImage";
import ChartBirthForm from "@/components/chart/ChartBirthForm";
import ChartDisplay from "@/components/chart/ChartDisplay";
import { getCachedChartResults } from "@/lib/chart-analysis-cache";
import { birthInputFromSearchParams } from "@/lib/chart-parse-params";
import { parseChartLayout, parseFocusPalace } from "@/lib/chart-layout";
import { siteImages } from "@/lib/site-images";
import { getSiteUrl } from "@/lib/site-url";

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
  const layout = parseChartLayout(sp.layout);

  let chart = null;
  let chartError: string | null = parsed.error ?? null;
  let palaceScores = null;
  let palaceAnalyses = null;

  if (parsed.submitted && !parsed.error) {
    try {
      const results = await getCachedChartResults(parsed.input);
      chart = results.chart;
      palaceScores = results.palaceScores;
      palaceAnalyses = results.palaceAnalyses;
    } catch {
      chartError = "Chart generation failed. Please check your birth details.";
    }
  }

  const focusPalace = chart
    ? parseFocusPalace(sp, chart.palaces.find((p) => p.isSoulPalace)?.name ?? "命宮")
    : parseFocusPalace(sp);

  return (
    <>
      <PageBanner
        src={siteImages.services.chart}
        title="Free Zi Wei Chart"
        subtitle="Unlimited · True solar time · No sign-up"
        overlay="subtle"
      />
      <div className="py-10 px-4">
        <ChartBirthForm input={parsed.input} error={chartError} locale="en" action="/en/chart" />

        {chart && palaceScores && palaceAnalyses && (
          <div id="chart-results" className="max-w-4xl mx-auto scroll-mt-20 mt-6">
            <ChartDisplay
              chart={chart}
              palaceScores={palaceScores}
              palaceAnalyses={palaceAnalyses}
              focusPalace={focusPalace}
              layout={layout}
              searchParams={sp}
              locale="en"
            />
          </div>
        )}
      </div>
    </>
  );
}
