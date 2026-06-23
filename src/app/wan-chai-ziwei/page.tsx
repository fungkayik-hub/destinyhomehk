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
import { FAQ_BY_PAGE } from "@/lib/faq-content";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = buildPageMetadata({
  title: "灣仔紫微斗數 — Sunny 師傅工作室",
  description:
    "灣仔駱克道382號 Destiny Home — 中洲派紫微斗數全批、結婚擇日、風水。過千好評，免費即時排盤，WhatsApp 預約。",
  path: "/wan-chai-ziwei",
  keywords: ["灣仔紫微斗數", "灣仔算命", "駱克道", "香港紫微斗數", "中洲派"],
});

const faq = [
  {
    question: "灣仔邊度可以睇紫微斗數？",
    answer: `Destiny Home 位於${siteConfig.address}，近灣仔 MTR，星期一至六 12:00–20:00 營業。可 WhatsApp 預約全批或擇日。`,
  },
  {
    question: "灣仔工作室有咩服務？",
    answer: "全批 HK$2,000、結婚擇日 HK$800、流年問事、風水陽宅、改名等。網站亦提供免費排盤、夾桃花、每日流日。",
  },
  {
    question: "第一次預約要準備咩？",
    answer: "出生年、月、日、時（愈準確愈好）、性別，同想問嘅問題。可先喺網站免費排盤作參考。",
  },
];

export default function WanChaiZiWeiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            faqJsonLd(faq),
            breadcrumbJsonLd([
              { name: "首頁", href: "/" },
              { name: "灣仔紫微斗數", href: "/wan-chai-ziwei" },
            ]),
          ]),
        }}
      />
      <PageBanner
        src={siteImages.sunnyStudio}
        title="灣仔紫微斗數"
        subtitle={`${siteConfig.school} · ${siteConfig.address}`}
      />
      <div className="py-12 px-4 max-w-4xl mx-auto space-y-10">
        <section>
          <h2 className="section-title">灣仔駱克道 · Destiny Home</h2>
          <p className="text-destiny-purple/80 leading-relaxed">
            搜尋「灣仔紫微斗數」「灣仔算命師傅」— Sunny 師傅喺駱克道382號1807室為你全批、擇日、風水。
            過千真實好評，結合傳統中洲派同現代免費排盤工具。
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/chart" className="btn-primary">
              免費即時排盤
            </Link>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              WhatsApp 預約
            </a>
            <Link href="/booking" className="btn-secondary">
              收費詳情
            </Link>
          </div>
        </section>

        <SeoToolsGrid />
        <ReviewShowcase />
        <LocalBusinessCard />
        <GbpCta source="wan-chai-landing" />
        <FaqSection items={faq} />
      </div>
    </>
  );
}
