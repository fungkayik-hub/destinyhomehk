import type { PalaceName } from "@/lib/ziwei/types";

export interface PalaceReportPurchase {
  id: string;
  chartKey: string;
  stripeSessionId: string;
  productId: string;
  palaces: PalaceName[];
  amountPaidCents: number;
  customerEmail?: string;
  createdAt: string;
}

export interface PalaceReportContent {
  chartKey: string;
  palace: PalaceName;
  text: string;
  provider: string;
  generatedAt: string;
}

export type CreatePurchaseResult =
  | { ok: true; purchase: PalaceReportPurchase }
  | {
      ok: false;
      error: "missing_metadata" | "invalid_product" | "invalid_palaces" | "storage_error";
    };

export interface SaveReportContentInput {
  chartKey: string;
  palace: PalaceName;
  text: string;
  provider: string;
}
