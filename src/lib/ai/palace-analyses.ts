import type { PalaceInfo, PalaceName, ZiWeiChart } from "@/lib/ziwei/types";
import { PALACES } from "@/lib/ziwei/types";
import { computeChartInsights, type ChartInsights } from "./chart-insights";
import {
  PALACE_FALLBACK_CLIFF,
  PALACE_PROMPT_RULES,
} from "./palace-prompt-rules";
import type { PalaceAnalysis, PalaceScore } from "./types";
import {
  FREE_PALACE_COPY_HARD_MIN,
  finalizeFreePalaceCopy,
} from "./free-palace-copy-limits";
import { scoreToLabel } from "./palace-scores";
import {
  lookupStarPalaceMeaning,
  primaryStarPalaceMeaning,
} from "./star-palace-meanings";


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

/** 主星 → 生活場景（令贈言更立體） */
const STAR_LIFE_SCENES: Record<
  string,
  { praise: string; scene: string; habit: string }
> = {
  紫微: {
    praise: "有主見、識帶隊，重面子但亦有擔當",
    scene: "開會或做決定時，你多數唔想被人指指點點，寧願自己拍板",
    habit: "身邊人會覺得你「有格局」，但有時嫌你太快定論",
  },
  天機: {
    praise: "腦轉得快、點子多，善於諗計",
    scene: "遇到問題你會先諗三個方案，再揀最靈活嗰個",
    habit: "有時諗得太快，身邊人未必跟得上你節奏",
  },
  太陽: {
    praise: "熱心、肯付出，重名聲同義氣",
    scene: "朋友有事第一個搵你，你也樂意幫手出面",
    habit: "幫人幫得多，自己要學識收放，唔好勞心過度",
  },
  武曲: {
    praise: "務實、講效率，對錢同執行力敏感",
    scene: "買嘢、做決定都會問「值唔值得」「有冇回報」",
    habit: "唔鍾意拖泥帶水，合作夥伴最好同你一樣爽快",
  },
  天同: {
    praise: "隨和、重享受，人緣通常唔錯",
    scene: "你擅長令氣氛舒服，唔鍾意硬碰硬",
    habit: "太舒服嘅環境會令你慢啲行動，要適度逼自己一步",
  },
  廉貞: {
    praise: "有魅力、重感情，規矩同執著並存",
    scene: "對在乎嘅人會好投入，對唔在乎嘅事可以好冷淡",
    habit: "感情同原則撞車時，你會好難妥協",
  },
  天府: {
    praise: "穩陣、識守，擅長管理資源",
    scene: "你習慣先諗清楚再郁，唔鍾意冒無謂嘅險",
    habit: "守成能力強，但要留意唔好錯過該變嘅時候",
  },
  太陰: {
    praise: "細心、感性，內斂但觀察力強",
    scene: "你會留意細節同氣氛，靜中往往看得更清",
    habit: "心事多時會收埋，要學識適度講出嚟",
  },
  貪狼: {
    praise: "學嘢快、社交活躍，多才多藝",
    scene: "對新鮮事好奇，容易同唔同圈子都混得熟",
    habit: "興趣多，要揀定一兩樣深耕先易出成績",
  },
  巨門: {
    praise: "口才好、分析力強，講嘢有說服力",
    scene: "你習慣問清楚、講清楚，唔鍾意含糊帶過",
    habit: "有時講得太直，要留意對方感受",
  },
  天相: {
    praise: "公正、重形象，善於協調",
    scene: "朋友鬧交你常做中間人，想兩邊都公道",
    habit: "太顧全大局時，會委屈自己少少",
  },
  天梁: {
    praise: "長者緣、逢凶化吉感，肯助人解難",
    scene: "遇事你會先諗「點樣化解、點樣帮人」，唔係第一眼就硬碰",
    habit: "朋友有事愛搵你商量；你有時會講道理講得多，但心底係為人好",
  },
  七殺: {
    praise: "行動派、膽識夠，危機時反而醒",
    scene: "諗到就做，唔鍾意等別人慢慢磨",
    habit: "壓力大時會自己扛，要學識分擔",
  },
  破軍: {
    praise: "開創、敢變，破舊立新能力強",
    scene: "一成不變會令你悶，轉工、轉方向對你唔陌生",
    habit: "變動多時要守好基本盤，唔好淨係追新",
  },
};

export function isAnalysisTooThin(text: string, _palace: PalaceName): boolean {
  return text.trim().length < FREE_PALACE_COPY_HARD_MIN;
}

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

function fallbackMingAnalysis(palace: PalaceInfo, insights: ChartInsights): string {
  const stars = majorStarsText(palace);
  const tag = soulPalaceTag(palace);
  const major = palace.stars.find((s) => s.type !== "minor");
  const life = major ? STAR_LIFE_SCENES[major.name] : null;
  const palaceMeaning = major
    ? lookupStarPalaceMeaning(major.name, "命宮")
    : null;

  const opening = `徒弟按命宮講 — ${stars}坐命，「${tag}」。`;
  const praise = palaceMeaning
    ? palaceMeaning
    : life
      ? life.praise
      : "空宮借星，變通力係特色。";
  const scene = life ? life.scene : "你擅長因應環境調整自己。";
  const patternHint =
    insights.patterns.find((p) => p.type === "吉")?.slug ??
    insights.mingComboTag ??
    "";
  const patternBit = patternHint ? `盤面有${patternHint}傾向，宜發揮主星優勢。` : "";

  const close = PALACE_FALLBACK_CLIFF.命宮;

  return finalizeFreePalaceCopy(
    [opening, praise, scene, patternBit, close].filter(Boolean).join(""),
  );
}

