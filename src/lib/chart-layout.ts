import type { PalaceName, ChartPlateType } from "@/lib/ziwei/types";
import { PALACES } from "@/lib/ziwei/types";

export type ChartLayoutId = "1" | "2" | "3" | "4" | "5";

export const CHART_LAYOUTS: {
  id: ChartLayoutId;
  name: string;
  desc: string;
  recommended?: boolean;
}[] = [
  { id: "2", name: "傳統方盤", desc: "四方形命盤 · 中宮總覽", recommended: true },
  { id: "5", name: "焦點詳解", desc: "揀宮 + 小徒弟贈言一屏睇晒" },
  { id: "1", name: "卡片網格", desc: "2–4 欄卡片總覽" },
  { id: "3", name: "清單列表", desc: "逐宮橫列 · 易於掃讀" },
  { id: "4", name: "評分排行", desc: "按分數高低排序" },
];

export function parseChartLayout(raw: string | string[] | undefined): ChartLayoutId {
  const v = typeof raw === "string" ? raw : raw?.[0];
  if (v === "1" || v === "3" || v === "4" || v === "5") return v;
  return "2";
}

export function getChartLayoutHint(layout: ChartLayoutId, locale: "zh" | "en" = "zh"): string {
  const hints: Record<ChartLayoutId, { zh: string; en: string }> = {
    "2": {
      zh: "傳統四方形命盤 · 點擊宮位睇小徒弟贈言",
      en: "Classic square chart · tap a palace for notes",
    },
    "5": {
      zh: "左右滑動揀宮 · 小徒弟逐宮贈你幾句，越睇越清楚",
      en: "Swipe palaces · a few free lines per palace from the apprentice",
    },
    "1": {
      zh: "十二宮卡片總覽 · 點擊宮位睇詳解",
      en: "Palace cards · tap for analysis",
    },
    "3": {
      zh: "逐宮清單 · 點擊橫列睇該宮贈言",
      en: "Palace list · tap a row for notes",
    },
    "4": {
      zh: "按評分高低排序 · 點擊睇該宮詳解",
      en: "Ranked by score · tap for palace notes",
    },
  };
  return locale === "en" ? hints[layout].en : hints[layout].zh;
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
