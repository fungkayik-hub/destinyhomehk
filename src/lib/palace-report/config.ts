export type PalaceReportTier = "brief" | "detailed";

/** DB / metadata slot for annual report content (not a twelve-palace name). */
export const ANNUAL_REPORT_SLOT: Record<PalaceReportTier, string> = {
  brief: "__annual_brief__",
  detailed: "__annual_detailed__",
};

export const PALACE_REPORT_PRODUCTS = {
  brief: {
    id: "palace-report-brief",
    title: "流年簡批",
    priceCents: 8_800,
    tier: "brief" as PalaceReportTier,
  },
  detailed: {
    id: "palace-report-detailed",
    title: "詳批",
    priceCents: 19_800,
    tier: "detailed" as PalaceReportTier,
  },
} as const;

export type PalaceReportProductKey = keyof typeof PALACE_REPORT_PRODUCTS;

export type PalaceReportProduct =
  (typeof PALACE_REPORT_PRODUCTS)[PalaceReportProductKey];

/** Pre–two-tier products — webhook / stored purchases only. */
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
  full: {
    id: "palace-report-full",
    title: "十二宮網上小師傅命書全集",
    priceCents: 68_800,
    maxPalaces: 12,
  },
} as const;

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

export function getPalaceReportProduct(
  key: PalaceReportProductKey,
): PalaceReportProduct {
  return PALACE_REPORT_PRODUCTS[key];
}

export function storageSlotForTier(tier: PalaceReportTier): string {
  return ANNUAL_REPORT_SLOT[tier];
}

export function tierFromStorageSlot(slot: string): PalaceReportTier | null {
  if (slot === ANNUAL_REPORT_SLOT.brief) return "brief";
  if (slot === ANNUAL_REPORT_SLOT.detailed) return "detailed";
  return null;
}
