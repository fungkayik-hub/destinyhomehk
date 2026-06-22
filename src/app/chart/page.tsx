import type { Metadata } from "next";
import { PageBanner } from "@/components/SiteImage";
import ChartBirthForm from "@/components/chart/ChartBirthForm";
import ChartDisplay from "@/components/chart/ChartDisplay";
import { getCachedChartResults } from "@/lib/chart-analysis-cache";
import { birthInputFromSearchParams } from "@/lib/chart-parse-params";
import { parseChartLayout, parseFocusPalace } from "@/lib/chart-layout";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "紫微即時排盤及分析",
  description:
    "免費紫微斗數即時排盤，輸入出生年月日時即時起盤。深度解盤請 WhatsApp 預約 Sunny 師傅。",
  alternates: { canonical: "/chart" },
};

export default async function ChartPage({
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
      chartError = "排盤失敗，請檢查輸入資料";
    }
  }

  const focusPalace = chart
    ? parseFocusPalace(sp, chart.palaces.find((p) => p.isSoulPalace)?.name ?? "命宮")
    : parseFocusPalace(sp);

  return (
    <>
      <PageBanner
        src={siteImages.services.chart}
        title="紫微即時排盤及分析"
        subtitle="輸入出生資料，即時起盤"
        overlay="subtle"
      />
      <div className="py-10 px-4">
        <ChartBirthForm input={parsed.input} error={chartError} />

        {chart && palaceScores && palaceAnalyses && (
          <div id="chart-results" className="max-w-4xl mx-auto scroll-mt-20 mt-6">
            <ChartDisplay
              chart={chart}
              palaceScores={palaceScores}
              palaceAnalyses={palaceAnalyses}
              focusPalace={focusPalace}
              layout={layout}
              searchParams={sp}
            />
          </div>
        )}
      </div>
    </>
  );
}
