import { Resend } from "resend";

import { getFromEmail, getNotifyEmail } from "@/lib/booking/config";
import type { EmailSendResult } from "@/lib/booking/email";
import { findPalaceReportProduct } from "@/lib/palace-report/config";
import type { PalaceReportPurchase } from "@/lib/palace-report/types";
import { siteConfig } from "@/lib/site-config";
import { formatPriceHkd } from "@/lib/stripe/plans";
import type { PalaceName } from "@/lib/ziwei/types";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildReportEmailHtml(
  purchase: PalaceReportPurchase,
  reports: { palace: PalaceName; text: string }[],
): string {
  const product =
    findPalaceReportProduct(purchase.productId)?.title ?? "網上小師傅命書";
  const sections = reports
    .map(
      (r) => `
      <section style="margin: 24px 0; padding-top: 16px; border-top: 1px solid #E8ECF4;">
        <h3 style="color: #C9A96E; margin: 0 0 12px;">${escapeHtml(r.palace)}</h3>
        <div style="white-space: pre-wrap; line-height: 1.7;">${escapeHtml(r.text)}</div>
      </section>`,
    )
    .join("");

  return `
    <div style="font-family: sans-serif; max-width: 640px; color: #0F1A33;">
      <h2 style="color: #C9A96E;">你嘅網上小師傅命書 — Destiny Home</h2>
      <p style="line-height: 1.6;">多謝你喺 Destiny Home 購買 <strong>${escapeHtml(product)}</strong>（${formatPriceHkd(purchase.amountPaidCents)}）。以下係你已解鎖嘅命書內容，方便你留存同隨時翻閱。</p>
      ${sections}
      <p style="font-size: 13px; color: #6B7A99; line-height: 1.6; margin-top: 28px; padding: 12px; background: #F5F7FB; border-radius: 8px;">
        <strong>重要提示：</strong>以上為網上小師傅按紫微斗數排盤整理嘅參考內容，<strong>並非 Sunny 師傅親批</strong>。若想定盤、深入大限流年或針對個別問題問事，歡迎 WhatsApp 預約師傅全批。
      </p>
      <p style="font-size: 12px; color: #6B7A99; margin-top: 24px;">
        📍 ${siteConfig.address}<br />
        ${siteConfig.hours}<br />
        ${siteConfig.phone}
      </p>
    </div>
  `;
}

function buildPlainTextReport(
  purchase: PalaceReportPurchase,
  reports: { palace: PalaceName; text: string }[],
): string {
  const product =
    findPalaceReportProduct(purchase.productId)?.title ?? "網上小師傅命書";
  const body = reports.map((r) => `【${r.palace}】\n${r.text}`).join("\n\n---\n\n");
  return `多謝你購買 ${product}（${formatPriceHkd(purchase.amountPaidCents)}）。\n\n${body}\n\n---\n重要提示：以上為網上小師傅命書參考內容，並非 Sunny 師傅親批。`;
}

export async function sendPalaceReportToCustomer(
  purchase: PalaceReportPurchase,
  reports: { palace: PalaceName; text: string }[],
): Promise<EmailSendResult | { sent: false; reason: "no_customer_email" }> {
  const email = purchase.customerEmail?.trim();
  if (!email) {
    return { sent: false, reason: "no_customer_email" };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set or empty — skipping palace report email");
    return { sent: false, reason: "missing_key" };
  }

  const productTitle =
    findPalaceReportProduct(purchase.productId)?.title ?? "網上小師傅命書";
  const subject = `你嘅網上小師傅命書（${productTitle}）— Destiny Home`;
  const html = buildReportEmailHtml(purchase, reports);
  const text = buildPlainTextReport(purchase, reports);
  const notifyEmail = getNotifyEmail();

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: getFromEmail(),
    to: email,
    bcc: notifyEmail !== email ? notifyEmail : undefined,
    subject,
    html,
    text,
  });

  if (error) {
    console.error("Palace report customer email failed:", error, purchase.stripeSessionId);
    return { sent: false, reason: "resend_error", detail: error.message };
  }

  return { sent: true };
}
