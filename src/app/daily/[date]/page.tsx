import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/SiteImage";
import DailyPageContent from "@/components/daily/DailyPageContent";
import { faqJsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema-extra";
import { getDailyAlmanacForPage } from "@/lib/daily-almanac";
import { FAQ_BY_PAGE } from "@/lib/faq-content";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";
import { siteImages } from "@/lib/site-images";

export const dynamic = "force-dynamic";

function isValidDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  if (!isValidDate(date)) return {};

  const data = await getDailyAlmanacForPage(date);
  return buildPageMetadata({
    title: `${data.solarLabel} 流日宜忌 — 黃曆吉凶`,
    description: `${data.solarLabel} ${data.lunarLabel}。宜：${data.yi.slice(0, 4).join("、")}。${data.headline.replace(/【|】/g, "")}`,
    path: `/daily/${date}`,
    image: `${getSiteUrl()}/api/og/daily?date=${date}`,
    keywords: ["流日", "黃曆", data.ganzhi.day, "宜忌", "每日運程"],
  });
}

export default async function DailyDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  if (!isValidDate(date)) notFound();

  const data = await getDailyAlmanacForPage(date);
  const faq = FAQ_BY_PAGE.daily;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            faqJsonLd(faq),
            breadcrumbJsonLd([
              { name: "首頁", href: "/" },
              { name: "每日流日", href: "/daily" },
              { name: data.solarLabel, href: `/daily/${date}` },
            ]),
          ]),
        }}
      />
      <PageBanner
        src={siteImages.bannerSecondary}
        title={`${data.solarLabel} 流日`}
        subtitle={data.lunarLabel}
        overlay="subtle"
      />
      <DailyPageContent data={data} faq={faq} showBreadcrumb />
    </>
  );
}
