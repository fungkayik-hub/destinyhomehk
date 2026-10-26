/** Current sellable annual report tiers. */
export type PalaceReportTier = "standard" | "full";

export const ANNUAL_REPORT_TIERS: PalaceReportTier[] = ["standard", "full"];

/** Legacy annual slots (existing purchases only — not sold). */
export const LEGACY_ANNUAL_SLOTS = {
  brief: "__annual_brief__",
  detailed: "__annual_detailed__",
} as const;

/** DB / metadata slot for annual report content (not a twelve-palace name). */
export const ANNUAL_REPORT_SLOT: Record<PalaceReportTier, string> = {
  standard: "__annual_standard__",
  full: "__annual_full__",
};

export const PALACE_REPORT_PRODUCTS = {
  standard: {
    id: "palace-report-standard",
    title: "流年詳批",
    priceCents: 12_800,
    tier: "standard" as PalaceReportTier,
  },
  full: {
    id: "palace-report-annual-full",
    title: "全批",
    priceCents: 68_800,
    tier: "full" as PalaceReportTier,
  },
} as const;

export type PalaceReportProductKey = keyof typeof PALACE_REPORT_PRODUCTS;

export type PalaceReportProduct =
  (typeof PALACE_REPORT_PRODUCTS)[PalaceReportProductKey];

/** Pre–current-tier products — webhook / stored purchases only. */
const LEGACY_PALACE_REPORT_PRODUCTS = {
  single: {
    id: "palace-report-single",
    title: "單宮網上小師傅命書",
    priceCents: 8_800,
    maxPalaces: 1,
  },
  bundle3: {
    id: "palace-report-bundle-3",
    title: "三宮網上小師傅命書套裝",
    priceCents: 19_800,
    maxPalaces: 3,
  },
  legacyFull12: {
    id: "palace-report-full",
    title: "十二宮網上小師傅命書全集",
    priceCents: 68_800,
    maxPalaces: 12,
  },
} as const;

const LEGACY_ANNUAL_PRODUCT_IDS: Record<
  string,
  { id: string; title: string; priceCents: number }
> = {
  "palace-report-brief": {
    id: "palace-report-brief",
    title: "流年簡批",
    priceCents: 8_800,
  },
  "palace-report-detailed": {
    id: "palace-report-detailed",
    title: "詳批",
    priceCents: 19_800,
  },
};

export function isLegacyAnnualProductId(productId: string): boolean {
  return productId in LEGACY_ANNUAL_PRODUCT_IDS;
}

export type LegacyPalaceReportProduct =
  (typeof LEGACY_PALACE_REPORT_PRODUCTS)[keyof typeof LEGACY_PALACE_REPORT_PRODUCTS];

export function isAnnualProduct(
  product: PalaceReportProduct | LegacyPalaceReportProduct,
): product is PalaceReportProduct {
  return "tier" in product;
}

export function findPalaceReportProduct(
  productId: string,
): PalaceReportProduct | LegacyPalaceReportProduct | undefined {
  const current = Object.values(PALACE_REPORT_PRODUCTS).find((p) => p.id === productId);
  if (current) return current;
  return Object.values(LEGACY_PALACE_REPORT_PRODUCTS).find((p) => p.id === productId);
}

export function legacyAnnualProductPriceCents(productId: string): number | undefined {
  return LEGACY_ANNUAL_PRODUCT_IDS[productId]?.priceCents;
}

export function getPalaceReportProduct(
  key: PalaceReportProductKey,
): PalaceReportProduct {
  return PALACE_REPORT_PRODUCTS[key];
}

export function storageSlotForTier(tier: PalaceReportTier): string {
  return ANNUAL_REPORT_SLOT[tier];
}

export type StoredAnnualSlot =
  | (typeof ANNUAL_REPORT_SLOT)[PalaceReportTier]
  | (typeof LEGACY_ANNUAL_SLOTS)[keyof typeof LEGACY_ANNUAL_SLOTS];

export function tierFromStorageSlot(slot: string): PalaceReportTier | null {
  if (slot === ANNUAL_REPORT_SLOT.standard) return "standard";
  if (slot === ANNUAL_REPORT_SLOT.full) return "full";
  return null;
}

export function isLegacyAnnualSlot(slot: string): boolean {
  return (
    slot === LEGACY_ANNUAL_SLOTS.brief || slot === LEGACY_ANNUAL_SLOTS.detailed
  );
}

export function checkoutDescriptionForTier(tier: PalaceReportTier): string {
  switch (tier) {
    case "standard":
      return "完整流年、十二個月流月、實用化解行動";
    case "full":
      return "流年詳批內容＋流年風水點化＋完整化解清單";
  }
}
