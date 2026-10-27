import Link from "next/link";
import Image from "next/image";
import Liunian2027ZodiacGrid from "@/components/liunian/Liunian2027ZodiacGrid";
import { LIUNIAN_2027_HUB_PATH, liunian2027 } from "@/lib/liunian-2027";

export default function HomeLiunian2027Promo() {
  const { hub, stemBranch, year } = liunian2027;

  return (
    <section
      className="relative py-12 sm:py-14 px-4 overflow-hidden"
      aria-labelledby="home-liunian-2027-heading"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-destiny-cream via-white to-destiny-gold/15" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-destiny-gold via-destiny-purple to-destiny-gold" />
      <div className="relative max-w-5xl mx-auto">
        <div className="rounded-2xl border-2 border-destiny-gold/40 bg-white/90 shadow-lg backdrop-blur-sm p-5 sm:p-8 md:p-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-center lg:items-start">
            <div className="w-full lg:w-[min(100%,320px)] shrink-0">
              <Link href={LIUNIAN_2027_HUB_PATH} className="block group">
                <div className="relative aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden ring-2 ring-destiny-purple/20 shadow-md group-hover:ring-destiny-gold/60 transition-all">
                  <Image
                    src={hub.coverSquare}
                    alt={hub.title}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    sizes="(max-width: 1024px) 280px, 320px"
                    priority
                  />
                  <span className="absolute top-3 left-3 bg-destiny-purple text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    免費閱讀
                  </span>
                </div>
              </Link>
            </div>
            <div className="flex-1 text-center lg:text-left min-w-0">
              <p className="text-destiny-gold text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
                {year} {stemBranch}年 · 十二生肖流年
              </p>
              <h2
                id="home-liunian-2027-heading"
                className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-destiny-purple leading-tight mb-3"
              >
                2027丁未年｜十二生肖流年
              </h2>
              <p className="text-sm sm:text-base text-destiny-purple/80 leading-relaxed mb-5 max-w-xl mx-auto lg:mx-0">
                Destiny Home／馮命居為你整理丁未年太歲關係、十二生肖流年粗線同實用提點。睇完想更準？可再解鎖【流年詳批 HK$128】或【全批 HK$688】。
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center lg:justify-start mb-8">
                <Link href={LIUNIAN_2027_HUB_PATH} className="btn-primary text-center text-sm sm:text-base">
                  睇總覽全文
                </Link>
                <Link
                  href="/chart#annual-report"
                  className="btn-secondary text-center text-sm sm:text-base"
                >
                  流年詳批 HK$128
                </Link>
              </div>
            </div>
          </div>
          <Liunian2027ZodiacGrid compact showHeading />
        </div>
      </div>
    </section>
  );
}
