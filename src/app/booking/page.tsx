import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/SiteImage";
import {
  pricingPlans,
  siteConfig,
  whatsappDatePickerUrl,
  whatsappUrl,
} from "@/lib/site-config";
import FaqSection from "@/components/FaqSection";
import GbpCta from "@/components/GbpCta";
import GoogleMapsEmbed from "@/components/GoogleMapsEmbed";
import ReviewShowcase from "@/components/ReviewShowcase";
import { faqJsonLd } from "@/components/JsonLd";
import { servicesJsonLd } from "@/lib/schema-extra";
import { FAQ_BY_PAGE } from "@/lib/faq-content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "收費詳情及預約師傅",
  description:
    "Destiny Home 全批 HK$2,000、擇日 HK$800、流年問事 HK$1,000、風水陽宅 HK$11/尺、生孩改名 HK$3,800 — 灣仔 Sunny 師傅親批，WhatsApp 預約。",
  path: "/booking",
  keywords: ["紫微斗數收費", "香港算命預約", "結婚擇日價錢"],
});

interface Props {
  searchParams: Promise<{ service?: string }>;
}

export default async function BookingPage({ searchParams }: Props) {
  const { service } = await searchParams;
  const isDateService = service === "date";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([faqJsonLd(FAQ_BY_PAGE.booking), servicesJsonLd()]),
        }}
      />
      <PageBanner
        src="/images/home-hero-stars.png"
        title={isDateService ? "結婚／入伙擇日預約" : "服務及收費"}
        subtitle={`命居 · ${siteConfig.school} · Sunny 師傅親批`}
        overlay="subtle"
      />
      <div className="py-12 px-4">
        {isDateService && (
          <div className="max-w-3xl mx-auto mb-8 card bg-destiny-gold/10 border-destiny-gold/30">
            <p className="text-sm text-destiny-purple/80 leading-relaxed">
              結婚、入伙等重要日子請 WhatsApp 預約，Sunny 師傅會按雙方生辰親自擇日及吉時（HK$800）。
            </p>
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-4 mb-10">
          {pricingPlans.map((plan) => {
            const waHref = whatsappUrl(plan.whatsappMessage);
            const isFeatured = plan.id === "date-picker" && isDateService;

            return (
              <article
                key={plan.id}
                id={plan.id}
                className={`card p-5 md:p-6 ${
                  ("highlight" in plan && plan.highlight) || isFeatured
                    ? "border-2 border-destiny-gold/50 bg-gradient-to-r from-destiny-gold/5 to-transparent"
                    : ""
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <h2 className="font-display text-xl font-bold text-destiny-purple">
                      {plan.title}
                    </h2>
                    {"duration" in plan && plan.duration && (
                      <p className="text-xs text-destiny-muted mt-1">{plan.duration}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-destiny-gold">{plan.price}</p>
                    {"priceNote" in plan && plan.priceNote && (
                      <p className="text-xs text-destiny-purple/50">{plan.priceNote}</p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-destiny-purple/75 leading-relaxed mb-4">
                  {plan.description}
                </p>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-destiny-gold hover:underline"
                >
                  WhatsApp 預約此項 →
                </a>
              </article>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto mb-10 rounded-2xl bg-gradient-to-r from-destiny-purple to-destiny-purple-light text-white px-6 py-5 text-center">
          <p className="font-display text-xl font-bold text-destiny-gold mb-1">
            {siteConfig.pricingPromo.title}
          </p>
          <p className="text-sm text-white/80">{siteConfig.pricingPromo.detail}</p>
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm text-white/90 hover:text-destiny-gold underline"
          >
            @{siteConfig.instagram.split("/").pop()}
          </a>
        </div>

        <div className="max-w-3xl mx-auto card bg-destiny-cream/50 border-dashed border-destiny-gold/30 text-center py-5 mb-10">
          <p className="text-sm text-destiny-purple/80">
            <strong className="text-destiny-purple">紫微即時排盤</strong> — 免費試用，了解基本命格
          </p>
          <Link href="/chart" className="text-sm text-destiny-gold hover:underline mt-2 inline-block">
            立即排盤 →
          </Link>
        </div>

        <div className="max-w-3xl mx-auto card text-center">
          <h2 className="font-display text-lg font-bold mb-3">預約方式</h2>
          <p className="text-sm text-destiny-purple/70 mb-2">
            WhatsApp{" "}
            <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="text-destiny-gold">
              {siteConfig.phone}
            </a>
            {" "}私信預約，提供出生資料（年月日時）及想諮詢的項目。
          </p>
          <p className="text-sm text-destiny-purple/60 mb-6">
            📍 {siteConfig.address}
            <br />
            🕐 {siteConfig.hours}
          </p>
          <p className="text-xs text-destiny-purple/50 mb-6">
            命理、風水擇日、改運服務屬個人化諮詢，一經提供即屬完成服務。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={isDateService ? whatsappDatePickerUrl() : whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              WhatsApp 預約
            </a>
            <Link href="/chart" className="btn-secondary">
              先試即時排盤
            </Link>
          </div>
          <div className="mt-6">
            <GbpCta source="booking" />
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-10 space-y-8">
          <GoogleMapsEmbed />
          <ReviewShowcase />
        </div>
      </div>
      <div className="px-4 pb-12">
        <FaqSection items={FAQ_BY_PAGE.booking} />
      </div>
    </>
  );
}
