import Link from "next/link";
import { PageBanner } from "@/components/SiteImage";
import { buildPageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/schema-extra";
import { siteConfig } from "@/lib/site-config";
import {
  complianceCopyZh,
  privacyContactWhatsAppHref,
} from "@/lib/compliance-copy";
import { formatPriceHkd } from "@/lib/stripe/plans";
import { PALACE_REPORT_PRODUCTS } from "@/lib/palace-report/config";

export const metadata = buildPageMetadata({
  title: "私隱與退款說明",
  description:
    "馮命居網上小師傅命書：個人資料使用、保存期限、刪除要求及數碼內容退款政策。",
  path: "/privacy",
});

export default function PrivacyPage() {
  const waHref = privacyContactWhatsAppHref();

  return (
    <main>
      <PageBanner
        src="/images/home-hero-stars.png"
        title="私隱與退款說明"
        subtitle={`${siteConfig.name} · 網上小師傅命書`}
        overlay="subtle"
      />
      <div className="max-w-2xl mx-auto px-4 py-10 text-destiny-purple">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              breadcrumbJsonLd([
                { name: "首頁", href: "/" },
                { name: "私隱與退款說明", href: "/privacy" },
              ]),
            ),
          }}
        />

        <section className="mb-8">
          <h2 className="font-display text-xl font-bold text-destiny-red">AI 內容聲明</h2>
          <p className="text-sm leading-relaxed mt-2">{complianceCopyZh.aiDisclaimerShort}</p>
          <p className="text-sm leading-relaxed mt-2 text-destiny-purple/70">
            免費「小徒弟贈言」同付費「網上小師傅命書」皆為 AI 協助整理，並非 Sunny 師傅親批面談內容。
          </p>
        </section>

        <section className="mb-8" id="refund">
          <h2 className="font-display text-xl font-bold text-destiny-red">退款政策</h2>
          <p className="text-sm leading-relaxed mt-2">{complianceCopyZh.refundNearCheckout}</p>
          <p className="text-sm leading-relaxed mt-2 text-destiny-purple/70">
            現時網上命書方案：流年詳批 {formatPriceHkd(PALACE_REPORT_PRODUCTS.standard.priceCents)}、
            全批 {formatPriceHkd(PALACE_REPORT_PRODUCTS.full.priceCents)}。師傅親批預約服務之取消及改期，
            請參閱<Link href="/booking" className="text-destiny-gold hover:underline">收費及預約</Link>頁面說明。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-display text-xl font-bold text-destiny-red">個人資料</h2>
          <p className="text-sm leading-relaxed mt-2">{complianceCopyZh.privacyShort}</p>
          <ul className="text-sm mt-3 space-y-2 list-disc pl-5 text-destiny-purple/80">
            <li>出生日期、時間、性別、地點等：用於紫微起盤及生成命書。</li>
            <li>電郵（如 Stripe 或表單提供）：用於付款確認、查單及必要聯絡。</li>
            <li>付款紀錄由 Stripe 處理；我哋唔會儲存完整信用卡資料。</li>
          </ul>
          <p className="text-sm leading-relaxed mt-3">{complianceCopyZh.privacyDeletion}</p>
          <p className="text-sm mt-4">
            <a href={waHref} className="text-destiny-gold hover:underline" target="_blank" rel="noopener noreferrer">
              WhatsApp 聯絡
            </a>
            {" · "}
            <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="text-destiny-gold hover:underline">
              {siteConfig.phone}
            </a>
            {" · "}
            {siteConfig.address}
          </p>
        </section>

        <p className="text-xs text-destiny-purple/50">
          最後更新：2026 年 · 如有疑問歡迎 WhatsApp 查詢。
        </p>
      </div>
    </main>
  );
}
