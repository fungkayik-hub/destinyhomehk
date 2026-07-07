import Link from "next/link";
import { pricingPlans } from "@/lib/site-config";
import TrackedWhatsAppLink from "@/components/TrackedWhatsAppLink";

interface Props {
  whatsappHref: string;
  locale?: "zh" | "en";
  variant?: "chart" | "compatibility" | "fortune-stick";
}

export default function MasterReadingCta({
  whatsappHref,
  locale = "zh",
  variant = "chart",
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
          <TrackedWhatsAppLink
            location={`master_cta_en_${variant}`}
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex justify-center"
          >
            WhatsApp Master Sunny
          </TrackedWhatsAppLink>
          <Link href="/en/booking" className="btn-secondary inline-flex justify-center">
            Services & pricing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-destiny-gold/30 bg-gradient-to-b from-destiny-gold/10 to-white px-5 sm:px-6 py-8 text-center">
      <p className="text-xs text-destiny-gold mb-2">真人師傅 · 灣仔工作室</p>
      <h3 className="font-display text-lg font-bold text-destiny-purple mb-2">
        {variant === "compatibility"
          ? "深入合婚 · 師傅親批"
          : variant === "fortune-stick"
            ? "深入問事 · 師傅親批"
            : "請 Sunny 師傅親自解盤"}
      </h3>
      <p className="text-sm text-destiny-purple/60 mb-2 max-w-md mx-auto">
        {variant === "compatibility" ? (
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
            小徒弟贈言只係入門參考；全批 <strong className="text-destiny-purple">{price}</strong>，師傅親自定盤，
            60–90 分鐘講足大限、流年同你關心嘅問題。
          </>
        )}
      </p>
      <p className="text-xs text-destiny-purple/45 mb-5">
        同行賣月費訂閱 · 你哋係真人師傅 + 過千好評
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <TrackedWhatsAppLink
          location={`master_cta_${variant}`}
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex justify-center"
        >
          {variant === "compatibility"
            ? "WhatsApp 請師傅合婚"
            : variant === "fortune-stick"
              ? "WhatsApp 請師傅問事"
              : "WhatsApp 請師傅解盤"}
        </TrackedWhatsAppLink>
        <Link href="/booking" className="btn-secondary inline-flex justify-center">
          收費及預約
        </Link>
      </div>
    </div>
  );
}
