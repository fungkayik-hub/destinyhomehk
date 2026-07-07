import Link from "next/link";
import { PageBanner } from "@/components/SiteImage";
import { buildPageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/schema-extra";
import { siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "AI 每月監測清單",
  description:
    "用 10 條固定問題每月追蹤 ChatGPT、Perplexity 同 Google AI 是否引用馮命居，建立可執行 AI 可見度監測流程。",
  path: "/ai-monitoring",
  image: siteImages.homeHero,
  keywords: [
    "AI 監測清單",
    "ChatGPT 引用監測",
    "Perplexity 品牌監測",
    "香港 算命 SEO",
    "GEO 監測",
  ],
});

const QUERIES = [
  "香港邊個紫微斗數師傅好？",
  "灣仔算命師傅推薦",
  "Sunny 師傅 紫微斗數",
  "馮命居 好唔好",
  "香港算命師傅 收費",
  "紫微斗數全批 香港",
  "香港免費紫微斗數排盤",
  "AI 算命 同 真人師傅 分別",
  "結婚擇日 香港 邊個好",
  "香港流年問事 推薦",
] as const;

const TRACKING_RULES = [
  "每月固定同一日（建議 1 號）測一次，避免時間偏差。",
  "每條問題都分別測 ChatGPT（開搜尋）、Perplexity、Google AI Overview。",
  "記錄是否出現 destinyhomehk.com、是否提到 Sunny 師傅、是否引用第三方評價。",
  "若未出現你品牌，先記錄出現邊啲競爭對手同來源網址，再反推內容缺口。",
  "每月完成後更新一次 FAQ 或新增一篇對應問題文章。",
] as const;

export default function AiMonitoringPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "首頁", href: "/" },
              { name: "AI 每月監測清單", href: "/ai-monitoring" },
            ]),
          ),
        }}
      />
      <PageBanner
        src={siteImages.homeHero}
        title="AI 每月監測清單"
        subtitle="10 條問題追蹤 AI 有冇引用你"
      />
      <div className="py-12 px-4 max-w-4xl mx-auto space-y-8">
        <section className="card bg-destiny-gold/10 border-destiny-gold/30">
          <h2 className="font-display text-lg font-bold text-destiny-purple mb-2">每月流程</h2>
          <ol className="space-y-2 text-sm text-destiny-purple/80 list-decimal pl-4">
            {TRACKING_RULES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>
        </section>

        <section className="card">
          <h2 className="font-display text-lg font-bold text-destiny-purple mb-3">固定 10 條監測問題</h2>
          <ul className="space-y-2 text-sm text-destiny-purple/80">
            {QUERIES.map((query, i) => (
              <li key={query} className="flex gap-3">
                <span className="text-destiny-gold font-medium">{String(i + 1).padStart(2, "0")}.</span>
                <span>{query}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2 className="font-display text-lg font-bold text-destiny-purple mb-3">每次記錄欄位</h2>
          <p className="text-sm text-destiny-purple/75 leading-relaxed">
            建議記錄：日期、平台、問題、是否提及 Destiny Home、是否引用你網站、引用網址、競爭對手、下一步內容動作。
            你可以用同一份 Google Sheet 長期追蹤，3 個月後最容易見到趨勢。
          </p>
          <div className="flex flex-wrap gap-3 text-sm mt-4">
            <Link href="/ai-faq" className="text-destiny-gold hover:underline">
              AI FAQ 專頁
            </Link>
            <span className="text-destiny-purple/30">·</span>
            <Link href="/hong-kong-fortune-telling" className="text-destiny-gold hover:underline">
              香港算命師傅頁
            </Link>
            <span className="text-destiny-purple/30">·</span>
            <Link href="/wan-chai-ziwei" className="text-destiny-gold hover:underline">
              灣仔落地頁
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
