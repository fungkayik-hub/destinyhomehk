import Link from "next/link";
import { pricingPlans } from "@/lib/site-config";

interface Props {
  whatsappHref: string;
  locale?: "zh" | "en";
  variant?: "chart" | "compatibility";
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
          Free AI is a preview only. Master Sunny offers full readings ({price}) at our Wanchai studio —
          60–90 min, decade luck cycles, and your real questions answered.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex justify-center">
            WhatsApp Master Sunny
          </a>
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
        {variant === "compatibility" ? "深入合婚 · 全批" : "請 Sunny 師傅親自解盤"}
      </h3>
      <p className="text-sm text-destiny-purple/60 mb-2 max-w-md mx-auto">
        網上 AI 只係參考；全批 <strong className="text-destiny-purple">{price}</strong>，師傅親自定盤，
        60–90 分鐘講足大限、流年同你關心嘅問題。
      </p>
      <p className="text-xs text-destiny-purple/45 mb-5">
        同行賣月費 AI 訂閱 · 你哋係真人師傅 + 過千好評
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex justify-center">
          WhatsApp 發資料俾師傅
        </a>
        <Link href="/booking" className="btn-secondary inline-flex justify-center">
          收費及預約
        </Link>
      </div>
    </div>
  );
}
