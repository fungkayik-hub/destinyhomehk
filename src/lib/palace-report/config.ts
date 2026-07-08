export const PALACE_REPORT_PRODUCTS = {
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

export type PalaceReportProductKey = keyof typeof PALACE_REPORT_PRODUCTS;

export type PalaceReportProduct =
  (typeof PALACE_REPORT_PRODUCTS)[PalaceReportProductKey];

export function findPalaceReportProduct(
  productId: string,
): PalaceReportProduct | undefined {
  return Object.values(PALACE_REPORT_PRODUCTS).find((p) => p.id === productId);
}

export function getPalaceReportProduct(
  key: PalaceReportProductKey,
): PalaceReportProduct {
  return PALACE_REPORT_PRODUCTS[key];
}
