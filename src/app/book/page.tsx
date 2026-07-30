import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/SiteImage";
import BookingForm from "@/components/booking/BookingForm";
import { siteConfig } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "網上預約全批算命 — 紫微斗數 HK$2,000",
  description:
    "網上預約香港算命／紫微全批 — 揀日期時間，留姓名電話即可。Sunny 師傅灣仔親批 HK$2,000，星期一至六 12:00–20:00。",
  path: "/book",
  keywords: ["紫微斗數預約", "香港算命預約", "預約全批", "Destiny Home 預約"],
});

export default function BookPage() {
  return (
    <>
      <PageBanner
        src="/images/home-hero-stars.png"
        title="網上預約全批算命"
        subtitle={`紫微全批 HK$2,000 · ${siteConfig.school} · 灣仔`}
        overlay="subtle"
      />
      <div className="py-12 px-4">
        <div className="max-w-lg mx-auto mb-6 rounded-xl border border-destiny-gold/35 bg-destiny-gold/8 px-4 py-4 text-center">
          <p className="font-display text-base font-bold text-destiny-purple mb-1">
            真人算命 · 師傅親批
          </p>
          <p className="text-xs text-destiny-purple/65 leading-relaxed">
            預設服務係紫微斗數全批（HK$2,000，60–90 分鐘）。選日期時間後提交，Sunny 會 WhatsApp 同你確認出生資料同想問嘅問題。
          </p>
        </div>
        <p className="max-w-lg mx-auto text-sm text-destiny-purple/70 text-center mb-8 leading-relaxed">
          未決定？可先{" "}
          <Link href="/chart" className="text-destiny-gold hover:underline">
            免費排盤
          </Link>
          {" "}睇命盤，再返嚟預約。
        </p>
        <BookingForm />
        <p className="max-w-lg mx-auto mt-8 text-center text-xs text-destiny-purple/45 leading-relaxed">
          想買網上小師傅命書（非師傅面批）？請先去{" "}
          <Link href="/chart" className="text-destiny-gold/80 hover:underline">
            排盤頁
          </Link>
          {" "}逐宮解鎖。
        </p>
      </div>
    </>
  );
}
