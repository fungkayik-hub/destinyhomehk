import Link from "next/link";
import { PageBanner } from "@/components/SiteImage";
import SeoTrackerCsvDownload from "@/components/seo/SeoTrackerCsvDownload";
import { buildPageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/schema-extra";
import {
  ADS_CAMPAIGN_LABELS,
  CHANNEL_BADGE_CLASS,
  CHANNEL_LABELS,
  GSC_DECISION_RULES,
  GSC_SETUP_STEPS,
  KEYWORD_STRATEGIES,
  MONTHLY_TRACKER_CSV_HEADER,
  groupStrategiesByChannel,
} from "@/lib/seo-keyword-strategy";
import { siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "SEO 關鍵詞追蹤 — GSC × Google Ads 決策表",
  description:
    "馮命居關鍵詞策略：邊個詞靠廣告、邊個靠自然搜尋、落地頁對照、每月 GSC 追蹤表下載。配合 Google Search Console 同 Ads 帳戶 651-333-4793 使用。",
  path: "/seo-tracker",
  image: siteImages.homeHero,
  keywords: [
    "Google Search Console 關鍵詞",
    "Google Ads 關鍵詞策略",
    "紫微斗數 SEO",
    "香港算命 廣告",
  ],
  noIndex: true,
});

const GSC_MONTHLY_STEPS = [
  "GSC → 成效 → 日期「過去 28 天」→ 同「上一期」比較，記總曝光／點擊",
  "查詢分頁 → 篩選下方表格關鍵詞 → 填 CSV 追蹤表",
  "Google Ads → 搜尋字詞報告 → 對照「廣告有買」欄，記點擊同轉換",
  "GA4 → 流量來源：分 google/cpc 同 google/organic，睇 whatsapp_click",
  "用下方「決策規則」決定：加預算、減出價、改 title、寫學堂文",
] as const;

