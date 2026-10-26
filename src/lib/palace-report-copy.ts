import { PALACE_REPORT_PRODUCTS } from "@/lib/palace-report/config";
import { formatPriceHkd } from "@/lib/stripe/plans";

const { brief, detailed } = PALACE_REPORT_PRODUCTS;
const forecastYear = () => new Date().getFullYear();

/** 對外文案 — 網上小師傅流年命書（付費；同免費「小徒弟贈言」分開） */
export const palaceReportCopy = {
  badge: "Destiny Home · 網上小師傅命書",
  shortBadge: "網上小師傅命書",
  sectionTitle: `${forecastYear()} 流年命書`,
  sectionSubtitle: "按你命盤整理今年流年 — 揀簡批或詳批",
  sectionHint: "付款後即時整理，可於本頁查看完整內容。",
  previewHint: "解鎖後可睇完整命書。",
  lockedPreview: "流年命書已鎖定 · 付款後即時整理",
  analysisDisclaimer:
    "以上為 AI 按中洲派排盤整理嘅參考命書，僅供參考。",
  notMasterNote: "非 Sunny 師傅親批",
  masterCtaNote: "定盤、大限流年請 WhatsApp 預約師傅全批",
  tierBriefTitle: "流年簡批",
  tierBriefPrice: formatPriceHkd(brief.priceCents),
  tierBriefBullets: [
    "今年流年重點與短總結",
    "整體宜／忌方向（生活化）",
    "不含十二個月流月表",
    "不含風水佈局清單",
  ],
  tierDetailedTitle: "詳批",
  tierDetailedPrice: formatPriceHkd(detailed.priceCents),
  tierDetailedBullets: [
    "完整流年分析",
    "十二個月流月（每月主題、宜、忌）",
    "3–5 條實用化解行動（行為／時機／溝通）",
    "不含獨立風水佈局章節",
  ],
  unlockBrief: `購買流年簡批 · ${formatPriceHkd(brief.priceCents)}`,
  unlockDetailed: `購買詳批 · ${formatPriceHkd(detailed.priceCents)}`,
  generatingHint: "網上小師傅整理緊…",
  paymentProcessingHint: "確認付款中…",
  alreadyUnlockedBrief: "已解鎖流年簡批",
  alreadyUnlockedDetailed: "已解鎖詳批",
  whatsappFallback: "線上付款暫未開通，請 WhatsApp 查詢網上小師傅命書。",
} as const;

export const palaceReportCopyEn = {
  badge: "Destiny Home · Online annual report",
  shortBadge: "Online annual report",
  sectionTitle: `${forecastYear()} annual forecast`,
  sectionSubtitle: "Chart-based liu nian — brief or detailed tier",
  sectionHint: "Generated after payment on this page.",
  previewHint: "Unlock for the full report.",
  lockedPreview: "Annual report locked · generated after payment",
  analysisDisclaimer:
    "AI-arranged reference report from your chart — for reference only.",
  notMasterNote: "Not a reading by Master Sunny in person",
  masterCtaNote: "For chart confirmation & decade luck — WhatsApp Master Sunny",
  tierBriefTitle: "Brief annual",
  tierBriefPrice: formatPriceHkd(brief.priceCents),
  tierBriefBullets: [
    "Year highlights & short summary",
    "High-level do's & don'ts",
    "No 12-month table",
    "No feng shui layout list",
  ],
  tierDetailedTitle: "Detailed",
  tierDetailedPrice: formatPriceHkd(detailed.priceCents),
  tierDetailedBullets: [
    "Full annual write-up",
    "12 months (theme, do, don't)",
    "3–5 practical action steps",
    "No dedicated feng shui layout chapter",
  ],
  unlockBrief: `Brief tier · ${formatPriceHkd(brief.priceCents)}`,
  unlockDetailed: `Detailed tier · ${formatPriceHkd(detailed.priceCents)}`,
  generatingHint: "Preparing your report…",
  paymentProcessingHint: "Confirming payment…",
  alreadyUnlockedBrief: "Brief tier unlocked",
  alreadyUnlockedDetailed: "Detailed tier unlocked",
  whatsappFallback: "Online checkout isn't available — WhatsApp us for reports.",
} as const;

export function getPalaceReportCopy(locale: "zh" | "en" = "zh") {
  return locale === "en" ? palaceReportCopyEn : palaceReportCopy;
}
