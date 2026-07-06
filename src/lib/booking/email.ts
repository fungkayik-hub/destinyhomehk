import { Resend } from "resend";

import type { BookingRecord } from "@/lib/booking/types";

import { getFromEmail, getNotifyEmail } from "@/lib/booking/config";

import { siteConfig, whatsappUrl } from "@/lib/site-config";



import { formatPriceHkd } from "@/lib/stripe/plans";

function paymentRow(booking: BookingRecord): string {
  if (booking.paymentStatus !== "paid" || booking.amountPaidCents == null) {
    return "";
  }
  return `<tr><td style="padding: 8px 0; color: #6B7A99;">付款</td><td><strong>${formatPriceHkd(booking.amountPaidCents)}</strong>（已付）</td></tr>`;
}

function formatDateChinese(date: string): string {

  const [y, m, d] = date.split("-").map(Number);

  const weekday = new Intl.DateTimeFormat("zh-HK", {

    weekday: "long",

    timeZone: "Asia/Hong_Kong",

  }).format(new Date(y, m - 1, d));

  return `${y}年${m}月${d}日（${weekday}）`;

}



function buildMasterEmailHtml(booking: BookingRecord): string {

  const waLink = whatsappUrl(

    `你好 ${booking.customerName}，收到你網上預約 ${booking.serviceTitle}（${formatDateChinese(booking.bookingDate)} ${booking.bookingTime}），想同你確認出生資料同諮詢內容。`,

  );



  const emailRow = booking.customerEmail

    ? `<tr><td style="padding: 8px 0; color: #6B7A99;">電郵</td><td>${booking.customerEmail}</td></tr>`

    : "";



  return `

    <div style="font-family: sans-serif; max-width: 520px; color: #0F1A33;">

      <h2 style="color: #C9A96E;">新網上預約 — Destiny Home</h2>

      <table style="width: 100%; border-collapse: collapse;">

        <tr><td style="padding: 8px 0; color: #6B7A99;">服務</td><td><strong>${booking.serviceTitle}</strong></td></tr>

        <tr><td style="padding: 8px 0; color: #6B7A99;">日期</td><td>${formatDateChinese(booking.bookingDate)}</td></tr>

        <tr><td style="padding: 8px 0; color: #6B7A99;">時間</td><td>${booking.bookingTime}</td></tr>

        <tr><td style="padding: 8px 0; color: #6B7A99;">姓名</td><td>${booking.customerName}</td></tr>

        <tr><td style="padding: 8px 0; color: #6B7A99;">電話</td><td>${booking.customerPhone}</td></tr>

        ${emailRow}
        ${paymentRow(booking)}
      </table>

      <p style="margin-top: 20px;">

        <a href="${waLink}" style="background: #25D366; color: white; padding: 10px 18px; border-radius: 999px; text-decoration: none;">

          WhatsApp 聯絡客人

        </a>

      </p>

      <p style="font-size: 12px; color: #6B7A99; margin-top: 24px;">

        📍 ${siteConfig.address} · ${siteConfig.hours}

      </p>

    </div>

  `;

}



