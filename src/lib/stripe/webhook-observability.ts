import { Resend } from "resend";
import { getFromEmail, getNotifyEmail } from "@/lib/booking/config";
import { checkRateLimit } from "@/lib/rate-limit";

export type WebhookLogContext = {
  area: "stripe_webhook" | "palace_report_session";
  eventType?: string;
  sessionId?: string;
  productType?: string;
  success: boolean;
  reason?: string;
  detail?: Record<string, string | number | boolean | null | undefined>;
};

export function logWebhookEvent(ctx: WebhookLogContext): void {
  const payload = {
    ts: new Date().toISOString(),
    level: ctx.success ? "info" : "error",
    ...ctx,
  };
  if (ctx.success) {
    console.info("[destiny-webhook]", JSON.stringify(payload));
  } else {
    console.error("[destiny-webhook]", JSON.stringify(payload));
  }
}

/** 每 session / 原因組合最多通知一次（1 小時窗口），避免 webhook 重試刷屏 */
export async function notifyWebhookFailureIfNeeded(
  ctx: Omit<WebhookLogContext, "success"> & { reason: string },
): Promise<void> {
  const sessionPart = ctx.sessionId?.trim() || "no_session";
  const key = `webhook-notify:${ctx.area}:${sessionPart}:${ctx.reason}`;
  const rate = checkRateLimit(key, 1, 60 * 60 * 1000);
  if (!rate.allowed) return;

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[destiny-webhook] RESEND_API_KEY missing — skip failure email");
    return;
  }

  const to = getNotifyEmail();
  const subject = `[Destiny Home] ${ctx.area} 失敗 · ${ctx.reason}`;
  const lines = [
    `<p><strong>區域</strong>：${ctx.area}</p>`,
    ctx.eventType ? `<p><strong>事件</strong>：${ctx.eventType}</p>` : "",
    ctx.sessionId ? `<p><strong>Session</strong>：${ctx.sessionId}</p>` : "",
    ctx.productType ? `<p><strong>產品類型</strong>：${ctx.productType}</p>` : "",
    `<p><strong>原因</strong>：${ctx.reason}</p>`,
    ctx.detail
      ? `<pre style="font-size:12px">${JSON.stringify(ctx.detail, null, 2)}</pre>`
      : "",
    `<p style="color:#6B7A99;font-size:12px">此信由系統自動發出，請勿回覆內含敏感資料。</p>`,
  ].join("");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: getFromEmail(),
    to,
    subject,
    html: `<div style="font-family:sans-serif;max-width:520px">${lines}</div>`,
  });

  if (error) {
    console.error("[destiny-webhook] failure notify email error:", error.message);
  }
}
