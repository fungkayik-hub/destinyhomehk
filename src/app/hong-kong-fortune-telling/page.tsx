import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/SiteImage";
import LocalBusinessCard from "@/components/LocalBusinessCard";
import ReviewShowcase from "@/components/ReviewShowcase";
import GbpCta from "@/components/GbpCta";
import SeoToolsGrid from "@/components/SeoToolsGrid";
import FaqSection from "@/components/FaqSection";
import { faqJsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema-extra";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = buildPageMetadata({
  title: "香港算命師傅 — 紫微斗數全批",
  description:
    "香港 Destiny Home — 中洲派紫微斗數、結婚擇日、風水顧問。灣仔工作室，過千好評，免費線上排盤，WhatsApp 預約 Sunny 師傅。",
  path: "/hong-kong-fortune-telling",
  keywords: ["香港算命", "香港算命師傅", "香港紫微斗數", "香港風水師傅", "Master Sunny"],
});

const faq = [
  {
    question: "香港邊個紫微斗數師傅好？",
    answer:
      "Destiny Home Sunny 師傅主理中洲派紫微斗數，灣仔工作室，過千客人真實好評。可先免費網上排盤，再預約全批深入了解。",
  },
  {
    question: "可以網上算命嗎？",
    answer: "網站提供免費排盤、夾桃花、每日流日；正式全批、擇日建議面談或 WhatsApp 預約師傅親批。",
  },
  {
    question: "收費大概幾多？",
    answer: "全批 HK$2,000、擇日 HK$800、流年問事 HK$1,000。詳見收費頁。",
  },
];

export default function HongKongFortuneTellingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            faqJsonLd(faq),
            breadcrumbJsonLd([
              { name: "首頁", href: "/" },
              { name: "香港算命師傅", href: "/hong-kong-fortune-telling" },
            ]),
          ]),
        }}
      />
      <PageBanner
        src={siteImages.homeHero}
        title="香港算命師傅"
        subtitle={`${siteConfig.school} · Master Sunny`}
      />
      <div className="py-12 px-4 max-w-4xl mx-auto space-y-10">
        <section>
          <h2 className="section-title">香港紫微斗數 · 真人師傅親批</h2>
          <p className="text-destiny-purple/80 leading-relaxed">
            唔使月費 AI 訂閱 — Destiny Home 用免費工具幫你了解命格，再由 Sunny 師傅親自全批。
            服務香港本地客人，工作室喺灣仔，亦承接風水到府。
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/chart" className="btn-primary">
              免費排盤
            </Link>
            <Link href="/daily" className="btn-secondary">
              每日流日
            </Link>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              WhatsApp
            </a>
          </div>
        </section>

        <SeoToolsGrid />
        <ReviewShowcase />
        <LocalBusinessCard />
        <GbpCta source="hk-fortune-landing" />
        <FaqSection items={faq} />
      </div>
    </>
  );
}
