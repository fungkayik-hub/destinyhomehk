import Link from "next/link";
import SiteImage from "@/components/SiteImage";
import FaqSection from "@/components/FaqSection";
import { faqJsonLd } from "@/components/JsonLd";
import { FAQ_BY_PAGE } from "@/lib/faq-content";
import { academyCategories, siteConfig } from "@/lib/site-config";
import { getLatestVisibleArticles } from "@/lib/articles";
import { siteImages } from "@/lib/site-images";

const homeEntries = [
  {
    href: "/chart",
    title: "免費即時排盤",
    description: "輸入出生資料，即時睇十二宮同性格方向。",
    meta: "免費",
    image: siteImages.services.chart,
  },
  {
    href: "/book",
    title: "紫微斗數全批",
    description: "Sunny 師傅親批個人運程、大限十年及流年 — 即時選時段。",
    meta: "HK$2,000",
    image: siteImages.services.fullReading,
  },
  {
    href: "/daily",
    title: "每日流日",
    description: "今日干支、宜忌、建除 — 每日更新。",
    meta: "每日更新",
    image: siteImages.services.daily,
  },
] as const;

export default function HomePage() {
  const latestArticles = getLatestVisibleArticles(3);

  return (
    <>
      {/* 1 — Brand hero */}
      <section className="relative min-h-[88vh] md:min-h-[92vh] overflow-hidden flex items-end md:items-center">
        <SiteImage
          src={siteImages.sunnyStudio}
          alt="馮命居 Sunny 師傅"
          width={1920}
          fill
          priority
          className="object-cover object-[center_20%] md:object-center home-hero-media"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-destiny-purple via-destiny-purple/70 to-destiny-purple/25 md:bg-gradient-to-r md:from-destiny-purple/92 md:via-destiny-purple/55 md:to-destiny-purple/15" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-16 pt-28 md:py-24 home-hero-copy">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-wide leading-none mb-4 drop-shadow-md">
            {siteConfig.name}
          </h1>
          <p className="text-destiny-gold/95 text-base md:text-lg mb-3 tracking-wide">
            灣仔 · {siteConfig.school} · Sunny 師傅
          </p>
          <p className="text-white/80 text-sm md:text-base mb-8 max-w-md leading-relaxed">
            香港算命 · 紫微全批 — 免費排盤先試，再約 Sunny 師傅親批。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Link href="/book" className="btn-primary text-center shadow-lg">
              預約全批算命
            </Link>
            <Link
              href="/chart"
              className="btn-secondary text-center border-white/70 text-white hover:bg-white hover:text-destiny-purple"
            >
              免費排盤
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-white/55 tracking-wide">
            ⭐ {siteConfig.rating.score} · 過千真實好評 · IG + Google
          </p>
        </div>
      </section>

      {/* 2 — Trust strip */}
      <section className="border-b border-destiny-purple/10 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-destiny-purple/70">
            <span className="font-display font-bold text-destiny-purple">
              ⭐ {siteConfig.rating.score}
            </span>
            {" · "}過千客人真實好評
          </p>
          <p className="text-xs sm:text-sm text-destiny-purple/45 tracking-wide">
            ViuTV · TVB · VISA · 企業講座
          </p>
        </div>
      </section>

      {/* 3 — Three paths */}
      <section className="py-16 md:py-20 px-4 bg-destiny-cream/60">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-destiny-purple text-center mb-3">
            由邊度開始
          </h2>
          <p className="text-center text-destiny-purple/65 mb-12 max-w-md mx-auto text-sm md:text-base">
            先試免費工具，或直接預約 Sunny 師傅親批。
          </p>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {homeEntries.map((entry) => (
              <Link
                key={entry.href}
                href={entry.href}
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden mb-4">
                  <SiteImage
                    src={entry.image}
                    alt={entry.title}
                    width={600}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-destiny-purple/50 to-transparent" />
                  <span className="absolute bottom-3 right-3 text-xs text-white/90 tracking-wide">
                    {entry.meta}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-destiny-purple mb-2 group-hover:text-destiny-gold transition-colors">
                  {entry.title}
                </h3>
                <p className="text-sm text-destiny-purple/65 leading-relaxed">
                  {entry.description}
                </p>
              </Link>
            ))}
          </div>
          <p className="text-center mt-10">
            <Link
              href="/booking"
              className="text-sm text-destiny-gold hover:underline tracking-wide"
            >
              睇全部收費同服務 →
            </Link>
          </p>
        </div>
      </section>

      {/* 4 — Master */}
      <section className="relative overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[420px]">
          <div className="relative min-h-[280px] md:min-h-full">
            <SiteImage
              src={siteImages.heroPortrait}
              alt="Sunny 師傅"
              width={900}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="bg-destiny-purple flex items-center">
            <div className="px-8 py-14 md:px-12 md:py-16 max-w-lg">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 tracking-wide">
                Sunny 師傅
              </h2>
              <p className="text-white/75 mb-6 leading-relaxed">
                可能係最體貼嘅紫微斗數師傅。灣仔面見全批，亦接受線上預約。
              </p>
              <p className="text-destiny-gold/90 text-sm mb-1">{siteConfig.address}</p>
              <p className="text-white/50 text-sm mb-8">{siteConfig.hours}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/book" className="btn-primary text-center">
                  網上預約 · 即時選時段
                </Link>
                <Link
                  href="/about"
                  className="btn-secondary text-center border-destiny-gold/60 text-destiny-gold"
                >
                  了解師傅
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 — Latest academy */}
      {latestArticles.length > 0 && (
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-destiny-purple text-center mb-3">
              最新分享
            </h2>
            <p className="text-center text-destiny-purple/65 mb-10 text-sm">
              風水、主星、流年 — 持續更新
            </p>
            <ul className="divide-y divide-destiny-purple/10">
              {latestArticles.map((article) => (
                <li key={`${article.category}-${article.slug}`}>
                  <Link
                    href={`/academy/${article.category}/${encodeURIComponent(article.slug)}`}
                    className="group block py-5 hover:pl-1 transition-all"
                  >
                    <p className="text-xs text-destiny-gold mb-1 tracking-wide">
                      {academyCategories.find((c) => c.slug === article.category)?.title ??
                        article.category}
                    </p>
                    <p className="font-display font-bold text-destiny-purple group-hover:text-destiny-gold transition-colors">
                      {article.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="text-center mt-8">
              <Link href="/academy" className="text-sm text-destiny-gold hover:underline tracking-wide">
                瀏覽紫微斗數學堂 →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 6 — FAQ */}
      <section className="py-14 px-4 bg-destiny-cream/40">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ_BY_PAGE.home)) }}
        />
        <FaqSection items={FAQ_BY_PAGE.home} />
      </section>
    </>
  );
}
