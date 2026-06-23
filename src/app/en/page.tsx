import type { Metadata } from "next";
import Link from "next/link";
import SiteImage from "@/components/SiteImage";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { siteImages } from "@/lib/site-images";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Zi Wei Dou Shu Hong Kong | Master Sunny",
  description:
    "Free unlimited Purple Star astrology charts with true solar time correction. Master Sunny offers in-person readings in Wanchai — 1,000+ verified reviews.",
  alternates: {
    canonical: `${getSiteUrl()}/en`,
    languages: { "zh-HK": "/", en: "/en" },
  },
  openGraph: {
    locale: "en_HK",
    title: "Destiny Home | Zi Wei Dou Shu Hong Kong",
    description:
      "Free chart tool · True solar time · Master Sunny in-person readings at Wanchai studio.",
    url: `${getSiteUrl()}/en`,
  },
};

export default function EnHomePage() {
  return (
    <>
      <section className="relative min-h-[420px] md:min-h-[480px] overflow-hidden flex items-center">
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
            {siteConfig.school} · 1,000+ verified reviews · ⭐ {siteConfig.rating.score}
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-md">
            Zi Wei Dou Shu in Hong Kong
          </h1>
          <p className="text-white/85 mb-4 leading-relaxed max-w-lg drop-shadow">
            Free online charting with true solar time — then book Master Sunny for a full 60–90 minute
            reading at our Wanchai studio.
          </p>
          <p className="text-sm text-white/65 mb-8 max-w-lg">
            No subscription · No sign-up · Unlimited charts on this device
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/en/chart" className="btn-primary text-center shadow-lg">
              Free chart now
            </Link>
            <a
              href={whatsappUrl("Hi, I'd like to book a reading with Master Sunny.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-center shadow-lg"
            >
              WhatsApp Master Sunny
            </a>
          </div>
        </div>
      </section>

      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="card text-center">
            <p className="text-3xl mb-2">∞</p>
            <h2 className="font-display font-bold text-lg mb-2">Unlimited & free</h2>
            <p className="text-sm text-destiny-purple/70">
              Generate as many charts as you like. Save up to 8 on this device — no account needed.
            </p>
          </div>
          <div className="card text-center">
            <p className="text-3xl mb-2">☀</p>
            <h2 className="font-display font-bold text-lg mb-2">True solar time</h2>
            <p className="text-sm text-destiny-purple/70">
              Birth-place longitude correction for Hong Kong, Macau, Taipei and more — like pro desktop
              software.
            </p>
          </div>
          <div className="card text-center">
            <p className="text-3xl mb-2">🤝</p>
            <h2 className="font-display font-bold text-lg mb-2">Real master, not AI-only</h2>
            <p className="text-sm text-destiny-purple/70">
              AI is a preview. Full readings (HK$2,000) with decade luck cycles — in person with Master
              Sunny.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 px-4 bg-white/50 border-y border-destiny-purple/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="section-title mb-4">Visit us in Wanchai</h2>
          <p className="text-sm text-destiny-purple/75 mb-2">{siteConfig.address}</p>
          <p className="text-sm text-destiny-purple/60 mb-6">{siteConfig.hours}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/en/booking" className="btn-secondary">
              Services & pricing
            </Link>
            <a
              href={siteConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Open in Maps
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
