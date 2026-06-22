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

const PALACE_HOOKS: Record<PalaceName, string> = {
  命宮: "成張盤嘅核心，性格同人生方向",
  兄弟宮: "手足、同輩合作，同邊啲人夾得嚟",
  夫妻宮: "感情觀、伴侶緣分同相處模式",
  子女宮: "子女緣、後輩關係同創造力",
  財帛宮: "賺錢方式、理財習慣同金錢觀",
  疾厄宮: "體質、作息同要留意的健康習慣",
  遷移宮: "外出、變動環境同外地貴人",
  奴僕宮: "朋友、下屬同人際助力",
  官祿宮: "事業方向、工作形象同社會地位",
  田宅宮: "家庭氣氛、置業同居住運",
  福德宮: "內心世界、嗜好同精神滿足",
  父母宮: "長輩緣、上司關係同先天福蔭",
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
  const hook = PALACE_HOOKS[palace.name];
  const minors = palace.stars
    .filter((s) => s.type === "minor")
    .slice(0, 3)
    .map((s) => s.name)
    .join("、");
  const minorNote = minors ? `輔星有${minors}，會加強呢宮嘅特色。` : "";
  const empty =
    palace.stars.filter((s) => s.type !== "minor").length === 0
      ? "此宮空宮，借對宮星力，變通同適應力反而係你優勢。"
      : "";

  if (palace.isSoulPalace) {
    return `一開波睇成張盤，${hook}方面有睇頭㗎！你命宮喺${palace.earthlyBranch}，主星${stars}，性格有自己一套，唔係隨波逐流嗰種。${minorNote}${empty}祿存、化祿同三方四正仲有幾個位值得一齊睇 — 免費版先講到呢度，想知錢格、桃花定特殊格局，左右滑動睇其他宮，或者 WhatsApp 搵 Sunny 師傅全批會拆得更深。`;
  }

  return `${palace.name}主要睇${hook}。你喺${palace.earthlyBranch}，主星${stars}，喺${theme}方面有自己嘅路。${minorNote}${empty}呢度只係皮毛，配合命宮同財帛、官祿一齊睇，成張盤嘅層次會清楚好多 — 不妨左右滑動睇下一宮。`;
}

export function fallbackPalaceAnalyses(palaces: PalaceInfo[]): PalaceAnalysis[] {
  return palaces.map((p) => ({
    palace: p.name,
    text: fallbackPalaceAnalysis(p).slice(0, p.isSoulPalace ? 500 : 420),
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
        text: item.text.trim().slice(0, item.palace === "命宮" ? 500 : 420),
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
