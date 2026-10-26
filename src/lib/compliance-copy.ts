import { formatPriceHkd } from "@/lib/stripe/plans";
import { PALACE_REPORT_PRODUCTS } from "@/lib/palace-report/config";
import { siteConfig, whatsappUrl } from "@/lib/site-config";

const { standard, full } = PALACE_REPORT_PRODUCTS;

/** 買家面向合規文案（繁體中文 · 香港） */
export const complianceCopyZh = {
  aiDisclaimerShort:
    "內容為 AI 協助整理之網上小師傅命書，非 Sunny 師傅親批；僅供娛樂及個人參考，不構成醫療、理財或法律意見。",
  apprenticeAiDisclaimer:
    "以上為 AI 協助整理之小徒弟贈言（按中洲派排盤），非 Sunny 師傅親批；僅供娛樂及個人參考，不構成醫療、理財或法律意見。",
  refundNearCheckout:
    "網上小師傅命書屬數碼內容：付款成功並於本頁解鎖／交付後，一般不設退款。若已付款但逾 24 小時仍未能解鎖，請 WhatsApp 聯絡核查。",
  refundLinkLabel: "退款政策",
  privacyShort:
    "出生資料及電郵（如有）僅用於起盤、生成與交付命書；不會出售予第三方。完成交付後，相關記錄一般保留最多 24 個月作查單及技術支援，之後會定期刪除或匿名化。",
  privacyDeletion:
    "如需刪除個人資料，請 WhatsApp 或致電聯絡我哋，並提供付款參考或出生資料以便核對。",
  privacyLinkLabel: "私隱說明",
  checkoutFootnote: `流年詳批 ${formatPriceHkd(standard.priceCents)} · 全批 ${formatPriceHkd(full.priceCents)} · 信用卡結帳顯示「命居 Destiny Home」相關字樣。`,
} as const;

export const complianceCopyEn = {
  aiDisclaimerShort:
    "AI-assisted online report — not a reading by Master Sunny in person. For entertainment and personal reference only; not medical, financial, or legal advice.",
  apprenticeAiDisclaimer:
    "AI-assisted apprentice notes from your chart — not Master Sunny in person. For reference only; not medical, financial, or legal advice.",
  refundNearCheckout:
    "Digital reports: generally no refund after unlock/delivery. If paid but not unlocked after 24 hours, WhatsApp us to investigate.",
  refundLinkLabel: "Refund policy",
  privacyShort:
    "Birth data and email (if provided) are used only to generate and deliver your report; not sold. Records are typically kept up to 24 months for support, then deleted or anonymized.",
  privacyDeletion:
    "To request deletion, contact us via WhatsApp or phone with payment reference or birth details for verification.",
  privacyLinkLabel: "Privacy",
  checkoutFootnote: `Annual detailed ${formatPriceHkd(standard.priceCents)} · Full ${formatPriceHkd(full.priceCents)}.`,
} as const;

export function getComplianceCopy(locale: "zh" | "en" = "zh") {
  return locale === "zh" ? complianceCopyZh : complianceCopyEn;
}

export function privacyContactWhatsAppHref(message?: string) {
  return whatsappUrl(
    message ??
      `你好，我想查詢 ${siteConfig.name} 網上命書嘅個人資料刪除或私隱事宜。`,
  );
}
