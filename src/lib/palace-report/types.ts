import type { PalaceReportTier } from "@/lib/palace-report/config";
import type { PalaceName } from "@/lib/ziwei/types";

export interface PalaceReportPurchase {
  id: string;
  chartKey: string;
  stripeSessionId: string;
  productId: string;
  /** Legacy per-palace unlocks; annual tiers use storage slots in this array. */
  palaces: string[];
  amountPaidCents: number;
  customerEmail?: string;
  createdAt: string;
  tier?: PalaceReportTier;
}

export interface PalaceReportContent {
  chartKey: string;
  /** Palace name or annual report storage slot. */
  palace: string;
  text: string;
  provider: string;
  generatedAt: string;
  tier?: PalaceReportTier;
}

export type CreatePurchaseResult =
  | { ok: true; purchase: PalaceReportPurchase }
  | {
      ok: false;
      error: "missing_metadata" | "invalid_product" | "invalid_palaces" | "storage_error";
    };

export interface SaveReportContentInput {
  chartKey: string;
  palace: string;
  text: string;
  provider: string;
  tier?: PalaceReportTier;
}

export interface AnnualReportAccess {
  brief: boolean;
  detailed: boolean;
}
