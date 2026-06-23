import type { Metadata } from "next";
import { PageBanner } from "@/components/SiteImage";
import ChartBirthForm from "@/components/chart/ChartBirthForm";
import ChartDisplay from "@/components/chart/ChartDisplay";
import FaqSection from "@/components/FaqSection";
import { faqJsonLd } from "@/components/JsonLd";
import { FAQ_BY_PAGE } from "@/lib/faq-content";
import { getCachedChartResults } from "@/lib/chart-analysis-cache";
import { birthInputFromSearchParams } from "@/lib/chart-parse-params";
import { parseChartLayout, parseFocusPalace } from "@/lib/chart-layout";
import { buildPageMetadata } from "@/lib/seo";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = buildPageMetadata({
  title: "紫微即時排盤及分析",
  description:
    "免費香港紫微斗數即時排盤 — 無限次、真太陽時校正、無需註冊。輸入出生年月日時，中洲派十二宮 AI 分析。灣仔 Sunny 師傅 Destiny Home。",
  path: "/chart",
  image: siteImages.services.chart,
  keywords: ["紫微排盤", "免費算命", "真太陽時", "十二宮", "無限次排盤"],
});

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
