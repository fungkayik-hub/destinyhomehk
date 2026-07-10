import type { Metadata } from "next";
import { PageBanner } from "@/components/SiteImage";
import CompatibilityForm from "@/components/compatibility/CompatibilityForm";
import CompatibilityResult from "@/components/compatibility/CompatibilityResult";
import CompatibilityEditLink from "@/components/compatibility/CompatibilityEditLink";
import ToolUsageBeacon from "@/components/ToolUsageBeacon";
import FaqSection from "@/components/FaqSection";
import { faqJsonLd } from "@/components/JsonLd";
import { apprenticeCopy } from "@/lib/apprentice-copy";
import { FAQ_BY_PAGE } from "@/lib/faq-content";
import { getCachedCompatibilityResults } from "@/lib/compatibility-cache";
import { compatibilityInputFromSearchParams } from "@/lib/compatibility-parse-params";
import { parseChartPlate } from "@/lib/chart-layout";
import { logToolUsage } from "@/lib/usage/log";
import { suggestPlateFromBirthTime } from "@/lib/ziwei/zhongzhou-plates";
import { buildPageMetadata } from "@/lib/seo";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = buildPageMetadata({
  title: "姻緣探測器 — 紫微斗數雙人配對",
  description:
    "免費姻緣探測器 — 輸入雙方出生資料，用夫妻宮、命宮交叉探測緣分指數同相處贈言。Destiny Home Sunny 師傅門下小徒弟整理，深入合婚請預約。",
  path: "/compatibility",
  image: siteImages.services.compatibility,
  keywords: ["姻緣探測器", "夾桃花", "紫微配對", "合婚", "夫妻宮", "感情配對"],
});

export default async function CompatibilityPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const parsed = compatibilityInputFromSearchParams(sp);
  const plate = parseChartPlate(sp.plate);
  const copy = apprenticeCopy;

  let chartA = null;
  let chartB = null;
  let result = null;
  let pageError: string | null = parsed.error ?? null;
  let suggestedPlateA = suggestPlateFromBirthTime(
    parsed.personA.hour,
    parsed.personA.minute,
  );
  let suggestedPlateB = suggestPlateFromBirthTime(
    parsed.personB.hour,
    parsed.personB.minute,
  );

  if (parsed.submitted && !parsed.error) {
    try {
      const data = await getCachedCompatibilityResults(parsed.personA, parsed.personB, plate);
      chartA = data.chartA;
      chartB = data.chartB;
      result = data.result;
      suggestedPlateA = suggestPlateFromBirthTime(
        chartA.trueSolarTime?.correctedHour ?? parsed.personA.hour,
        chartA.trueSolarTime?.correctedMinute ?? parsed.personA.minute,
      );
      suggestedPlateB = suggestPlateFromBirthTime(
        chartB.trueSolarTime?.correctedHour ?? parsed.personB.hour,
        chartB.trueSolarTime?.correctedMinute ?? parsed.personB.minute,
      );
    } catch {
      pageError = "姻緣探測失敗，請檢查輸入資料";
    }
  }

  const hasResults = Boolean(chartA && chartB && result);

  if (chartA && chartB && result) {
    await logToolUsage("compatibility");
  }

  return (
    <>
      {!hasResults && (
        <PageBanner
          src={siteImages.services.compatibility}
          title={copy.detectorName}
          subtitle={copy.detectorSubtitle}
          overlay="subtle"
        />
      )}
      <div className={hasResults ? "py-6 px-4" : "py-10 px-4"}>
        {!hasResults && (
          <CompatibilityForm
            personA={parsed.personA}
            personB={parsed.personB}
            error={pageError}
          />
        )}

        {hasResults && (
          <>
            <CompatibilityEditLink />
            <ToolUsageBeacon event="tool_submit" params={{ tool: "compatibility" }} />
            <CompatibilityResult
              personA={parsed.personA}
              personB={parsed.personB}
              chartA={chartA!}
              chartB={chartB!}
              result={result!}
              plate={plate}
              suggestedPlateA={suggestedPlateA}
              suggestedPlateB={suggestedPlateB}
              searchParams={sp}
            />
          </>
        )}
      </div>
      <div className="px-4 pb-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd(FAQ_BY_PAGE.compatibility)),
          }}
        />
        <FaqSection items={FAQ_BY_PAGE.compatibility} />
      </div>
    </>
  );
}
