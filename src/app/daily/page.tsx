import Link from "next/link";
import { PageBanner } from "@/components/SiteImage";
import DailyPoster from "@/components/daily/DailyPoster";
import FaqSection from "@/components/FaqSection";
import { faqJsonLd } from "@/components/JsonLd";
import { computeDailyAlmanac } from "@/lib/daily-almanac";
import { FAQ_BY_PAGE } from "@/lib/faq-content";
import { buildPageMetadata } from "@/lib/seo";
import { siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "每日流日吉凶預報 — 黃曆宜忌",
  description:
    "Destiny Home 每日流日 — 農曆干支、建除十二神、宜忌、吉神凶煞、生肖提示。香港紫微 Sunny 師傅解讀，每日更新。",
  path: "/daily",
  image: siteImages.services.chart,
  keywords: ["每日運程", "黃曆", "流日", "宜忌", "農曆", "建除", "每日吉凶"],
});

export default async function DailyPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const sp = await searchParams;
  const data = computeDailyAlmanac(sp.date);
  const faq = FAQ_BY_PAGE.daily;
  const faqLd = faqJsonLd(faq);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <PageBanner
        src={siteImages.bannerSecondary}
        title="每日流日吉凶預報"
        subtitle="真實農曆黃曆 · Sunny 師傅點撥"
        overlay="subtle"
      />
      <div className="py-10 px-4">
        <div className="max-w-3xl mx-auto mb-8">
          <form method="GET" className="card flex flex-wrap items-end gap-4">
            <label className="block flex-1 min-w-[200px]">
              <span className="text-sm text-destiny-purple/70 mb-1 block">選擇日期</span>
              <input
                type="date"
                name="date"
                defaultValue={data.date}
                className="w-full border border-destiny-purple/20 rounded-lg px-3 py-2"
              />
            </label>
            <button type="submit" className="btn-primary">
              查看流日
            </button>
          </form>
          <p className="text-xs text-destiny-purple/50 mt-3">
            干支、宜忌、神煞來自傳統曆法；師傅解讀僅供參考。個人運程請
            <Link href="/chart" className="text-destiny-gold hover:underline mx-1">
              排盤
            </Link>
            或預約全批。
          </p>
        </div>

        <DailyPoster data={data} />

        <div className="max-w-3xl mx-auto mt-8 text-center">
          <p className="text-sm text-destiny-purple/60 mb-4">
            截圖即可發 IG Story · 每日更新
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <Link href="/chart" className="text-destiny-gold hover:underline">
              免費排盤
            </Link>
            <span className="text-destiny-purple/30">·</span>
            <Link href="/compatibility" className="text-destiny-gold hover:underline">
              夾桃花
            </Link>
            <span className="text-destiny-purple/30">·</span>
            <Link href="/wedding-date" className="text-destiny-gold hover:underline">
              結婚擇日
            </Link>
            <span className="text-destiny-purple/30">·</span>
            <Link href="/academy/2026-zodiac" className="text-destiny-gold hover:underline">
              2026 流年
            </Link>
          </div>
        </div>

        <FaqSection items={faq} />
      </div>
    </>
  );
}
