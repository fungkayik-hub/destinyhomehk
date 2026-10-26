import { sendHtmlEmail, type EmailSendResult } from "@/lib/booking/email";
import { getNotifyEmail } from "@/lib/booking/config";
import { findPalaceReportProduct } from "@/lib/palace-report/config";
import type { PalaceReportPurchase } from "@/lib/palace-report/types";
import { getSiteUrl } from "@/lib/site-url";
import { siteConfig } from "@/lib/site-config";
import type { PalaceName } from "@/lib/ziwei/types";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatReportHtml(text: string): string {
  const escaped = escapeHtml(text);
  const withBold = escaped.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return withBold.replace(/\n/g, "<br />");
}

function buildPalaceReportEmailHtml(
  productTitle: string,
  reports: { palace: PalaceName; text: string }[],
): string {
  const siteUrl = getSiteUrl();
  const sections = reports
    .map(
      (r) => `
      <section style="margin: 24px 0; padding-top: 16px; border-top: 1px solid #E8ECF4;">
        <h3 style="color: #C9A96E; margin: 0 0 12px;">${escapeHtml(r.palace)}</h3>
        <div style="line-height: 1.75; color: #0F1A33;">${formatReportHtml(r.text)}</div>
      </section>`,
    )
    .join("");

  return `
    <div style="font-family: sans-serif; max-width: 600px; color: #0F1A33;">
      <h2 style="color: #C9A96E;">命居｜你的流年命書</h2>
      <p style="line-height: 1.7;">
        多謝你購買 <strong>${escapeHtml(productTitle)}</strong>。以下係為你整理嘅網上小師傅命書內容，方便你留存同慢慢睇。
      </p>
      ${sections}
      <p style="font-size: 13px; color: #6B7A99; line-height: 1.6; margin-top: 28px;">
        以上為 AI 按中洲派排盤整理嘅<strong>網上小師傅命書</strong>，僅供參考，<strong>非 Sunny 師傅親批</strong>。想定盤、大限流年或人生重大決定，歡迎預約師傅全批。
      </p>
      <p style="margin-top: 20px;">
        <a href="${siteUrl}" style="color: #C9A96E; text-decoration: none; font-weight: 600;">
          返回 Destiny Home 命居 →
        </a>
      </p>
      <p style="font-size: 12px; color: #6B7A99; margin-top: 24px;">
        📍 ${siteConfig.address} · ${siteConfig.hours}
      </p>
    </div>
  `;
}

export async function sendPalaceReportDeliveryEmail(
  purchase: PalaceReportPurchase,
  reports: { palace: PalaceName; text: string }[],
): Promise<EmailSendResult | { sent: false; reason: "no_customer_email" }> {
  const email = purchase.customerEmail?.trim();
  if (!email) {
    return { sent: false, reason: "no_customer_email" };
  }

  const product =
    findPalaceReportProduct(purchase.productId)?.title ?? "網上小師傅命書";
  const html = buildPalaceReportEmailHtml(product, reports);
  const notify = getNotifyEmail();

  return sendHtmlEmail({
    to: email,
    bcc: notify !== email ? notify : undefined,
    subject: "命居｜你的流年命書",
    html,
  });
}
