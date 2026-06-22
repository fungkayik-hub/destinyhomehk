import Link from "next/link";
import SiteImage from "@/components/SiteImage";
import PersonalityChart from "@/components/PersonalityChart";
import MediaHighlights from "@/components/MediaHighlights";
import YouTubeSection from "@/components/YouTubeSection";
import { academyCategories, services, siteConfig, whatsappUrl } from "@/lib/site-config";
import { getArticlesByCategory, getCategoryCoverImage } from "@/lib/articles";
import { siteImages } from "@/lib/site-images";

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[420px] md:min-h-[520px] overflow-hidden flex items-center">
        <SiteImage
          src={siteImages.homeHero}
          alt=""
          width={1920}
          priority
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-destiny-purple/88 via-destiny-purple/60 to-destiny-purple/20" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-14 md:py-20">
          <p className="text-destiny-gold text-sm mb-3 tracking-wide">
            {siteConfig.school} · 過千真實好評 ⭐ {siteConfig.rating.score}
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-md">
            性格決定命運
          </h1>
          <p className="text-white/85 mb-4 leading-relaxed max-w-lg drop-shadow">
            人出生如白紙，從懂事起經歷人生，逐漸染上獨特顏色，閃耀我心獨有的光華。
          </p>
          <p className="text-sm text-white/65 mb-8 max-w-lg">
            Sunny 師傅親自調校排盤系統 · 結合傳統玄學與現代技術
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/chart" className="btn-primary text-center shadow-lg">
              免費即時排盤
            </Link>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-center shadow-lg"
            >
              WhatsApp 預約
            </a>
          </div>
        </div>
      </section>

      <section className="relative h-32 md:h-44 overflow-hidden">
        <SiteImage
          src={siteImages.bannerPrimary}
          alt="Destiny Home"
          width={1920}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-destiny-purple/55 flex items-center justify-center px-4">
          <p className="font-display text-white text-base sm:text-lg md:text-2xl font-bold tracking-wide text-center leading-snug">
            可能係最體貼嘅紫微斗數師傅
            <span className="block text-sm sm:text-base font-sans font-normal text-white/85 mt-1">
              灣仔駱克道382號1807室
            </span>
          </p>
        </div>
      </section>

      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-title mb-10">服務項目</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="card hover:shadow-xl transition-shadow group p-0 overflow-hidden"
              >
                <div className="relative h-36 overflow-hidden bg-destiny-cream">
                  <SiteImage
                    src={siteImages.services[s.imageKey]}
                    alt={s.title}
                    width={600}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-destiny-purple/60 to-transparent" />
                  <span className="absolute bottom-2 right-2 text-xs bg-destiny-gold text-destiny-purple px-2 py-1 rounded-full font-medium">
                    {s.price}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold group-hover:text-destiny-gold transition-colors mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-destiny-purple/70">{s.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <MediaHighlights variant="compact" />

      <PersonalityChart />

      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-title mb-3">紫微斗數學堂</h2>
          <p className="text-center text-destiny-purple/70 mb-10 max-w-xl mx-auto">
            風水、主星、命理故事 — 持續更新
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {academyCategories.slice(0, 8).map((cat) => {
              const count = getArticlesByCategory(cat.slug).length;
              const cover = getCategoryCoverImage(cat.slug);
              return (
                <Link
                  key={cat.slug}
                  href={`/academy/${cat.slug}`}
                  className="card hover:shadow-lg transition-all group p-0 overflow-hidden"
                >
                  {cover && (
                    <div className="relative h-28 overflow-hidden bg-destiny-cream">
                      <SiteImage
                        src={cover}
                        alt={cat.title}
                        width={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-display font-bold text-sm mb-1 group-hover:text-destiny-gold transition-colors line-clamp-2">
                      {cat.title}
                    </h3>
                    {count > 0 && (
                      <p className="text-xs text-destiny-purple/40">{count} 篇</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Link href="/academy" className="btn-secondary text-sm">
              瀏覽全部學堂
            </Link>
          </div>
        </div>
      </section>

      <YouTubeSection />

      <section className="py-14 px-4 bg-destiny-cream">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
            <SiteImage
              src={siteImages.heroPortrait}
              alt="Sunny 師傅"
              width={800}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-destiny-purple mb-4">
              預約 Sunny 師傅
            </h2>
            <p className="text-destiny-purple/70 mb-2">{siteConfig.address}</p>
            <p className="text-destiny-purple/70 mb-2">{siteConfig.hours}</p>
            <p className="text-sm text-destiny-gold mb-6">⭐ {siteConfig.rating.score} · 過千好評</p>
            <div className="flex flex-col sm:flex-row gap-3 md:justify-start justify-center">
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn-primary">
                WhatsApp 立即預約
              </a>
              <Link href="/about" className="btn-secondary">了解師傅</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
