import {
  PALACE_REPORT_PRODUCTS,
  type PalaceReportTier,
} from "@/lib/palace-report/config";
import { formatPriceHkd } from "@/lib/stripe/plans";

const { standard, full } = PALACE_REPORT_PRODUCTS;
const forecastYear = () => new Date().getFullYear();

/** 對外文案 — 網上小師傅流年命書（付費；同免費「小徒弟贈言」分開） */
export const palaceReportCopy = {
  badge: "Destiny Home · 網上小師傅命書",
  shortBadge: "網上小師傅命書",
  sectionTitle: `${forecastYear()} 流年命書`,
  sectionSubtitle: "按你命盤整理今年流年 — 揀流年詳批或全批",
  sectionHint: "付款後即時整理，可於本頁查看完整內容。",
  previewHint: "解鎖後可睇完整命書。",
  lockedPreview: "流年命書已鎖定 · 付款後即時整理",
  analysisDisclaimer:
    "以上為 AI 按中洲派排盤整理嘅參考命書，僅供參考。",
  notMasterNote: "非 Sunny 師傅親批",
  masterCtaNote: "定盤、大限流年請 WhatsApp 預約師傅全批",
  tierStandardTitle: "流年詳批",
  tierStandardPrice: formatPriceHkd(standard.priceCents),
  tierStandardBullets: [
    "完整流年分析",
    "十二個月流月（每月主題、宜、忌）",
    "3–5 條實用化解行動（行為／時機／溝通）",
    "不含獨立風水佈局章節",
  ],
  tierFullTitle: "全批",
  tierFullPrice: formatPriceHkd(full.priceCents),
  tierFullBullets: [
    "包含流年詳批全部內容",
    "流年風水點化（坐向／床頭／財位／門路等實用提示）",
    "更完整化解清單（行為、時機、溝通、簡易空間整理）",
    "如需師傅親批，可 WhatsApp 預約面談（另計）",
  ],
  unlockStandard: `購買流年詳批 · ${formatPriceHkd(standard.priceCents)}`,
  unlockFull: `購買全批 · ${formatPriceHkd(full.priceCents)}`,
  generatingHint: "網上小師傅整理緊…",
  paymentProcessingHint: "確認付款中…",
  alreadyUnlockedStandard: "已解鎖流年詳批",
  alreadyUnlockedFull: "已解鎖全批",
  legacyBriefTitle: "流年簡批（已購舊版）",
  legacyDetailedTitle: "詳批（已購舊版）",
  whatsappFallback: "線上付款暫未開通，請 WhatsApp 查詢網上小師傅命書。",
} as const;

export const palaceReportCopyEn = {
  badge: "Destiny Home · Online annual report",
  shortBadge: "Online annual report",
  sectionTitle: `${forecastYear()} annual forecast`,
  sectionSubtitle: "Chart-based liu nian — detailed or full tier",
  sectionHint: "Generated after payment on this page.",
  previewHint: "Unlock for the full report.",
  lockedPreview: "Annual report locked · generated after payment",
  analysisDisclaimer:
    "AI-arranged reference report from your chart — for reference only.",
  notMasterNote: "Not a reading by Master Sunny in person",
  masterCtaNote: "For chart confirmation & decade luck — WhatsApp Master Sunny",
  tierStandardTitle: "Annual detailed",
  tierStandardPrice: formatPriceHkd(standard.priceCents),
  tierStandardBullets: [
    "Full annual write-up",
    "12 months (theme, do, don't)",
    "3–5 practical action steps",
    "No dedicated feng shui layout chapter",
  ],
  tierFullTitle: "Full",
  tierFullPrice: formatPriceHkd(full.priceCents),
  tierFullBullets: [
    "Everything in Annual detailed",
    "Annual feng shui pointers",
    "Expanded remedy checklist",
    "WhatsApp Master Sunny for in-person reading (separate booking)",
  ],
  unlockStandard: `Annual detailed · ${formatPriceHkd(standard.priceCents)}`,
  unlockFull: `Full tier · ${formatPriceHkd(full.priceCents)}`,
  generatingHint: "Preparing your report…",
  paymentProcessingHint: "Confirming payment…",
  alreadyUnlockedStandard: "Annual detailed unlocked",
  alreadyUnlockedFull: "Full tier unlocked",
  legacyBriefTitle: "Brief (legacy purchase)",
  legacyDetailedTitle: "Detailed (legacy purchase)",
  whatsappFallback: "Online checkout isn't available — WhatsApp us for reports.",
} as const;

export type PalaceReportCopy = typeof palaceReportCopy | typeof palaceReportCopyEn;

export type AnnualReportViewId =
  | PalaceReportTier
  | "legacyBrief"
  | "legacyDetailed";

export function getPalaceReportCopy(locale: "zh" | "en" = "zh") {
  return locale === "en" ? palaceReportCopyEn : palaceReportCopy;
}

export function reportViewTitle(
  id: AnnualReportViewId,
  copy: PalaceReportCopy,
): string {
  switch (id) {
    case "standard":
      return copy.tierStandardTitle;
    case "full":
      return copy.tierFullTitle;
    case "legacyBrief":
      return copy.legacyBriefTitle;
    case "legacyDetailed":
      return copy.legacyDetailedTitle;
  }
}

export function reportViewUnlockedLabel(
  id: AnnualReportViewId,
  copy: PalaceReportCopy,
): string {
  switch (id) {
    case "standard":
      return copy.alreadyUnlockedStandard;
    case "full":
      return copy.alreadyUnlockedFull;
    case "legacyBrief":
      return copy.legacyBriefTitle;
    case "legacyDetailed":
      return copy.legacyDetailedTitle;
  }
}
