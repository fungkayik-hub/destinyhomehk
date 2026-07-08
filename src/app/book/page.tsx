import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/SiteImage";
import BookingForm from "@/components/booking/BookingForm";
import { siteConfig } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "網上預約",
  description:
    "Destiny Home 網上預約 — 選擇服務、日期及時間，留姓名電話即可。Sunny 師傅灣仔工作室，星期一至六 12:00–20:00。",
  path: "/book",
  keywords: ["紫微斗數預約", "香港算命預約", "Destiny Home 預約"],
});

export default function BookPage() {
  return (
    <>
      <PageBanner
        src="/images/home-hero-stars.png"
        title="網上預約"
        subtitle={`填好以下資料即可 · ${siteConfig.school}`}
        overlay="subtle"
      />
      <div className="py-12 px-4">
        <div className="max-w-lg mx-auto mb-6 rounded-xl border border-destiny-gold/35 bg-destiny-gold/8 px-4 py-4 text-center">
          <p className="text-sm text-destiny-purple font-medium mb-2">
            想買網上小師傅命書？
          </p>
          <p className="text-xs text-destiny-purple/65 mb-3 leading-relaxed">
            師傅面批（全批 $2,000 等）請喺下面預約 + WhatsApp 確認。網上信用卡付款只喺排盤頁，逐宮解鎖詳細命書。
          </p>
          <Link href="/chart" className="btn-primary inline-flex text-sm">
            去排盤 · 解鎖網上小師傅命書
          </Link>
        </div>
        <p className="max-w-lg mx-auto text-sm text-destiny-purple/70 text-center mb-8 leading-relaxed">
          選服務、日期、時間，留姓名電話即可。提交後 Sunny 師傅會 WhatsApp 同你確認。
        </p>
        <BookingForm />
      </div>
    </>
  );
}
