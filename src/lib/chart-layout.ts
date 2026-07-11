import type { PalaceName, ChartPlateType } from "@/lib/ziwei/types";
import { PALACES } from "@/lib/ziwei/types";

/** 命盤固定使用卡片網格（2–4 欄） */
export type ChartLayoutId = "1";

export const CHART_LAYOUT: ChartLayoutId = "1";

export function parseChartLayout(_raw?: string | string[] | undefined): ChartLayoutId {
  return CHART_LAYOUT;
}

export function getChartLayoutHint(locale: "zh" | "en" = "zh"): string {
  return locale === "en"
    ? "Palace cards · tap for analysis"
    : "十二宮卡片總覽 · 點擊宮位睇詳解";
}

export function parseChartPlate(
  raw: string | string[] | undefined,
): ChartPlateType {
  const v = typeof raw === "string" ? raw : raw?.[0];
  if (v === "earth" || v === "human") return v;
  return "heaven";
}

function first(sp: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const v = sp[key];
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v[0];
  return undefined;
}

export function parseFocusPalace(
  sp: Record<string, string | string[] | undefined>,
  defaultPalace: PalaceName = "命宮",
): PalaceName {
  const raw = first(sp, "focus");
  if (raw && PALACES.includes(raw as PalaceName)) {
    return raw as PalaceName;
  }
  return defaultPalace;
}

/** 保留出生資料，改 focus / plate 等參數（layout 固定卡片網格，唔寫入 URL） */
export function buildChartHref(
  sp: Record<string, string | string[] | undefined>,
  overrides: {
    focus?: PalaceName;
    plate?: ChartPlateType;
    hash?: string;
  } = {},
  locale: "zh" | "en" = "zh",
): string {
  const base = locale === "en" ? "/en/chart" : "/chart";
  const params = new URLSearchParams();
  for (const [key, val] of Object.entries(sp)) {
    if (key === "layout" || key === "focus" || key === "plate" || val == null) continue;
    if (Array.isArray(val)) val.forEach((v) => params.append(key, v));
    else params.set(key, val);
  }
  if (overrides.focus) params.set("focus", overrides.focus);
  if (overrides.plate) params.set("plate", overrides.plate);
  else if (first(sp, "plate")) params.set("plate", first(sp, "plate")!);
  const hash = overrides.hash ? `#${overrides.hash}` : "";
  return `${base}?${params.toString()}${hash}`;
}
