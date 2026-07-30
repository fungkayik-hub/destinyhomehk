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
  title: "姓名學諮詢價格 — 免費五格查詢 · 改名 HK$3,800",
  description:
    "香港姓名學老師 Sunny 師傅｜免費查康熙筆劃五格吉凶；正式改名諮詢 HK$3,800（含 8 個名字 + 電話講解）。灣仔工作室，WhatsApp 預約。",
  path: "/nameology",
  image: siteImages.services.nameNumerology,
  keywords: [
    "姓名學諮詢價格",
    "姓名學老師",
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
        {!result && (
          <div className="max-w-5xl mx-auto mb-8 rounded-2xl border border-destiny-gold/25 bg-destiny-gold/5 px-5 py-4 text-sm text-destiny-purple/80 leading-relaxed">
            <p>
              <strong className="text-destiny-purple">姓名學諮詢價格：</strong>
              網上五格查詢免費；正式改名／起名 HK$3,800（8 個名字建議 + 15–30 分鐘電話講解）。
              由灣仔姓名學老師 Sunny 師傅親做，可配合紫微命盤。
            </p>
            <p className="mt-2">
              <Link href="/booking#birth-name" className="text-destiny-gold hover:underline font-medium">
                睇收費詳情
              </Link>
              <span className="text-destiny-purple/30 mx-2">·</span>
              <Link href="/booking" className="text-destiny-gold hover:underline font-medium">
                WhatsApp 預約改名
              </Link>
            </p>
          </div>
        )}

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
          <Link href="/booking#birth-name" className="text-destiny-gold hover:underline">
            改名收費 HK$3,800
          </Link>
        </div>

        <FaqSection items={FAQ_BY_PAGE.nameology} />
      </div>
    </>
  );
}
