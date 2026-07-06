import { PALACE_REPORT_PRODUCTS } from "@/lib/palace-report/config";
import { formatPriceHkd } from "@/lib/stripe/plans";

const { single, bundle3, full } = PALACE_REPORT_PRODUCTS;

/** 對外文案 — 小師傅 AI 命書（付費；同免費「小徒弟贈言」分開） */
export const palaceReportCopy = {
  badge: "Destiny Home · 小師傅 AI 命書",
  shortBadge: "小師傅 AI 命書",
  sectionTitle: "小師傅 AI 命書",
  sectionHint: "三方四正 · 十年大限虛歲 · 生活場景 · 實操建議（800–1200 字）",
  previewHint: "解鎖後可睇完整命書，含生活場景同實操建議。",
  lockedPreview: "完整命書已鎖定 · 付款後即時整理",
  analysisDisclaimer:
    "以上為 AI 按中洲派排盤整理嘅參考命書，僅供參考。",
  notMasterNote: "非 Sunny 師傅親批",
  masterCtaNote: "定盤、大限流年請 WhatsApp 預約師傅全批",
  unlockSingle: `解鎖此宮詳細命書 · ${formatPriceHkd(single.priceCents)}`,
  unlockBundle3: `自選三宮套裝 · ${formatPriceHkd(bundle3.priceCents)}`,
  unlockFull: `解鎖全部十二宮 · ${formatPriceHkd(full.priceCents)}`,
  bundleModalTitle: "揀三個宮位",
  bundleModalHint: "已解鎖嘅宮唔計入套裝選擇。",
  bundleModalConfirm: "前往付款",
  generatingHint: "小師傅整理緊…",
  paymentProcessingHint: "確認付款中…",
  alreadyUnlocked: "此宮已解鎖",
  whatsappFallback: "線上付款暫未開通，請 WhatsApp 查詢小師傅命書。",
} as const;

export const palaceReportCopyEn = {
  badge: "Destiny Home · AI palace report",
  shortBadge: "AI palace report",
  sectionTitle: "AI palace report",
  sectionHint: "Tri-quadrant view · decade luck · practical advice (800–1200 words)",
  previewHint: "Unlock for the full report with life scenarios and actionable tips.",
  lockedPreview: "Full report locked · generated after payment",
  analysisDisclaimer:
    "AI-arranged reference report from your chart using Zhong Zhou school rules — for reference only.",
  notMasterNote: "Not a reading by Master Sunny in person",
  masterCtaNote: "For chart confirmation & decade luck — WhatsApp Master Sunny for a full reading",
  unlockSingle: `Unlock this palace · ${formatPriceHkd(single.priceCents)}`,
  unlockBundle3: `Pick any 3 palaces · ${formatPriceHkd(bundle3.priceCents)}`,
  unlockFull: `Unlock all 12 palaces · ${formatPriceHkd(full.priceCents)}`,
  bundleModalTitle: "Choose 3 palaces",
  bundleModalHint: "Already unlocked palaces don't count toward the bundle.",
  bundleModalConfirm: "Proceed to payment",
  generatingHint: "Preparing your report…",
  paymentProcessingHint: "Confirming payment…",
  alreadyUnlocked: "This palace is already unlocked",
  whatsappFallback: "Online checkout isn't available — WhatsApp us for palace reports.",
} as const;

export function getPalaceReportCopy(locale: "zh" | "en" = "zh") {
  return locale === "en" ? palaceReportCopyEn : palaceReportCopy;
}
