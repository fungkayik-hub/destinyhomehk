import type Stripe from "stripe";
import { sendPalaceReportDeliveryEmail } from "@/lib/palace-report/email";
import type { PalaceReportPurchase } from "@/lib/palace-report/types";
import {
  getReportContent,
  markPurchaseEmailSent,
  updatePurchaseCustomerEmail,
} from "@/lib/palace-report/store";
import type { PalaceName } from "@/lib/ziwei/types";

function emailAlreadySent(
  purchase: PalaceReportPurchase,
  session: Stripe.Checkout.Session,
): boolean {
  if (purchase.emailSentAt) return true;
  return session.metadata?.reportEmailSent === "1";
}

function resolveCustomerEmail(
  purchase: PalaceReportPurchase,
  session: Stripe.Checkout.Session,
): string | undefined {
  return (
    purchase.customerEmail?.trim() ||
    session.customer_details?.email?.trim() ||
    session.customer_email?.trim() ||
    session.metadata?.customerEmail?.trim() ||
    undefined
  );
}

async function loadReportsForPurchase(
  purchase: PalaceReportPurchase,
): Promise<{ palace: PalaceName; text: string }[] | null> {
  const reports: { palace: PalaceName; text: string }[] = [];
  for (const palace of purchase.palaces) {
    const content = await getReportContent(purchase.chartKey, palace);
    if (!content?.text?.trim()) {
      return null;
    }
    reports.push({ palace, text: content.text });
  }
  return reports;
}

/** Send report email once all palaces are generated. Never throws — unlock must not depend on email. */
export async function deliverPalaceReportEmailIfReady(
  purchase: PalaceReportPurchase,
  session: Stripe.Checkout.Session,
  stripe: Stripe,
): Promise<void> {
  try {
    if (emailAlreadySent(purchase, session)) {
      return;
    }

    const reports = await loadReportsForPurchase(purchase);
    if (!reports) {
      return;
    }

    const customerEmail = resolveCustomerEmail(purchase, session);
    if (customerEmail) {
      await updatePurchaseCustomerEmail(purchase.stripeSessionId, customerEmail);
    }

    const purchaseForSend: PalaceReportPurchase = {
      ...purchase,
      customerEmail: customerEmail ?? purchase.customerEmail,
    };

    const result = await sendPalaceReportDeliveryEmail(purchaseForSend, reports);
    if (!result.sent) {
      console.error(
        "Palace report delivery email failed:",
        result,
        purchase.stripeSessionId,
      );
      return;
    }

    await markPurchaseEmailSent(purchase.stripeSessionId);
    try {
      await stripe.checkout.sessions.update(purchase.stripeSessionId, {
        metadata: {
          ...session.metadata,
          reportEmailSent: "1",
        },
      });
    } catch (err) {
      console.warn("Could not update Stripe session reportEmailSent metadata:", err);
    }
  } catch (err) {
    console.error("Palace report email delivery error:", err, purchase.stripeSessionId);
  }
}
