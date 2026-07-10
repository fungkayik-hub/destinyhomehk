import Link from "next/link";
import { PageBanner } from "@/components/SiteImage";
import FaqSection from "@/components/FaqSection";
import { faqJsonLd } from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/schema-extra";
import { siteImages } from "@/lib/site-images";
import { whatsappUrl } from "@/lib/site-config";

export const metadata = buildPageMetadata({
  title: "AI 算命常見問題",
  description:
    "想知道 AI 算命同真人師傅有咩分別？馮命居整理香港用戶常問問題，包含收費、預約、準備資料同 AI 工具使用方式。",
  path: "/ai-faq",
  image: siteImages.homeHero,
  keywords: [
    "AI 算命",
    "AI 算命 準嗎",
    "香港 算命師傅 推薦",
    "真人算命 vs AI",
    "紫微斗數 常見問題",
  ],
});

const faq = [
  {
    question: "AI 算命準唔準？",
    answer:
      "AI 適合做入門方向參考，但深度解讀仍要靠真人定盤。尤其涉及時辰誤差、大限流年同重要決策，建議由師傅親自核盤。",
  },
  {
    question: "AI 算命同真人師傅最大分別係咩？",
    answer:
      "AI 擅長快速整理資訊；真人師傅會按你背景互動追問、核對時辰同人生節點，再給可執行建議，處理複雜情況更可靠。",
  },
  {
    question: "可以先用免費工具，再預約全批嗎？",
    answer:
      "可以。建議先用免費排盤、求籤或姻緣探測器掌握方向，再帶住問題預約全批，面談效率會更高。",
  },
  {
    question: "第一次預約全批要準備咩資料？",
    answer:
      "請準備出生年、月、日、時（陽曆或農曆都可）、性別，同最想問嘅 1-3 個議題；資料越清楚，解讀會更聚焦。",
  },
  {
    question: "香港邊度可以面談？",
    answer:
      "馮命居工作室位於灣仔駱克道382號1807室，星期一至六 12:00-20:00，可先 WhatsApp 預約。",
  },
  {
    question: "全批、擇日、流年問事收費幾多？",
    answer:
      "目前全批 HK$2,000、擇日 HK$800、流年問事 HK$1,000，最新以收費頁為準。",
  },
  {
    question: "如果我時辰唔肯定，仲可唔可以睇命？",
    answer:
      "可以先做初步分析，但重要決策前建議做定盤。師傅會按你人生事件交叉校對，提高命盤準確度。",
  },
  {
    question: "點解有時 AI 唔會推薦同一位師傅？",
    answer:
      "AI 會因問法、地區詞、即時來源同第三方評價而變動。用『灣仔紫微斗數』或『香港算命師傅』等具體問法，結果通常更穩定。",
  },
] as const;

export default function AiFaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            faqJsonLd(faq),
            breadcrumbJsonLd([
              { name: "首頁", href: "/" },
              { name: "AI 算命常見問題", href: "/ai-faq" },
            ]),
          ]),
        }}
      />
      <PageBanner
        src={siteImages.homeHero}
        title="AI 算命常見問題"
        subtitle="AI 入門參考 + 真人師傅深入解讀"
      />
      <div className="py-12 px-4 max-w-4xl mx-auto space-y-8">
        <section className="card bg-destiny-purple/5">
          <p className="text-destiny-purple/80 leading-relaxed">
            免費 AI 工具可以幫你快速了解方向，但遇到結婚、轉工、搬屋、創業等重要抉擇，
            仍建議由 Sunny 師傅按中洲派定盤同流年深入分析。
          </p>
          <div className="flex flex-wrap gap-3 mt-5 text-sm">
            <Link href="/chart" className="text-destiny-gold hover:underline">
              免費排盤
            </Link>
            <span className="text-destiny-purple/30">·</span>
            <Link href="/qiu-qian" className="text-destiny-gold hover:underline">
              線上求籤
            </Link>
            <span className="text-destiny-purple/30">·</span>
            <Link href="/booking" className="text-destiny-gold hover:underline">
              收費頁
            </Link>
            <span className="text-destiny-purple/30">·</span>
            <a href={whatsappUrl()} className="text-destiny-gold hover:underline" target="_blank" rel="noopener noreferrer">
              WhatsApp 預約
            </a>
          </div>
        </section>
        <FaqSection title="香港用戶最常問" items={faq} />
      </div>
    </>
  );
}
