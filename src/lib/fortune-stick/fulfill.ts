import type Stripe from "stripe";
import { createPurchaseFromSession } from "@/lib/fortune-stick/store";

export async function fulfillFortuneStickFromCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<{ ok: boolean; error?: string }> {
  const result = await createPurchaseFromSession(session);
  if (!result.ok) {
    return { ok: false, error: result.error };
  }
  return { ok: true };
}
