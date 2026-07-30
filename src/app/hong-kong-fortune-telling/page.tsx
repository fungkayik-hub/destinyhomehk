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
  title: "香港算命師傅推薦 — 紫微全批 HK$2,000",
  description:
    "搵香港算命師傅？馮命居 Sunny 專攻中洲派紫微斗數全批 HK$2,000，過千好評，灣仔工作室。可先免費排盤，再 WhatsApp 預約真人親批。",
  path: "/hong-kong-fortune-telling",
  keywords: [
    "香港算命",
    "香港算命師傅",
    "香港算命師傅推薦",
    "紫微斗數全批",
    "香港紫微斗數",
    "真人算命",
  ],
});

const faq = [
  {
    question: "香港邊個紫微斗數師傅好？",
    answer:
      "Destiny Home Sunny 師傅主理中洲派紫微斗數，灣仔工作室，過千客人真實好評。可先免費網上排盤，再預約全批深入了解。",
  },
  {
    question: "可以網上算命嗎？",
    answer: "網站提供免費排盤、姻緣探測器、每日流日；正式全批、擇日建議面談或 WhatsApp 預約師傅親批。",
  },
  {
    question: "收費大概幾多？",
    answer: "全批 HK$2,000、擇日 HK$800、流年問事 HK$1,000。詳見收費頁。",
  },
  {
    question: "AI 算命同真人師傅有咩分別？",
    answer:
      "網站免費工具同 AI 解讀適合入門參考；真人全批會由 Sunny 師傅定盤，按你時辰、大限流年同具體問題深入講解，準確度同可執行性更高。",
  },
  {
    question: "香港邊區可以面談？",
    answer:
      "工作室位於灣仔駱克道382號1807室，星期一至六 12:00–20:00。外區客人可先 WhatsApp 預約，確認合適時段再上門。",
  },
  {
    question: "第一次搵算命師傅要準備咩？",
    answer:
      "建議先準備出生年、月、日、時（陽曆或農曆都可）、性別，同你最想問嘅 1–3 個議題，師傅可更快聚焦解讀重點。",
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
        title="香港算命師傅推薦"
        subtitle="紫微全批 HK$2,000 · 過千好評 · 灣仔 Sunny 師傅"
      />
      <div className="py-12 px-4 max-w-4xl mx-auto space-y-10">
        <section>
          <h2 className="section-title">想搵人算命？真人全批，唔係月費 AI</h2>
          <p className="text-destiny-purple/80 leading-relaxed">
            好多香港人上網搵「算命師傅」，最怕只得 AI 訂閱同模板答案。
            Destiny Home 用免費紫微排盤幫你先了解命格，再由 Sunny 師傅親自全批 —
            事業、感情、大限十年同流年，一次講清楚。工作室喺灣仔，亦可 WhatsApp 預約。
          </p>
          <div className="mt-4 rounded-xl border border-destiny-gold/25 bg-destiny-gold/5 px-4 py-3 text-sm text-destiny-purple/80">
            <strong className="text-destiny-purple">全批 HK$2,000</strong>
            {" · "}60–90 分鐘親批
            {" · "}⭐ {siteConfig.rating.score} 過千真實好評
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/book" className="btn-primary">
              網上預約全批
            </Link>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              WhatsApp 預約算命
            </a>
            <Link href="/chart" className="btn-secondary">
              先免費排盤
            </Link>
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
