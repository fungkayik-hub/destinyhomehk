import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/SiteImage";
import DatePickerForm from "@/components/date-picker/DatePickerForm";
import DatePickerResults from "@/components/date-picker/DatePickerResults";
import ToolUsageBeacon from "@/components/ToolUsageBeacon";
import FaqSection from "@/components/FaqSection";
import { faqJsonLd } from "@/components/JsonLd";
import { apprenticeCopy } from "@/lib/apprentice-copy";
import { computeWeddingDates } from "@/lib/date-picker";
import { datePickerInputFromSearchParams } from "@/lib/date-picker-parse-params";
import { logToolUsage } from "@/lib/usage/log";
import { FAQ_BY_PAGE } from "@/lib/faq-content";
import { buildPageMetadata } from "@/lib/seo";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = buildPageMetadata({
  title: "結婚吉日篩選 — 黃曆宜忌 + 生肖冲煞",
  description:
    "免費結婚吉日篩選 — 選擇上頭、過大禮、出門、入門等 10 種儀式，掃描 18 個月內黃曆宜忌，避開冲新郎新娘生肖。Destiny Home Sunny 師傅門下整理。",
  path: "/date-picker",
  image: siteImages.services.datePicker,
  keywords: [
    "結婚吉日",
    "結婚擇日",
    "上頭吉日",
    "過大禮擇日",
    "出門吉時",
    "黃曆嫁娶",
    "香港結婚擇日",
  ],
});

export default async function DatePickerPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const parsed = datePickerInputFromSearchParams(sp);
  const copy = apprenticeCopy;

  let result = null;
  let pageError: string | null = parsed.error ?? null;

  if (parsed.submitted && !parsed.error) {
    try {
      result = computeWeddingDates({
        ceremonyId: parsed.ceremonyId,
        startDate: parsed.startDate,
        endDate: parsed.endDate,
        personA: parsed.personA,
        personB: parsed.personB,
      });
    } catch {
      pageError = "篩選時發生錯誤，請稍後再試。";
    }
  }

  if (result) {
    await logToolUsage("date-picker");
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(FAQ_BY_PAGE.datePicker)),
        }}
      />
      <PageBanner
        src={siteImages.services.datePicker}
        title={copy.datePickerName}
        subtitle={copy.datePickerSubtitle}
        overlay="subtle"
      />
      <div className="py-12 px-4">
        <DatePickerForm
          ceremonyId={parsed.ceremonyId}
          startDate={parsed.startDate}
          endDate={parsed.endDate}
          personA={parsed.personA}
          personB={parsed.personB}
          error={pageError}
        />

        {result && (
          <>
            <ToolUsageBeacon event="tool_submit" params={{ tool: "date-picker" }} />
            <DatePickerResults result={result} />
          </>
        )}

        <div className="max-w-5xl mx-auto mt-8 flex flex-wrap gap-3 text-sm justify-center">
          <Link href="/daily" className="text-destiny-gold hover:underline">
            每日流日黃曆
          </Link>
          <span className="text-destiny-purple/30">·</span>
          <Link href="/compatibility" className="text-destiny-gold hover:underline">
            姻緣探測器
          </Link>
          <span className="text-destiny-purple/30">·</span>
          <Link href="/wedding-date" className="text-destiny-gold hover:underline">
            師傅擇日服務
          </Link>
        </div>

        <FaqSection items={FAQ_BY_PAGE.datePicker} />
      </div>
    </>
  );
}
