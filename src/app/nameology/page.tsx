import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/SiteImage";
import NameologyForm from "@/components/nameology/NameologyForm";
import NameologyResults from "@/components/nameology/NameologyResults";
import ToolUsageBeacon from "@/components/ToolUsageBeacon";
import FaqSection from "@/components/FaqSection";
import { faqJsonLd } from "@/components/JsonLd";
import { apprenticeCopy } from "@/lib/apprentice-copy";
import { computeWuge } from "@/lib/nameology";
import { nameologyInputFromSearchParams } from "@/lib/nameology-parse-params";
import { logToolUsage } from "@/lib/usage/log";
import { FAQ_BY_PAGE } from "@/lib/faq-content";
import { buildPageMetadata } from "@/lib/seo";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = buildPageMetadata({
  title: "台灣姓名學五格查詢 — 康熙筆劃吉凶",
  description:
    "免費輸入姓名，即時計康熙筆劃、天格人格地格外格總格吉凶。Destiny Home 採用台灣姓名學五格剖象；改名諮詢 HK$3,800。",
  path: "/nameology",
  image: siteImages.services.nameNumerology,
  keywords: [
    "姓名學",
    "台灣姓名學",
    "五格剖象",
    "總格筆劃",
    "康熙筆劃",
    "姓名學查詢",
    "改名",
    "香港改名",
  ],
});

export default async function NameologyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const parsed = nameologyInputFromSearchParams(sp);
  const copy = apprenticeCopy;

  let result = null;
  let pageError: string | null = parsed.error ?? null;

  if (parsed.submitted && !parsed.error) {
    try {
      result = computeWuge({
        surname: parsed.surname,
        givenName: parsed.givenName,
      });
    } catch (err) {
      pageError =
        err instanceof Error ? err.message : "查詢時發生錯誤，請稍後再試。";
    }
  }

  if (result) {
    await logToolUsage("nameology");
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(FAQ_BY_PAGE.nameology)),
        }}
      />
      <PageBanner
        src={siteImages.services.nameNumerology}
        title={copy.nameologyName}
        subtitle={copy.nameologySubtitle}
        overlay="subtle"
      />
      <div className="py-12 px-4">
        <NameologyForm
          surname={parsed.surname}
          givenName={parsed.givenName}
          error={pageError}
        />

        {result && (
          <>
            <ToolUsageBeacon event="tool_submit" params={{ tool: "nameology" }} />
            <NameologyResults result={result} />
          </>
        )}

        <div className="max-w-5xl mx-auto mt-8 flex flex-wrap gap-3 text-sm justify-center">
          <Link href="/academy/name-numerology" className="text-destiny-gold hover:underline">
            姓名學總格解說
          </Link>
          <span className="text-destiny-purple/30">·</span>
          <Link href="/chart" className="text-destiny-gold hover:underline">
            免費紫微排盤
          </Link>
          <span className="text-destiny-purple/30">·</span>
          <Link href="/booking" className="text-destiny-gold hover:underline">
            預約改名服務
          </Link>
        </div>

        <FaqSection items={FAQ_BY_PAGE.nameology} />
      </div>
    </>
  );
}
