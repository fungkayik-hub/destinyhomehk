import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/SiteImage";
import { pricingPlans, siteConfig, whatsappUrl } from "@/lib/site-config";
import { getSiteUrl } from "@/lib/site-url";

const PLAN_EN: Record<string, { title: string; duration?: string; description: string }> = {
  "full-reading": {
    title: "Full chart reading",
    duration: "60–90 minutes",
    description:
      "Life path, marriage, career, wealth, family, health; includes decade luck cycles and annual forecast.",
  },
  "date-picker": {
    title: "Auspicious date & time",
    duration: "15–30 minutes",
    description: "Wedding and move-in dates — hair combing, door entry, ceremony timing.",
  },
  "annual-inquiry": {
    title: "Annual / single-topic inquiry",
    duration: "30–45 minutes",
    description: "Focused reading on a specific year or question.",
  },
  "feng-shui": {
    title: "Residential feng shui",
    description: "Home survey and layout advice, priced per square foot.",
  },
  "birth-name": {
    title: "Baby naming",
    description: "Taiwanese nameology aligned with birth chart.",
  },
};

export const metadata: Metadata = {
  title: "Services & Booking | Master Sunny",
  description:
    "Full reading HK$2,000, auspicious dates HK$800, annual inquiry HK$1,000. Book Master Sunny in Wanchai via WhatsApp.",
  alternates: {
    canonical: `${getSiteUrl()}/en/booking`,
    languages: { "zh-HK": "/booking", en: "/en/booking" },
  },
};

export default function EnBookingPage() {
  return (
    <>
      <PageBanner
        src="/images/home-hero-stars.png"
        title="Services & pricing"
        subtitle={`${siteConfig.school} · Master Sunny`}
        overlay="subtle"
      />
      <div className="py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-4 mb-10">
          {pricingPlans.map((plan) => {
            const en = PLAN_EN[plan.id];
            const waHref = whatsappUrl(
              `Hi, I'd like to book: ${en?.title ?? plan.title}. What times are available?`,
            );

            return (
              <article
                key={plan.id}
                className={`card p-5 md:p-6 ${
                  "highlight" in plan && plan.highlight
                    ? "border-2 border-destiny-gold/50 bg-gradient-to-r from-destiny-gold/5 to-transparent"
                    : ""
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <h2 className="font-display text-xl font-bold text-destiny-purple">
                      {en?.title ?? plan.title}
                    </h2>
                    {en?.duration && (
                      <p className="text-xs text-destiny-muted mt-1">{en.duration}</p>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-destiny-gold shrink-0">{plan.price}</p>
                </div>
                <p className="text-sm text-destiny-purple/75 leading-relaxed mb-4">
                  {en?.description ?? plan.description}
                </p>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-destiny-gold hover:underline"
                >
                  Book via WhatsApp →
                </a>
              </article>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto card bg-destiny-cream/50 border-dashed border-destiny-gold/30 text-center py-5 mb-10">
          <p className="text-sm text-destiny-purple/80">
            <strong className="text-destiny-purple">Free online chart</strong> — unlimited, with true solar
            time
          </p>
          <Link href="/en/chart" className="text-sm text-destiny-gold hover:underline mt-2 inline-block">
            Try the chart tool →
          </Link>
        </div>

        <div className="max-w-3xl mx-auto card text-center">
          <h2 className="font-display text-lg font-bold mb-3">How to book</h2>
          <p className="text-sm text-destiny-purple/70 mb-2">
            WhatsApp{" "}
            <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="text-destiny-gold">
              {siteConfig.phone}
            </a>{" "}
            with birth date & time and the service you need.
          </p>
          <p className="text-sm text-destiny-purple/60 mb-6">
            📍 {siteConfig.address}
            <br />
            🕐 {siteConfig.hours}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={whatsappUrl("Hi, I'd like to book a reading with Master Sunny.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              WhatsApp Master Sunny
            </a>
            <Link href="/en/chart" className="btn-secondary">
              Free chart first
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
