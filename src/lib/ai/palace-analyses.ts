import type { PalaceInfo, PalaceName } from "@/lib/ziwei/types";
import { PALACES } from "@/lib/ziwei/types";
import type { PalaceAnalysis } from "./types";

const PALACE_THEMES: Record<PalaceName, string> = {
  命宮: "性格、處世同人生大方向",
  兄弟宮: "手足、平輩合作同競爭",
  夫妻宮: "感情、婚姻同伴侶緣分",
  子女宮: "子女、後輩同創造力",
  財帛宮: "收入、理財同金錢觀",
  疾厄宮: "健康、體質同生活習慣",
  遷移宮: "外出、環境變動同貴人",
  奴僕宮: "朋友、下屬同人際助力",
  官祿宮: "事業、工作同社會地位",
  田宅宮: "家庭、置業同居住環境",
  福德宮: "精神、嗜好同內心滿足",
  父母宮: "長輩、上司同先天福蔭",
};

function majorStarsText(palace: PalaceInfo): string {
  const majors = palace.stars.filter((s) => s.type !== "minor");
  if (majors.length === 0) return "空宮（借對宮星力）";
  return majors
    .map((s) => (s.brightness ? `${s.name}(${s.brightness})` : s.name))
    .join("、");
}

export function fallbackPalaceAnalysis(palace: PalaceInfo): string {
  const stars = majorStarsText(palace);
  const theme = PALACE_THEMES[palace.name];
  const empty =
    palace.stars.filter((s) => s.type !== "minor").length === 0
      ? "此宫空宫，宜留意对宫照会，"
      : "";

  if (palace.isSoulPalace) {
    return `一開波睇成張盤，底子有睇頭㗎！要配合祿存、化祿同三方四正睇錢格同特殊格局。你命宮喺${palace.earthlyBranch}，主星${stars}，有自己一套。想知詳細，WhatsApp 搵 Sunny 師傅定盤。`;
  }

  return `你${palace.name}喺${palace.earthlyBranch}，主星${stars}，${theme}方面有發揮位。${empty}配合成張盤一齊睇會更清楚。WhatsApp 搵 Sunny 師傅定盤。`;
}

export function fallbackPalaceAnalyses(palaces: PalaceInfo[]): PalaceAnalysis[] {
  return palaces.map((p) => ({
    palace: p.name,
    text: fallbackPalaceAnalysis(p).slice(0, 220),
  }));
}

export function parsePalaceAnalysesJson(
  raw: string,
  expected: PalaceName[],
): PalaceAnalysis[] | null {
  const trimmed = raw.trim();
  const jsonText = trimmed.startsWith("[")
    ? trimmed
    : trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1]?.trim() ?? null;

  if (!jsonText) return null;

  try {
    const parsed = JSON.parse(jsonText) as { palace?: string; text?: string }[];
    if (!Array.isArray(parsed) || parsed.length === 0) return null;

    const byName = new Map<string, PalaceAnalysis>();
    for (const item of parsed) {
      if (!item.palace || !item.text) continue;
      if (!PALACES.includes(item.palace as PalaceName)) continue;
      byName.set(item.palace, {
        palace: item.palace as PalaceName,
        text: item.text.trim().slice(0, 280),
      });
    }

    const ordered = expected
      .map((name) => byName.get(name))
      .filter((a): a is PalaceAnalysis => Boolean(a));

    return ordered.length === expected.length ? ordered : null;
  } catch {
    return null;
  }
}
