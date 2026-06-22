import type { Metadata } from "next";
import { PageBanner } from "@/components/SiteImage";
import CompatibilityForm from "@/components/compatibility/CompatibilityForm";
import CompatibilityResult from "@/components/compatibility/CompatibilityResult";
import FaqSection from "@/components/FaqSection";
import { faqJsonLd } from "@/components/JsonLd";
import { FAQ_BY_PAGE } from "@/lib/faq-content";
import { getCachedCompatibilityResults } from "@/lib/compatibility-cache";
import { compatibilityInputFromSearchParams } from "@/lib/compatibility-parse-params";
import { buildPageMetadata } from "@/lib/seo";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = buildPageMetadata({
  title: "夾桃花 — 紫微斗數配對",
  description:
    "免費紫微斗數夾桃花 — 輸入雙方出生年月日時，用夫妻宮、命宮交叉睇配對分數同相處提示。Destiny Home Sunny 師傅。",
  path: "/compatibility",
  image: siteImages.services.chart,
  keywords: ["夾桃花", "紫微配對", "合婚", "夫妻宮", "感情配對"],
});

export default async function CompatibilityPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const parsed = compatibilityInputFromSearchParams(sp);

  let chartA = null;
  let chartB = null;
  let result = null;
  let pageError: string | null = parsed.error ?? null;

  if (parsed.submitted && !parsed.error) {
    try {
      const data = await getCachedCompatibilityResults(parsed.personA, parsed.personB);
      chartA = data.chartA;
      chartB = data.chartB;
      result = data.result;
    } catch {
      pageError = "配對分析失敗，請檢查輸入資料";
    }
  }

  return (
    <>
      <PageBanner
        src={siteImages.services.chart}
        title="夾桃花"
        subtitle="紫微斗數雙人配對 · 睇夾唔夾"
        overlay="subtle"
      />
      <div className="py-10 px-4">
        <CompatibilityForm
          personA={parsed.personA}
          personB={parsed.personB}
          error={pageError}
        />

        {chartA && chartB && result && (
          <CompatibilityResult
            personA={parsed.personA}
            personB={parsed.personB}
            chartA={chartA}
            chartB={chartB}
            result={result}
          />
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
