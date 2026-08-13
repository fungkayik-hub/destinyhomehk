import estatesData from "@/data/estates-fengshui.json";
import { getHongKongTodayISO } from "./hong-kong-time";

export interface EstateFengShui {
  slug: string;
  name: string;
  district: string;
  region: string;
  pattern: string;
  patterns: string[];
  hook: string;
  landform: string;
  strength: string;
  caution: string;
  storyGuest: string;
  storyPlace: string;
  masterLine: string;
  mapsQuery: string;
  keepContent?: boolean;
  relatedSlug?: string;
}

interface EstatesCatalog {
  startDate: string;
  estates: EstateFengShui[];
}

const catalog = estatesData as EstatesCatalog;

export const ESTATE_DAILY_START = catalog.startDate;
export const ESTATE_FENGSHUI_LIST: readonly EstateFengShui[] = catalog.estates;

const estateSlugSet = new Set(catalog.estates.map((e) => e.slug));

/** 是否「每日一屋苑」系列文章（用於 publishedAt 排期顯示） */
export function isEstateDailySlug(slug: string): boolean {
  return estateSlugSet.has(slug);
}

function daysBetween(fromIso: string, toIso: string): number {
  const [fy, fm, fd] = fromIso.split("-").map(Number);
  const [ty, tm, td] = toIso.split("-").map(Number);
  const from = Date.UTC(fy, fm - 1, fd);
  const to = Date.UTC(ty, tm - 1, td);
  return Math.floor((to - from) / 86_400_000);
}

function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return dt.toISOString().slice(0, 10);
}

export interface EstateOfTheDay {
  estate: EstateFengShui;
  /** 輪播序（0-based） */
  index: number;
  /** 該篇學堂路徑 */
  articleHref: string;
  /** 以香港「今日」計，長文是否已開放 */
  isUnlocked: boolean;
  /** 該屋苑首次排期日 */
  publishDate: string;
}

/**
 * 由香港日期決定「今日屋苑」—— 由 startDate 起每日 1 個，到期後循環。
 * startDate 之前回傳 null。
 */
export function getEstateOfTheDay(
  date = getHongKongTodayISO(),
  today = getHongKongTodayISO(),
): EstateOfTheDay | null {
  const list = ESTATE_FENGSHUI_LIST;
  if (!list.length) return null;

  const offset = daysBetween(ESTATE_DAILY_START, date);
  if (offset < 0) return null;

  const index = offset % list.length;
  const estate = list[index];
  const publishDate = addDays(ESTATE_DAILY_START, index);
  // 已有長文（keepContent）或已到首次排期日 → 可連去學堂
  const isUnlocked = Boolean(estate.keepContent) || today >= publishDate;

  return {
    estate,
    index,
    articleHref: `/academy/feng-shui/${encodeURIComponent(estate.slug)}`,
    isUnlocked,
    publishDate,
  };
}
