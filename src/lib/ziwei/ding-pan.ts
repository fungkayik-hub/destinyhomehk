import type { ChartPlateType, ZiWeiChart } from "./types";
import { CHART_PLATES } from "./zhongzhou-plates";

/** 命宮主星（空宮借對宮） */
export function effectiveSoulMajors(chart: ZiWeiChart): string[] {
  const soulIdx = chart.palaces.findIndex((p) => p.isSoulPalace);
  if (soulIdx < 0) return [];
  const soul = chart.palaces[soulIdx];
  const majors = soul.stars.filter((s) => s.type === "major").map((s) => s.name);
  if (majors.length > 0) return majors;
  const opposite = chart.palaces[(soulIdx + 6) % 12];
  return opposite?.stars.filter((s) => s.type === "major").map((s) => s.name) ?? [];
}

function starLine(majors: string[], map: Record<string, string>, fallback: string): string {
  for (const name of majors) {
    if (map[name]) return map[name];
  }
  return fallback;
}

const PERSONALITY: Record<string, string> = {
  紫微: "有主見、重格局，唔鍾意被人亂帶節奏",
  天機: "諗得快、變通強，好奇心重",
  太陽: "外向熱心，做事光明正大，愛幫人",
  武曲: "務實果斷，重效率同結果",
  天同: "隨和易相處，重感受同生活質素",
  廉貞: "愛恨分明，有原則，內心火力強",
  天府: "穩重守成，擅長管資源，唔愛冒險",
  太陰: "細膩敏感，內斂，觀察力強",
  貪狼: "多才多藝，社交靈活，慾望同學習力旺",
  巨門: "口才好、分析力強，要留意口舌",
  天相: "忠厚公正，善協調，重信譽",
  天梁: "有長者之風，能化解危機，肯幫人",
  七殺: "剛強果斷，行動快，抗壓力高",
  破軍: "改革慾強，唔滿足舊框架，敢破敢立",
};

const CAREER: Record<string, string> = {
  紫微: "適合統籌、管理、策劃帶隊",
  天機: "適合幕後參謀、策劃、技術變通",
  太陽: "適合對外、公關、教育、要見人嘅工作",
  武曲: "適合金融、工程、營運、管預算",
  天同: "適合服務、休閒、醫護、人力資源",
  廉貞: "適合法務、行政、要規矩同判斷力嘅崗位",
  天府: "適合財務、庫存、穩健型管理",
  太陰: "適合策劃、藝術、夜間或幕後工作",
  貪狼: "適合銷售、演藝、創業、要人脈嘅行業",
  巨門: "適合法律、傳媒、研究、講解",
  天相: "適合中介、人事、品牌信譽相關",
  天梁: "適合顧問、醫藥、教育、危機處理",
  七殺: "適合軍警、工程、開拓、競爭性行業",
  破軍: "適合改革、科技、設計、轉型項目",
};

const RELATIONSHIP: Record<string, string> = {
  紫微: "感情上要學柔軟，唔好將管理口吻帶入親密關係",
  天機: "心思細密但易多疑，要坦白溝通",
  太陽: "付出多、熱心，但要避免忽略伴侶感受",
  武曲: "重實際少甜言，學識表達情緒價值",
  天同: "人緣好、易遷就，要守住自己界線",
  廉貞: "吸引力強，感情世界複雜，宜誠實溝通",
  天府: "重穩定同安全感，伴侶關係較長情",
  太陰: "內心豐富但慢熱，需要被理解",
  貪狼: "桃花感強，重點係界線同專一",
  巨門: "講嘢直，易有誤會，宜多解釋",
  天相: "重承諾，做伴侶可靠",
  天梁: "肯照顧人，但易變長輩角色",
  七殺: "愛恨分明，要防衝動決定",
  破軍: "感情起伏大，要穩定節奏",
};

