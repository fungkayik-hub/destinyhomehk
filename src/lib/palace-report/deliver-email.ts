import { sendPalaceReportToCustomer } from "@/lib/palace-report/email";
import {
  claimReportEmailSend,
  getReportContent,
  releaseReportEmailSendClaim,
  updatePurchaseCustomerEmail,
} from "@/lib/palace-report/store";
import type { PalaceReportPurchase } from "@/lib/palace-report/types";
import type { PalaceName } from "@/lib/ziwei/types";

export async function maybeSendPalaceReportEmail(
  purchase: PalaceReportPurchase,
): Promise<void> {
  const reports: { palace: PalaceName; text: string }[] = [];
  for (const palace of purchase.palaces) {
    const content = await getReportContent(purchase.chartKey, palace);
    if (!content) return;
    reports.push({ palace, text: content.text });
  }

  if (reports.length !== purchase.palaces.length) return;

  if (!purchase.customerEmail?.trim()) {
    console.warn(
      "Palace report ready but no customer email — skipping delivery",
      purchase.stripeSessionId,
    );
    return;
  }

  const claimed = await claimReportEmailSend(purchase.stripeSessionId);
  if (!claimed) return;

  const result = await sendPalaceReportToCustomer(purchase, reports);
  if (!result.sent) {
    await releaseReportEmailSendClaim(purchase.stripeSessionId);
    if (result.reason !== "no_customer_email" && "detail" in result) {
      console.error(
        "Palace report email not sent:",
        result.reason,
        result.detail ?? "",
        purchase.stripeSessionId,
      );
    }
  }
}

export async function syncCustomerEmailFromStripeSession(
  purchase: PalaceReportPurchase,
  email: string | null | undefined,
): Promise<PalaceReportPurchase> {
  const trimmed = email?.trim();
  if (!trimmed || purchase.customerEmail?.trim() === trimmed) {
    return purchase;
  }
  await updatePurchaseCustomerEmail(purchase.stripeSessionId, trimmed);
  return { ...purchase, customerEmail: trimmed };
}
