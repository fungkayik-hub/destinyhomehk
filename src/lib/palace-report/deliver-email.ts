import type Stripe from "stripe";
import { sendPalaceReportDeliveryEmail } from "@/lib/palace-report/email";
import type { PalaceReportPurchase } from "@/lib/palace-report/types";
import {
  getReportContent,
  markPurchaseEmailSent,
  updatePurchaseCustomerEmail,
} from "@/lib/palace-report/store";
import {
  isLegacyAnnualSlot,
  LEGACY_ANNUAL_SLOTS,
  tierFromStorageSlot,
} from "@/lib/palace-report/config";
import { PALACES, type PalaceName } from "@/lib/ziwei/types";

function isPalaceName(value: string): value is PalaceName {
  return (PALACES as readonly string[]).includes(value);
}

function reportSectionTitle(slot: string): string {
  const tier = tierFromStorageSlot(slot);
  if (tier === "standard") return "流年詳批";
  if (tier === "full") return "全批";
  if (slot === LEGACY_ANNUAL_SLOTS.brief) return "流年簡批（舊版）";
  if (slot === LEGACY_ANNUAL_SLOTS.detailed) return "詳批（舊版）";
  if (isPalaceName(slot)) return slot;
  if (isLegacyAnnualSlot(slot)) return "流年命書";
  return "網上小師傅命書";
}

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
): Promise<{ sectionTitle: string; text: string }[] | null> {
  const reports: { sectionTitle: string; text: string }[] = [];
  for (const slot of purchase.palaces) {
    const content = await getReportContent(purchase.chartKey, slot);
    if (!content?.text?.trim()) {
      return null;
    }
    reports.push({ sectionTitle: reportSectionTitle(slot), text: content.text });
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
