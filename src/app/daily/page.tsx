import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PageBanner } from "@/components/SiteImage";
import DailyPageContent from "@/components/daily/DailyPageContent";
import { faqJsonLd } from "@/components/JsonLd";
import { getDailyAlmanacForPage } from "@/lib/daily-almanac";
import { FAQ_BY_PAGE } from "@/lib/faq-content";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = buildPageMetadata({
  title: "今日流日吉凶 — 黃曆宜忌",
  description:
    "今日流日吉凶：農曆干支、建除十二神、宜忌、吉神凶煞、生肖提示。香港紫微 Sunny 師傅解讀，每日更新。",
  path: "/daily",
  image: `${getSiteUrl()}/api/og/daily`,
  keywords: ["每日運程", "黃曆", "流日", "宜忌", "農曆", "建除", "每日吉凶"],
});

export const dynamic = "force-dynamic";

const DAILY_TITLE = "今日流日吉凶 — 黃曆宜忌 | 馮命居";
const DAILY_DESCRIPTION =
  "今日流日吉凶：農曆干支、建除十二神、宜忌、吉神凶煞、生肖提示。香港紫微 Sunny 師傅解讀，每日更新。";

export default function DailyPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const faq = FAQ_BY_PAGE.daily;
  return (
    <>
      {/* 這頁會 await searchParams，metadata 會串流出 head。標題寫在靜態殼。 */}
      <title>{DAILY_TITLE}</title>
      <meta name="description" content={DAILY_DESCRIPTION} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faq)) }}
      />
      <PageBanner
        src={siteImages.bannerSecondary}
        title="今日流日吉凶"
        subtitle="黃曆宜忌 · Sunny 師傅點撥"
        overlay="subtle"
      />
      <Suspense fallback={null}>
        <DailyBody searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function DailyBody({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const sp = await searchParams;
  if (sp.date && /^\d{4}-\d{2}-\d{2}$/.test(sp.date)) {
    redirect(`/daily/${sp.date}`);
  }

  const data = await getDailyAlmanacForPage();
  return <DailyPageContent data={data} faq={FAQ_BY_PAGE.daily} />;
}
