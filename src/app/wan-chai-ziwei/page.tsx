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
  title: "灣仔算命師傅 — 紫微斗數全批 HK$2,000",
  description:
    "灣仔算命｜駱克道382號馮命居 Sunny 師傅。中洲派紫微全批 HK$2,000、結婚擇日、風水。過千好評，可先免費排盤再預約親批。",
  path: "/wan-chai-ziwei",
  keywords: [
    "灣仔紫微斗數",
    "灣仔算命",
    "灣仔算命師傅",
    "駱克道算命",
    "香港紫微斗數",
    "中洲派",
  ],
});

const faq = [
  {
    question: "灣仔邊度可以睇紫微斗數？",
    answer: `Destiny Home 位於${siteConfig.address}，近灣仔 MTR，星期一至六 12:00–20:00 營業。可 WhatsApp 預約全批或擇日。`,
  },
  {
    question: "灣仔工作室有咩服務？",
    answer: "全批 HK$2,000、結婚擇日 HK$800、流年問事、風水陽宅、改名等。網站亦提供免費排盤、姻緣探測器、每日流日。",
  },
  {
    question: "第一次預約要準備咩？",
    answer: "出生年、月、日、時（愈準確愈好）、性別，同想問嘅問題。可先喺網站免費排盤作參考。",
  },
  {
    question: "如果我先用 AI 算命，再約師傅有冇意思？",
    answer:
      "有。免費工具可先幫你整理方向，面談時再由 Sunny 師傅按命盤定盤、核對時辰，深入講大限流年同決策重點，兩者可以互補。",
  },
  {
    question: "灣仔算命師傅通常點收費？",
    answer:
      "Destiny Home 現時全批 HK$2,000、擇日 HK$800、流年問事 HK$1,000；實際以收費頁最新資料為準，可 WhatsApp 查詢時段。",
  },
  {
    question: "點樣最快預約到時段？",
    answer:
      "WhatsApp 留低出生資料、想問範圍同可行時段，通常比純文字查詢更快配對到合適檔期。",
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
        title="灣仔算命 · 紫微斗數"
        subtitle={`全批 HK$2,000 · ${siteConfig.address}`}
      />
      <div className="py-12 px-4 max-w-4xl mx-auto space-y-10">
        <section>
          <h2 className="section-title">灣仔駱克道 · 真人算命工作室</h2>
          <p className="text-destiny-purple/80 leading-relaxed">
            搜「灣仔算命」「灣仔紫微斗數」— Sunny 師傅喺駱克道382號1807室親批全批、擇日、風水。
            過千真實好評；想先了解自己命盤，可免費網上排盤，再預約面談。
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/book" className="btn-primary">
              預約全批算命
            </Link>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              WhatsApp 預約
            </a>
            <Link href="/chart" className="btn-secondary">
              免費排盤
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
