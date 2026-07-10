import type { PalaceName, ChartPlateType } from "@/lib/ziwei/types";
import { PALACES } from "@/lib/ziwei/types";

export type ChartLayoutId = "1" | "2" | "3" | "4" | "5";

export const CHART_LAYOUTS: {
  id: ChartLayoutId;
  name: string;
  desc: string;
  recommended?: boolean;
}[] = [
  { id: "5", name: "焦點詳解", desc: "推薦 · 揀宮 + 小徒弟贈言一屏睇晒", recommended: true },
  { id: "1", name: "卡片網格", desc: "2–4 欄卡片總覽" },
  { id: "3", name: "清單列表", desc: "逐宮橫列 · 易於掃讀" },
  { id: "2", name: "傳統方盤", desc: "四方形命盤 · 中宮總覽" },
  { id: "4", name: "評分排行", desc: "按分數高低排序" },
];

export function parseChartLayout(raw: string | string[] | undefined): ChartLayoutId {
  const v = typeof raw === "string" ? raw : raw?.[0];
  if (v === "1" || v === "2" || v === "3" || v === "4") return v;
  return "5";
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

/** 保留出生資料同 layout，改 focus / layout / plate 等參數 */
export function buildChartHref(
  sp: Record<string, string | string[] | undefined>,
  overrides: {
    layout?: ChartLayoutId;
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
  if (overrides.layout) params.set("layout", overrides.layout);
  else if (first(sp, "layout")) params.set("layout", first(sp, "layout")!);
  if (overrides.focus) params.set("focus", overrides.focus);
  if (overrides.plate) params.set("plate", overrides.plate);
  else if (first(sp, "plate")) params.set("plate", first(sp, "plate")!);
  const hash = overrides.hash ? `#${overrides.hash}` : "";
  return `${base}?${params.toString()}${hash}`;
}