const INNER: Record<string, string> = {
  紫微: "內心要面子，怕失控，想掌握方向",
  天機: "腦裡轉不停，易焦慮，要休息",
  太陽: "要被人認同，失落時會好用力證明自己",
  武曲: "壓力大時會更硬，要學放鬆",
  天同: "怕衝突，寧願自己捱",
  廉貞: "情緒壓抑後易爆發，要學疏導",
  天府: "重安全感，怕不穩定",
  太陰: "感性、易觸景傷情，宜有獨處空間",
  貪狼: "慾望同興趣多，要防分心",
  巨門: "易鑽牛角尖，要轉換環境",
  天相: "重公平，受委屈會好耐唔釋懷",
  天梁: "愛操心，要學放手",
  七殺: "孤軍感，要有人明白佢嘅壓力",
  破軍: "不安於現狀，心入面常有「要變」",
};

export interface PlateProfile {
  plate: ChartPlateType;
  plateName: string;
  soulBranch: string;
  majorLabel: string;
  personality: string;
  career: string;
  relationship: string;
  inner: string;
}

export function buildPlateProfile(chart: ZiWeiChart, plate: ChartPlateType): PlateProfile {
  const majors = effectiveSoulMajors(chart);
  const majorLabel = majors.length > 0 ? majors.join("、") : "空宮（借對宮）";
  const meta = CHART_PLATES.find((p) => p.id === plate)!;
  const emptyFallback = "特質較難一眼睇穿，要借三方四正同人生經歷對照";

  return {
    plate,
    plateName: meta.name,
    soulBranch: chart.mingPalaceBranch,
    majorLabel,
    personality: starLine(majors, PERSONALITY, emptyFallback),
    career: starLine(majors, CAREER, "事業方向要配合大限同後天選擇"),
    relationship: starLine(majors, RELATIONSHIP, "感情模式要睇夫妻宮同大限"),
    inner: starLine(majors, INNER, "內心世界要結合福德宮一齊睇"),
  };
}

export interface DingPanQuestion {
  id: "personality" | "career" | "relationship" | "inner";
  prompt: string;
  promptEn: string;
  options: { plate: ChartPlateType; text: string; textEn: string }[];
}

export function buildDingPanQuestions(
  plates: Record<ChartPlateType, ZiWeiChart>,
): DingPanQuestion[] {
  const profiles = {
    heaven: buildPlateProfile(plates.heaven, "heaven"),
    earth: buildPlateProfile(plates.earth, "earth"),
    human: buildPlateProfile(plates.human, "human"),
  };

  const dims: {
    id: DingPanQuestion["id"];
    prompt: string;
    promptEn: string;
    pick: (p: PlateProfile) => string;
  }[] = [
    {
      id: "personality",
      prompt: "整體性格，邊句最似你？",
      promptEn: "Which best describes your overall personality?",
      pick: (p) => p.personality,
    },
    {
      id: "career",
      prompt: "事業／工作節奏，邊句最貼你？",
      promptEn: "Which fits your career rhythm best?",
      pick: (p) => p.career,
    },
    {
      id: "relationship",
      prompt: "感情同人際，邊句最貼你？",
      promptEn: "Which fits your relationships best?",
      pick: (p) => p.relationship,
    },
    {
      id: "inner",
      prompt: "內心世界，邊句最似你？",
      promptEn: "Which best describes your inner world?",
      pick: (p) => p.inner,
    },
  ];

  return dims.map((d) => ({
    id: d.id,
    prompt: d.prompt,
    promptEn: d.promptEn,
    options: (["heaven", "earth", "human"] as ChartPlateType[]).map((plate) => {
      const prof = profiles[plate];
      const detail = d.pick(prof);
      return {
        plate,
        text: `【${prof.plateName}·${prof.majorLabel}】${detail}`,
        textEn: `[${CHART_PLATES.find((p) => p.id === plate)!.nameEn}·${prof.majorLabel}] ${detail}`,
      };
    }),
  }));
}

export function scoreDingPanAnswers(
  answers: ChartPlateType[],
  tieBreak?: ChartPlateType,
): { winner: ChartPlateType; scores: Record<ChartPlateType, number> } {
  const scores: Record<ChartPlateType, number> = { heaven: 0, earth: 0, human: 0 };
  for (const a of answers) scores[a] += 1;

  const order: ChartPlateType[] = ["heaven", "earth", "human"];
  let winner: ChartPlateType = tieBreak ?? "heaven";
  let best = -1;
  for (const p of order) {
    if (scores[p] > best) {
      best = scores[p];
      winner = p;
    }
  }
  return { winner, scores };
}
