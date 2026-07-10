import type { ZiWeiChart } from "./types";

/** 十天干生年四化（祿權科忌順序）— 與 iztro / 文墨天機預設表一致 */
export const BIRTH_YEAR_MUTAGEN_TABLE: Record<
  string,
  { star: string; label: "祿" | "權" | "科" | "忌" }[]
> = {
  甲: [
    { star: "廉貞", label: "祿" },
    { star: "破軍", label: "權" },
    { star: "武曲", label: "科" },
    { star: "太陽", label: "忌" },
  ],
  乙: [
    { star: "天機", label: "祿" },
    { star: "天梁", label: "權" },
    { star: "紫微", label: "科" },
    { star: "太陰", label: "忌" },
  ],
  丙: [
    { star: "天同", label: "祿" },
    { star: "天機", label: "權" },
    { star: "文昌", label: "科" },
    { star: "廉貞", label: "忌" },
  ],
  丁: [
    { star: "太陰", label: "祿" },
    { star: "天同", label: "權" },
    { star: "天機", label: "科" },
    { star: "巨門", label: "忌" },
  ],
  戊: [
    { star: "貪狼", label: "祿" },
    { star: "太陰", label: "權" },
    { star: "右弼", label: "科" },
    { star: "天機", label: "忌" },
  ],
  己: [
    { star: "武曲", label: "祿" },
    { star: "貪狼", label: "權" },
    { star: "天梁", label: "科" },
    { star: "文曲", label: "忌" },
  ],
  庚: [
    { star: "太陽", label: "祿" },
    { star: "武曲", label: "權" },
    { star: "太陰", label: "科" },
    { star: "天同", label: "忌" },
  ],
  辛: [
    { star: "巨門", label: "祿" },
    { star: "太陽", label: "權" },
    { star: "文曲", label: "科" },
    { star: "文昌", label: "忌" },
  ],
  壬: [
    { star: "天梁", label: "祿" },
    { star: "紫微", label: "權" },
    { star: "左輔", label: "科" },
    { star: "武曲", label: "忌" },
  ],
  癸: [
    { star: "破軍", label: "祿" },
    { star: "巨門", label: "權" },
    { star: "太陰", label: "科" },
    { star: "貪狼", label: "忌" },
  ],
};

export function mutagenLabelShort(mutagen?: string): "祿" | "權" | "科" | "忌" | null {
  if (!mutagen) return null;
  if (mutagen.includes("祿")) return "祿";
  if (mutagen.includes("權")) return "權";
  if (mutagen.includes("科")) return "科";
  if (mutagen.includes("忌")) return "忌";
  return null;
}

export const MUTAGEN_BADGE_CLASS: Record<"祿" | "權" | "科" | "忌", string> = {
  祿: "bg-emerald-500/15 text-emerald-700 border-emerald-500/35",
  權: "bg-red-500/15 text-red-700 border-red-500/35",
  科: "bg-sky-500/15 text-sky-800 border-sky-500/35",
  忌: "bg-purple-900/15 text-purple-900 border-purple-900/35",
};

export function getBirthYearStem(chart: ZiWeiChart): string {
  return chart.heavenlyStemYear || chart.chineseDate.split(" ")[0]?.[0] || "";
}

export function getBirthYearMutagenTable(chart: ZiWeiChart) {
  const stem = getBirthYearStem(chart);
  return BIRTH_YEAR_MUTAGEN_TABLE[stem] ?? [];
}

/** 盤上實際飛到邊粒星（由 iztro 標記） */
export function collectFlyingMutagens(chart: ZiWeiChart) {
  const items: { palace: string; star: string; label: "祿" | "權" | "科" | "忌" }[] = [];
  for (const palace of chart.palaces) {
    for (const star of palace.stars) {
      const label = mutagenLabelShort(star.mutagen);
      if (label) {
        items.push({ palace: palace.name, star: star.name, label });
      }
    }
  }
  return items;
}
