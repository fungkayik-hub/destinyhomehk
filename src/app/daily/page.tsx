import type { Metadata } from "next";
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
  title: "每日流日吉凶預報 — 黃曆宜忌",
  description:
    "Destiny Home 每日流日 — 農曆干支、建除十二神、宜忌、吉神凶煞、生肖提示。香港紫微 Sunny 師傅解讀，每日更新。",
  path: "/daily",
  image: `${getSiteUrl()}/api/og/daily`,
  keywords: ["每日運程", "黃曆", "流日", "宜忌", "農曆", "建除", "每日吉凶"],
});

export const dynamic = "force-dynamic";

export default async function DailyPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const sp = await searchParams;
  if (sp.date && /^\d{4}-\d{2}-\d{2}$/.test(sp.date)) {
    redirect(`/daily/${sp.date}`);
  }

  const data = await getDailyAlmanacForPage();
  const faq = FAQ_BY_PAGE.daily;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faq)) }}
      />
      <PageBanner
        src={siteImages.bannerSecondary}
        title="每日流日吉凶預報"
        subtitle="真實農曆黃曆 · Sunny 師傅點撥"
        overlay="subtle"
      />
      <DailyPageContent data={data} faq={faq} />
    </>
  );
}
