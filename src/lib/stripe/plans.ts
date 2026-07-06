import { pricingPlans } from "@/lib/site-config";

export interface PayablePlan {
  id: string;
  title: string;
  onlinePayment: true;
  priceCents: number;
}

export function findPricingPlan(serviceId: string) {
  return pricingPlans.find((p) => p.id === serviceId);
}

export function isOnlinePayablePlan(plan: (typeof pricingPlans)[number]): boolean {
  const candidate = plan as unknown as Partial<PayablePlan>;
  return (
    candidate.onlinePayment === true &&
    typeof candidate.priceCents === "number" &&
    candidate.priceCents > 0
  );
}

export function asPayablePlan(
  plan: (typeof pricingPlans)[number],
): PayablePlan | null {
  if (!isOnlinePayablePlan(plan)) return null;
  return plan as unknown as PayablePlan;
}

export function formatPriceHkd(cents: number): string {
  return `HK$${(cents / 100).toLocaleString("en-HK")}`;
}