export default function SeoTrackerPage() {
  const byChannel = groupStrategiesByChannel();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "首頁", href: "/" },
              { name: "SEO 關鍵詞追蹤", href: "/seo-tracker" },
            ]),
          ),
        }}
      />
      <PageBanner
        src={siteImages.homeHero}
        title="SEO × 廣告 關鍵詞追蹤"
        subtitle="GSC 曝光排名 + Ads 轉化 — 每月對一次"
      />
      <div className="py-12 px-4 max-w-5xl mx-auto space-y-8">
        <section className="card bg-destiny-gold/10 border-destiny-gold/30">
          <h2 className="font-display text-lg font-bold text-destiny-purple mb-2">
            內部用 — 每月 1 次（約 30 分鐘）
          </h2>
          <p className="text-sm text-destiny-purple/80 leading-relaxed mb-4">
            你落緊廣告（帳戶 <strong>651-333-4793</strong>）+ GA4{" "}
            <strong>G-9785R0BX68</strong>。呢頁幫你分清楚：邊個詞靠廣告搶、邊個詞靠 SEO
            慢慢疊、自然排名前幾可以先減廣告出價。
          </p>
          <div className="flex flex-wrap gap-3">
            <SeoTrackerCsvDownload />
            <Link href="/ai-monitoring" className="btn-secondary text-sm">
              AI / GEO 監測清單 →
            </Link>
          </div>
        </section>

        <section className="card">
          <h2 className="font-display text-lg font-bold text-destiny-purple mb-3">
            一次性設定（GSC + Ads + GA4）
          </h2>
          <ol className="space-y-3">
            {GSC_SETUP_STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-3 text-sm">
                <span className="text-destiny-gold font-bold shrink-0">{i + 1}.</span>
                <div>
                  <p className="font-medium text-destiny-purple">{step.title}</p>
                  <p className="text-destiny-purple/70 mt-0.5">{step.detail}</p>
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-destiny-gold text-xs hover:underline mt-1 inline-block"
                    >
                      開啟 →
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="card">
          <h2 className="font-display text-lg font-bold text-destiny-purple mb-3">
            每月 GSC 流程
          </h2>
          <ol className="space-y-2 text-sm text-destiny-purple/80 list-decimal pl-5">
            {GSC_MONTHLY_STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="card">
          <h2 className="font-display text-lg font-bold text-destiny-purple mb-2">
            策略分佈
          </h2>
          <div className="flex flex-wrap gap-4 text-sm mb-4">
            <span>
              <strong className="text-destiny-purple">{byChannel.both.length}</strong> 個
              廣告+SEO
            </span>
            <span>
              <strong className="text-destiny-purple">{byChannel.ads.length}</strong> 個
              廣告優先
            </span>
            <span>
              <strong className="text-destiny-purple">{byChannel.seo.length}</strong> 個
              SEO 優先
            </span>
          </div>
          <p className="text-xs text-destiny-purple/55 mb-4">
            CSV 欄位：{MONTHLY_TRACKER_CSV_HEADER.join(" · ")}
          </p>
        </section>

        <section className="card overflow-hidden p-0">
          <div className="px-5 py-4 border-b border-destiny-purple/10 bg-destiny-cream/40">
            <h2 className="font-display text-lg font-bold text-destiny-purple">
              關鍵詞決策表（{KEYWORD_STRATEGIES.length} 個）
            </h2>
            <p className="text-xs text-destiny-purple/55 mt-1">
              喺 GSC「查詢」搜尋關鍵詞，填落 CSV；對照策略決定本月動作
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-destiny-purple/10 bg-white">
                  <th className="px-4 py-3 font-medium text-destiny-purple whitespace-nowrap">
                    關鍵詞
                  </th>
                  <th className="px-4 py-3 font-medium text-destiny-purple">策略</th>
                  <th className="px-4 py-3 font-medium text-destiny-purple whitespace-nowrap">
                    落地頁
                  </th>
                  <th className="px-4 py-3 font-medium text-destiny-purple whitespace-nowrap">
                    Ads
                  </th>
                  <th className="px-4 py-3 font-medium text-destiny-purple whitespace-nowrap">
                    SEO 接棒排名
                  </th>
                  <th className="px-4 py-3 font-medium text-destiny-purple min-w-[12rem]">
                    備註
                  </th>
                </tr>
              </thead>
              <tbody>
                {KEYWORD_STRATEGIES.map((k) => (
                  <tr
                    key={k.keyword}
                    className="border-b border-destiny-purple/5 hover:bg-destiny-gold/5"
                  >
                    <td className="px-4 py-2.5 font-medium text-destiny-purple whitespace-nowrap">
                      {k.keyword}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${CHANNEL_BADGE_CLASS[k.channel]}`}
                      >
                        {CHANNEL_LABELS[k.channel]}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <Link
                        href={k.landingPage}
                        className="text-destiny-gold hover:underline text-xs"
                      >
                        {k.landingPage}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-destiny-purple/70 whitespace-nowrap">
                      {k.adsCampaign ? ADS_CAMPAIGN_LABELS[k.adsCampaign] : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-xs tabular-nums text-destiny-purple/60 text-center">
                      {k.seoTakeoverRank ? `≤${k.seoTakeoverRank}` : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-destiny-purple/65 leading-relaxed">
                      {k.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card border-destiny-gold/25">
          <h2 className="font-display text-lg font-bold text-destiny-purple mb-3">
            見到 GSC 數據後 — 決策規則
          </h2>
          <ul className="space-y-3">
            {GSC_DECISION_RULES.map((rule) => (
              <li
                key={rule.condition}
                className="text-sm border-l-2 border-destiny-gold pl-3"
              >
                <p className="font-medium text-destiny-purple">{rule.condition}</p>
                <p className="text-destiny-purple/70 mt-0.5">→ {rule.action}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2 className="font-display text-lg font-bold text-destiny-purple mb-3">
            快速連結
          </h2>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            {[
              { href: "https://search.google.com/search-console", label: "Google Search Console" },
              { href: "https://ads.google.com/", label: "Google Ads" },
              { href: "https://analytics.google.com/", label: "GA4 分析" },
              { href: "/booking", label: "落地頁 /booking" },
              { href: "/wan-chai-ziwei", label: "落地頁 灣仔" },
              { href: "/chart", label: "落地頁 排盤" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-destiny-gold hover:underline px-3 py-2 rounded-lg bg-destiny-cream/50"
              >
                {item.label} →
              </a>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