function buildCustomerEmailHtml(booking: BookingRecord): string {

  const waLink = whatsappUrl(

    `你好，我剛完成網上預約 ${booking.serviceTitle}（${booking.bookingDate} ${booking.bookingTime}），想確認資料。`,

  );



  return `

    <div style="font-family: sans-serif; max-width: 520px; color: #0F1A33;">

      <h2 style="color: #C9A96E;">預約確認 — Destiny Home</h2>

      <p>${booking.customerName}，多謝你預約 Sunny 師傅嘅服務。</p>

      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">

        <tr><td style="padding: 8px 0; color: #6B7A99;">服務</td><td><strong>${booking.serviceTitle}</strong></td></tr>

        <tr><td style="padding: 8px 0; color: #6B7A99;">日期</td><td>${formatDateChinese(booking.bookingDate)}</td></tr>

        <tr><td style="padding: 8px 0; color: #6B7A99;">時間</td><td>${booking.bookingTime}</td></tr>

        <tr><td style="padding: 8px 0; color: #6B7A99;">電話</td><td>${booking.customerPhone}</td></tr>
        ${paymentRow(booking)}
      </table>

      <p style="line-height: 1.6;">師傅會透過 WhatsApp 同你確認出生資料同諮詢內容。如有急事，歡迎主動聯絡。</p>

      <p style="margin-top: 20px;">

        <a href="${waLink}" style="background: #25D366; color: white; padding: 10px 18px; border-radius: 999px; text-decoration: none;">

          WhatsApp 聯絡師傅

        </a>

      </p>

      <p style="font-size: 12px; color: #6B7A99; margin-top: 24px;">

        📍 ${siteConfig.address}<br />

        ${siteConfig.hours}<br />

        ${siteConfig.phone}

      </p>

    </div>

  `;

}



export type EmailSendResult =

  | { sent: true }

  | { sent: false; reason: "missing_key" | "resend_error"; detail?: string };



async function sendEmail(

  to: string,

  subject: string,

  html: string,

): Promise<EmailSendResult> {

  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {

    console.warn("RESEND_API_KEY not set or empty — skipping email");

    return { sent: false, reason: "missing_key" };

  }



  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({

    from: getFromEmail(),

    to,

    subject,

    html,

  });



  if (error) {

    console.error("Resend email failed:", error);

    return {

      sent: false,

      reason: "resend_error",

      detail: error.message,

    };

  }

  return { sent: true };

}



export async function sendBookingNotification(

  booking: BookingRecord,

): Promise<EmailSendResult> {

  return sendEmail(

    getNotifyEmail(),

    `新預約：${booking.customerName} — ${booking.serviceTitle} ${booking.bookingDate} ${booking.bookingTime}`,

    buildMasterEmailHtml(booking),

  );

}



export async function sendBookingConfirmation(

  booking: BookingRecord,

): Promise<EmailSendResult | { sent: false; reason: "no_customer_email" }> {

  const email = booking.customerEmail?.trim();

  if (!email) return { sent: false, reason: "no_customer_email" };



  return sendEmail(

    email,

    `預約確認：${booking.serviceTitle} — ${formatDateChinese(booking.bookingDate)} ${booking.bookingTime}`,

    buildCustomerEmailHtml(booking),

  );

}

export interface PaymentIssueInput {
  sessionId: string;
  serviceTitle: string;
  bookingDate: string;
  bookingTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  amountPaidCents: number;
  error: string;
}

export async function sendPaymentIssueNotification(
  input: PaymentIssueInput,
): Promise<EmailSendResult> {
  const html = `
    <div style="font-family: sans-serif; max-width: 520px; color: #0F1A33;">
      <h2 style="color: #c0392b;">⚠️ 已收款但未能自動建立預約</h2>
      <p>客人已完成 Stripe 付款，但系統未能鎖定時段（${input.error}）。請人手跟進或安排退款。</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #6B7A99;">Stripe Session</td><td>${input.sessionId}</td></tr>
        <tr><td style="padding: 8px 0; color: #6B7A99;">服務</td><td>${input.serviceTitle}</td></tr>
        <tr><td style="padding: 8px 0; color: #6B7A99;">日期</td><td>${formatDateChinese(input.bookingDate)} ${input.bookingTime}</td></tr>
        <tr><td style="padding: 8px 0; color: #6B7A99;">姓名</td><td>${input.customerName}</td></tr>
        <tr><td style="padding: 8px 0; color: #6B7A99;">電話</td><td>${input.customerPhone}</td></tr>
        <tr><td style="padding: 8px 0; color: #6B7A99;">已付</td><td>${formatPriceHkd(input.amountPaidCents)}</td></tr>
      </table>
    </div>
  `;

  return sendEmail(
    getNotifyEmail(),
    `⚠️ 付款成功但預約失敗 — ${input.customerName}`,
    html,
  );
}