function scoreToneNote(palace: PalaceInfo, score?: PalaceScore): string {
  const level = score?.score ?? null;
  const label = score?.label ?? (level != null ? scoreToLabel(level) : null);
  const major = palace.stars.find((s) => s.type !== "minor");
  const weak =
    major?.brightness === "陷" ||
    major?.brightness === "不" ||
    (level != null && level < 55) ||
    label === "需注意" ||
    label === "待加強";
  const strong =
    (level != null && level >= 70) || label === "極佳" || label === "佳";

  if (strong) {
    return `呢宮評級${label ?? "佳"}，優勢要賺到 — 宜主動發揮呢方面潛力。`;
  }
  if (weak) {
    const area = PALACE_PROMPT_RULES[palace.name].theme.split("、")[0];
    return `呢宮評級${label ?? "需注意"}，宜特別留意「${area}」節奏 — 唔使驚，用「宜／穩陣」心態調整就得。`;
  }
  return "";
}

function fallbackPalaceAnalysis(
  palace: PalaceInfo,
  insights?: ChartInsights,
  score?: PalaceScore,
): string {
  const stars = majorStarsText(palace);
  const theme = PALACE_PROMPT_RULES[palace.name].theme;
  const empty =
    palace.stars.filter((s) => s.type !== "minor").length === 0
      ? "此宮空宮，借對宮星力，變通同適應力反而係你優勢。"
      : "";
  const cliff = PALACE_FALLBACK_CLIFF[palace.name];
  const tone = scoreToneNote(palace, score);

  if (palace.isSoulPalace && insights) {
    const base = fallbackMingAnalysis(palace, insights);
    return tone ? finalizeFreePalaceCopy(`${base}${tone}`) : base;
  }

  const major = palace.stars.find((s) => s.type !== "minor");
  const starMeaning = primaryStarPalaceMeaning(palace);
  const meaningBit = starMeaning ?? "";

  if (palace.name === "官祿宮") {
    const direction = careerDirectionByMajor(major?.name);
    return finalizeFreePalaceCopy(
      `${palace.name}主星${stars}，事業宜留意${direction}。${meaningBit}${empty}${tone}${cliff}`,
    );
  }

  if (palace.name === "夫妻宮") {
    const traits = partnerTraitsByMajor(major?.name);
    return finalizeFreePalaceCopy(
      `${palace.name}主星${stars}，相處節奏要溝通；伴侶類型偏向${traits.split("、")[0]}等。${meaningBit}${tone}${cliff}`,
    );
  }

  if (palace.name === "遷移宮") {
    const tianJiXian = palace.stars.some(
      (s) => s.name === "天機" && s.brightness === "陷",
    );
    if (tianJiXian) {
      return finalizeFreePalaceCopy(
        `${palace.name}天機入陷，外出易有漂泊感，方向要留心。${meaningBit}${tone}${cliff}`,
      );
    }
    return finalizeFreePalaceCopy(
      `${palace.name}主星${stars}。${meaningBit}${empty}${tone}${cliff}`,
    );
  }

  return finalizeFreePalaceCopy(
    `${palace.name}主星${stars}，${theme.split("、")[0]}方面：${meaningBit}${empty}${tone}${cliff}`,
  );
}

export function fallbackPalaceAnalyses(
  chart: ZiWeiChart,
  scores?: PalaceScore[],
): PalaceAnalysis[] {
  const insights = computeChartInsights(chart);
  const scoreMap = new Map((scores ?? []).map((s) => [s.palace, s]));
  return chart.palaces.map((p) => ({
    palace: p.name,
    text: fallbackPalaceAnalysis(p, insights, scoreMap.get(p.name)),
  }));
}

export function parseMingPalaceJson(raw: string): PalaceAnalysis | null {
  const trimmed = raw.trim();
  const jsonText = trimmed.startsWith("{") || trimmed.startsWith("[")
    ? trimmed
    : trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1]?.trim() ?? null;

  if (!jsonText) return null;

  try {
    if (jsonText.startsWith("[")) {
      const arr = JSON.parse(jsonText) as { palace?: string; text?: string }[];
      const item = arr.find((a) => a.palace === "命宮") ?? arr[0];
      if (!item?.text) return null;
      return { palace: "命宮", text: finalizeFreePalaceCopy(item.text) };
    }
    const parsed = JSON.parse(jsonText) as { palace?: string; text?: string };
    if (!parsed.text) return null;
    if (parsed.palace && parsed.palace !== "命宮") return null;
    return { palace: "命宮", text: finalizeFreePalaceCopy(parsed.text) };
  } catch {
    return null;
  }
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
        text: finalizeFreePalaceCopy(item.text),
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
