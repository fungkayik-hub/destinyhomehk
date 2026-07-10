import Link from "next/link";
import { PageBanner } from "@/components/SiteImage";
import { buildPageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/schema-extra";
import {
  GEO_LOG_COLUMNS,
  GEO_MONTHLY_CHECKLIST,
  GSC_KEYWORD_GROUPS,
  GSC_LOG_COLUMNS,
} from "@/lib/geo-monitoring";
import { siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "SEO / GEO 每月監測清單",
  description:
    "每月固定流程：追蹤 ChatGPT、Perplexity、Google AI 引用，配合 Google Search Console 關鍵詞同 GA4 轉化，建立可執行 SEO／GEO 監測。",
  path: "/ai-monitoring",
  image: siteImages.homeHero,
  keywords: [
    "AI 監測清單",
    "ChatGPT 引用監測",
    "Perplexity 品牌監測",
    "Google Search Console 關鍵詞",
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

export default function AiMonitoringPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "首頁", href: "/" },
              { name: "SEO / GEO 每月監測清單", href: "/ai-monitoring" },
            ]),
          ),
        }}
      />
      <PageBanner
        src={siteImages.homeHero}
        title="SEO / GEO 每月監測清單"
        subtitle="AI 引用 + Search Console 關鍵詞 + GA4 轉化"
      />
      <div className="py-12 px-4 max-w-4xl mx-auto space-y-8">
        <section className="card bg-destiny-gold/10 border-destiny-gold/30">
          <h2 className="font-display text-lg font-bold text-destiny-purple mb-2">
            點用呢頁？
          </h2>
          <p className="text-sm text-destiny-purple/80 leading-relaxed">
            每月 1 號（或固定一日）跟下面 5 步做一次。建議用 Google Sheet 長期記錄 —
            3 個月後最容易見到趨勢。呢頁係你嘅內部 playbook，唔使俾客人睇都得，但對 SEO／GEO
            好有用。
          </p>
        </section>

        {GEO_MONTHLY_CHECKLIST.map((phase) => (
          <section key={phase.step} className="card">
            <h2 className="font-display text-lg font-bold text-destiny-purple mb-3">
              <span className="text-destiny-gold mr-2">Step {phase.step}</span>
              {phase.title}
            </h2>
            <ul className="space-y-2 text-sm text-destiny-purple/80 list-disc pl-5">
              {phase.tasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </section>
        ))}

        <section className="card">
          <h2 className="font-display text-lg font-bold text-destiny-purple mb-3">
            固定 10 條 AI 監測問題
          </h2>
          <p className="text-xs text-destiny-purple/55 mb-3">
            每條分別喺 ChatGPT（開搜尋）、Perplexity、Google AI Overview 問一次
          </p>
          <ul className="space-y-2 text-sm text-destiny-purple/80">
            {QUERIES.map((query, i) => (
              <li key={query} className="flex gap-3">
                <span className="text-destiny-gold font-medium tabular-nums shrink-0">
                  {String(i + 1).padStart(2, "0")}.
                </span>
                <span>{query}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2 className="font-display text-lg font-bold text-destiny-purple mb-3">
            AI 監測記錄模板（Google Sheet 欄位）
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-destiny-purple/15">
                  {GEO_LOG_COLUMNS.map((col) => (
                    <th
                      key={col}
                      className="py-2 pr-3 font-medium text-destiny-purple whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="text-destiny-purple/50 text-xs">
                  <td className="py-2 pr-3">2026-07-01</td>
                  <td className="py-2 pr-3">ChatGPT</td>
                  <td className="py-2 pr-3">灣仔算命師傅推薦</td>
                  <td className="py-2 pr-3">Y</td>
                  <td className="py-2 pr-3">Y</td>
                  <td className="py-2 pr-3">destinyhomehk.com/wan-chai-ziwei</td>
                  <td className="py-2 pr-3">—</td>
                  <td className="py-2 pr-3">—</td>
                  <td className="py-2 pr-3">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="card border-destiny-gold/25 bg-destiny-gold/5">
          <h2 className="font-display text-lg font-bold text-destiny-purple mb-2">
            Google Search Console 關鍵詞清單
          </h2>
          <p className="text-sm text-destiny-purple/75 mb-4 leading-relaxed">
            去{" "}
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="text-destiny-gold hover:underline"
            >
              Google Search Console
            </a>
            {" → Performance → Queries，用下面關鍵詞搜尋或篩選。每月記錄曝光、點擊、平均排名。"}
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-destiny-purple/15">
                  {GSC_LOG_COLUMNS.map((col) => (
                    <th
                      key={col}
                      className="py-2 pr-3 font-medium text-destiny-purple whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>
          <div className="space-y-5">
            {GSC_KEYWORD_GROUPS.map((group) => (
              <div key={group.id}>
                <h3 className="text-sm font-bold text-destiny-purple mb-1">{group.title}</h3>
                <p className="text-xs text-destiny-purple/55 mb-2">{group.note}</p>
                <div className="flex flex-wrap gap-2">
                  {group.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-xs px-2.5 py-1 rounded-full bg-white border border-destiny-purple/12 text-destiny-purple/80"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2 className="font-display text-lg font-bold text-destiny-purple mb-3">
            判斷標準（每月對照）
          </h2>
          <ul className="space-y-3 text-sm text-destiny-purple/80">
            <li>
              <strong className="text-destiny-purple">GEO 變好：</strong>
              10 條問題入面，至少 3 條有提到你品牌或引用你網站（上月係 0–1 條）
            </li>
            <li>
              <strong className="text-destiny-purple">SEO 變好：</strong>
              GSC 總曝光升、品牌詞排名 ≤10、服務詞（全批／擇日）有點擊
            </li>
            <li>
              <strong className="text-destiny-purple">轉化變好：</strong>
              GA4 <code className="text-xs bg-destiny-cream px-1 rounded">whatsapp_click</code> 同{" "}
              <code className="text-xs bg-destiny-cream px-1 rounded">booking_submit</code> 按月上升
            </li>
            <li>
              <strong className="text-destiny-purple">內容變好：</strong>
              <code className="text-xs bg-destiny-cream px-1 rounded">/academy/*</code> 頁面瀏覽量升，學堂長尾詞開始有曝光
            </li>
          </ul>
        </section>

        <section className="card">
          <h2 className="font-display text-lg font-bold text-destiny-purple mb-3">相關頁面</h2>
          <div className="flex flex-wrap gap-3 text-sm">
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
            <span className="text-destiny-purple/30">·</span>
            <Link href="/chart" className="text-destiny-gold hover:underline">
              免費排盤
            </Link>
            <span className="text-destiny-purple/30">·</span>
            <Link href="/academy" className="text-destiny-gold hover:underline">
              學堂
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
