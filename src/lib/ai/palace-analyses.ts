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

const MAJOR_STAR_TAGS: Record<string, string> = {
  紫微: "帶隊型",
  天機: "腦筋派",
  太陽: "付出型",
  武曲: "實幹型",
  天同: "隨和型",
  廉貞: "魅力型",
  天府: "守成型",
  太陰: "細心型",
  貪狼: "多才型",
  巨門: "口才型",
  天相: "協調型",
  天梁: "貴人型",
  七殺: "行動派",
  破軍: "開創型",
};

function soulPalaceTag(palace: PalaceInfo): string {
  const major = palace.stars.find((s) => s.type !== "minor");
  if (!major) return "借星變通型";
  return MAJOR_STAR_TAGS[major.name] ?? "有自己路線";
}

function careerDirectionByMajor(major?: string): string {
  const map: Record<string, string> = {
    紫微: "管理、帶團隊、決策位",
    天機: "策劃、顧問、產品營運",
    太陽: "教育、銷售、品牌對外",
    武曲: "金融、營運、資源管理",
    天同: "客服、關係維護、支援協作",
    廉貞: "公關、商務、品牌合作",
    天府: "行政管理、財務後台、資產配置",
    太陰: "研究、內容、幕後規劃",
    貪狼: "市場、業務開發、自媒體/創作",
    巨門: "法律、談判、培訓、內容表達",
    天相: "人資、專案統籌、流程協調",
    天梁: "顧問、醫護、社福、教育輔導",
    七殺: "創業、業務拓展、危機處理",
    破軍: "轉型項目、新業務、開荒職位",
  };
  return major ? map[major] ?? "可試決策+執行並重崗位" : "可試彈性高、變化快工作模式";
}

function partnerTraitsByMajor(major?: string): string {
  const map: Record<string, string> = {
    紫微: "成熟穩陣、有主見、識尊重你",
    天機: "識溝通、反應快、願意一齊成長",
    太陽: "正面外向、有責任感、肯付出",
    武曲: "務實可靠、理財觀一致、守承諾",
    天同: "脾氣溫和、包容度高、重生活感",
    廉貞: "專一有分寸、情感成熟、界線清晰",
    天府: "穩定踏實、重家庭、識長遠規劃",
    太陰: "細心體貼、情緒穩定、肯聆聽",
    貪狼: "有魅力但有邊界、主動溝通、生活有火花",
    巨門: "講道理、肯傾清楚、唔冷暴力",
    天相: "公平講理、重承諾、互相支持",
    天梁: "成熟包容、有保護力、價值觀正",
    七殺: "獨立果斷、唔黐身、遇事夠穩",
    破軍: "接受變動、敢試新嘢、信任感強",
  };
  return major ? map[major] ?? "成熟穩定、肯溝通、重承諾" : "情緒穩定、肯溝通、價值觀一致";
}

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
    const tag = soulPalaceTag(palace);
    const major = palace.stars.find((s) => s.type !== "minor");
    const scene = major
      ? `做人處事會帶住${major.name}嘅味 — 唔係大路貨性格。`
      : "空宮借星，你反而擅長因應環境調整自己。";
    return `${stars}坐命，你係${tag}。${scene}${minorNote}${empty}命宮格局（錢格、桃花、權貴）要睇主星亮度同四化先準 — 免費版講到呢度，想拆深左右滑動其他宮，或者 WhatsApp 搵 Sunny 師傅全批。`;
  }

  const major = palace.stars.find((s) => s.type !== "minor");
  const tag = major ? (MAJOR_STAR_TAGS[major.name] ?? "有自己節奏") : "變通型";
  if (palace.name === "官祿宮") {
    const direction = careerDirectionByMajor(major?.name);
    return `${palace.name}管${theme}。主星${stars}，你喺工作上屬${tag}。較有利方向：${direction}。${minorNote}${empty}做法上宜揀可以自主拍板、又睇到成果嘅位，你會發揮得更順。`;
  }

  if (palace.name === "夫妻宮") {
    const traits = partnerTraitsByMajor(major?.name);
    return `${palace.name}管${theme}。主星${stars}，你喺感情上屬${tag}。適合你嘅另一半特質：${traits}。${minorNote}${empty}相處重點係講清楚節奏同期望，感情會穩定好多。`;
  }

  return `${palace.name}管${theme}。主星${stars}，你喺呢方面屬${tag}。${minorNote}${empty}呢宮點樣同你命宮性格夾，全批會拆得更清楚 — 不妨睇下一宮。`;
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
