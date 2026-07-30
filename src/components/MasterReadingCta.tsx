import Link from "next/link";
import { pricingPlans } from "@/lib/site-config";
import TrackedWhatsAppLink from "@/components/TrackedWhatsAppLink";

interface Props {
  whatsappHref: string;
  locale?: "zh" | "en";
  variant?: "chart" | "compatibility" | "fortune-stick";
  /** compact = 排盤結果中段短橫幅；full = 頁底完整 CTA */
  size?: "full" | "compact";
}

export default function MasterReadingCta({
  whatsappHref,
  locale = "zh",
  variant = "chart",
  size = "full",
}: Props) {
  const fullReading = pricingPlans.find((p) => p.id === "full-reading");
  const price = fullReading?.price ?? "HK$2,000";

  if (locale === "en") {
    return (
      <div className="rounded-xl border border-destiny-gold/30 bg-gradient-to-b from-destiny-gold/10 to-white px-5 sm:px-6 py-8 text-center">
        <p className="text-xs uppercase tracking-wide text-destiny-gold mb-2">Master Sunny · In person</p>
        <h3 className="font-display text-lg font-bold text-destiny-purple mb-2">
          {variant === "compatibility" ? "Deep relationship reading" : "Full chart reading"}
        </h3>
        <p className="text-sm text-destiny-purple/60 mb-4 max-w-md mx-auto">
          Apprentice notes are entry-level only. Master Sunny offers full readings ({price}) at our Wanchai
          studio — 60–90 min, decade luck cycles, and your real questions answered.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/en/booking" className="btn-primary inline-flex justify-center">
            Book a reading
          </Link>
          <TrackedWhatsAppLink
            location={`master_cta_en_${variant}`}
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex justify-center"
          >
            WhatsApp Master Sunny
          </TrackedWhatsAppLink>
        </div>
      </div>
    );
  }

  if (size === "compact" && variant === "chart") {
    return (
      <div className="rounded-xl border border-destiny-gold/35 bg-gradient-to-r from-destiny-gold/15 via-white to-destiny-gold/5 px-4 py-4 sm:px-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="font-display font-bold text-destiny-purple">
            想真人算命？全批 {price}
          </p>
          <p className="text-xs text-destiny-purple/60 mt-0.5">
            小徒弟只係入門 · 師傅親批大限流年 · 灣仔 · 過千好評
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Link
            href="/book"
            className="btn-primary text-sm inline-flex justify-center"
          >
            網上預約全批
          </Link>
          <TrackedWhatsAppLink
            location="master_cta_chart_compact"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm inline-flex justify-center"
          >
            WhatsApp
          </TrackedWhatsAppLink>
        </div>
      </div>
    );
  }

  const title =
    variant === "compatibility"
      ? "深入合婚 · 師傅親批"
      : variant === "fortune-stick"
        ? "深入問事 · 師傅親批"
        : "想真人算命？預約紫微全批";

  const body =
    variant === "compatibility" ? (
      <>
        小徒弟探測只係入門參考；想知<strong className="text-destiny-purple">適唔適合結婚、邊年擺酒</strong>，
        全批 <strong className="text-destiny-purple">{price}</strong>，師傅親自合婚定盤，
        60–90 分鐘講足大限、流年同你關心嘅感情問題。
      </>
    ) : variant === "fortune-stick" ? (
      <>
        小徒弟解籤只係入門參考；想結合<strong className="text-destiny-purple">命盤、大限流年</strong>深入問事，
        全批 <strong className="text-destiny-purple">{price}</strong>，師傅親自定盤，
        60–90 分鐘講足你關心嘅問題。
      </>
    ) : (
      <>
        網上排盤同贈言只係入門。想搵師傅<strong className="text-destiny-purple">算命／全批</strong>
        {" "}
        <strong className="text-destiny-purple">{price}</strong>
        ，60–90 分鐘親批事業、感情、大限十年同流年 — 灣仔面談或 WhatsApp 預約。
      </>
    );

  return (
    <div className="rounded-xl border border-destiny-gold/30 bg-gradient-to-b from-destiny-gold/10 to-white px-5 sm:px-6 py-8 text-center">
      <p className="text-xs text-destiny-gold mb-2">真人算命 · 灣仔工作室 · 過千好評</p>
      <h3 className="font-display text-lg font-bold text-destiny-purple mb-2">{title}</h3>
      <p className="text-sm text-destiny-purple/60 mb-2 max-w-md mx-auto">{body}</p>
      <p className="text-xs text-destiny-purple/45 mb-5">
        同行賣月費 AI 訂閱 · 馮命居係真人師傅親批
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {variant === "chart" ? (
          <>
            <Link href="/book" className="btn-primary inline-flex justify-center">
              網上預約全批算命
            </Link>
            <TrackedWhatsAppLink
              location={`master_cta_${variant}`}
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex justify-center"
            >
              WhatsApp 預約
            </TrackedWhatsAppLink>
          </>
        ) : (
          <>
            <TrackedWhatsAppLink
              location={`master_cta_${variant}`}
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex justify-center"
            >
              {variant === "compatibility"
                ? "WhatsApp 請師傅合婚"
                : "WhatsApp 請師傅問事"}
            </TrackedWhatsAppLink>
            <Link href="/booking" className="btn-secondary inline-flex justify-center">
              收費及預約
            </Link>
          </>
        )}
      </div>
      {variant === "chart" && (
        <p className="mt-3 text-xs text-destiny-purple/50">
          <Link href="/booking#full-reading" className="text-destiny-gold hover:underline">
            先睇全批收費詳情
          </Link>
        </p>
      )}
    </div>
  );
}
