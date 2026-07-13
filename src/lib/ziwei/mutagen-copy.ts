import type { PalaceName, ZiWeiChart } from "./types";
import { PALACES } from "./types";
import {
  collectFlyingMutagens,
  getBirthYearMutagenTable,
  getBirthYearStem,
} from "./mutagen";

export type MutagenLabel = "祿" | "權" | "科" | "忌";

/** 四化基本義（簡述） */
export const MUTAGEN_GENERAL: Record<MutagenLabel, string> = {
  祿: "主福祿、順遂、增加 — 該宮所管事項較易有甜頭、貴人同機會。",
  權: "主權力、主動、掌控 — 該宮事項上你較敢做主、有話事權。",
  科: "主名聲、貴人、考試 — 該宮事項利名望、文書、人緣同學業。",
  忌: "主執著、波折、欠緣 — 該宮事項易反覆、糾結，宜留心調整心態。",
};

/** 化祿／權／科／忌 入十二宮 — 生活化參考（中洲派入門） */
const MUTAGEN_IN_PALACE: Record<MutagenLabel, Record<PalaceName, string>> = {
  祿: {
    命宮: "化祿入命，一生福祿較厚，衣食多不憂，性格樂觀易有貴人。未必橫財暴發，但正財路子較順，宜穩健理財。",
    兄弟宮: "化祿入兄弟，手足或同輩緣佳，合作易有甜頭，同事朋友願幫你。",
    夫妻宮: "化祿入夫妻，配偶或感情帶來福氣，伴侶多能同享福，婚姻易有實質好處。",
    子女宮: "化祿入子女，子女緣佳或晚輩帶財，創作、投資、桃花亦較順。",
    財帛宮: "化祿入財帛，正財機會多，賺錢較順，善守財者易積蓄 — 係常見嘅「有財」信號之一。",
    疾厄宮: "化祿入疾厄，體質多數尚可，有病亦易遇好醫生；但要防飲食過量。",
    遷移宮: "化祿入遷移，外出、異地發展較利，出外易有貴人同機會。",
    奴僕宮: "化祿入奴僕，朋友、下屬、客戶緣佳，合作多能互利。",
    官祿宮: "化祿入官祿，事業上易有甜頭，工作環境較順，升遷或接單機會多。",
    田宅宮: "化祿入田宅，置業、家居運佳，家庭氣氛和樂，易有祖產或置業福。",
    福德宮: "化祿入福德，精神愉快、懂得享受，晚年福氣較足。",
    父母宮: "化祿入父母，長輩、上司緣佳，易得庇蔭同提攜。",
  },
  權: {
    命宮: "化權入命，主動性強、敢決敢做，有領導慾同話事權。事業上易掌權，但要防過強勢。",
    兄弟宮: "化權入兄弟，同輩中你較有主見，兄弟或同事關係裡你常做決定者。",
    夫妻宮: "化權入夫妻，感情上你或配偶較主導，婚姻裡要學互相尊重。",
    子女宮: "化權入子女，對子女管教較嚴或有期望，創作、投資上敢搏。",
    財帛宮: "化權入財帛，理財上較有主見，敢投資、敢爭取，財來自魄力。",
    疾厄宮: "化權入疾厄，身體精力旺，但要防勞過度；有病要積極處理。",
    遷移宮: "化權入遷移，外出發展主動，異地易闖出名堂。",
    奴僕宮: "化權入奴僕，下屬、朋友服你，適合帶隊，但要防得罪人。",
    官祿宮: "化權入官祿，事業權力大，易升管理層，職場話事權高。",
    田宅宮: "化權入田宅，家中你話事多，置業上較有決斷力。",
    福德宮: "化權入福德，內心要強，精神層面自己作主，享受亦要掌控。",
    父母宮: "化權入父母，與長輩、上司關係裡較有主見，易頂撞權威。",
  },
  科: {
    命宮: "化科入命，重名聲信譽，利考試、學業、公關。給人斯文有修養之感，貴人緣佳。",
    兄弟宮: "化科入兄弟，同輩中人緣好，兄弟姊妹或同事關係和諧。",
    夫妻宮: "化科入夫妻，配偶多斯文有禮，感情重溝通同體面。",
    子女宮: "化科入子女，子女聰明好學，或創作、名氣來自才華。",
    財帛宮: "化科入財帛，財來自名聲、專業或文書合約，利正當收入。",
    疾厄宮: "化科入疾厄，有病易遇良醫，亦要留意過度用腦、失眠。",
    遷移宮: "化科入遷移，外出名聲好，異地發展利名望同貴人。",
    奴僕宮: "化科入奴僕，朋友、下屬素質佳，人際口碑好。",
    官祿宮: "化科入官祿，事業重名聲，利考試、升學、專業資格。",
    田宅宮: "化科入田宅，家居斯文，置業多經深思熟慮。",
    福德宮: "化科入福德，精神追求高雅，喜學習、藝術或宗教。",
    父母宮: "化科入父母，長輩、上司多文化修養，易得提攜。",
  },
  忌: {
    命宮: "化忌入命，內心較執著，人生波折感較強，易鑽牛角尖。非注定不好，宜學放鬆，配合大限可化解。",
    兄弟宮: "化忌入兄弟，手足或同輩易有誤會、競爭，合作要講清楚。",
    夫妻宮: "化忌入夫妻，感情易有波折、猜疑，要多溝通，忌冷戰。",
    子女宮: "化忌入子女，為子女操心較多，或創作、投資易反覆。",
    財帛宮: "化忌入財帛，理財易糾結，有破財、漏財傾向，宜保守同記帳。",
    疾厄宮: "化忌入疾厄，要留心慢性病、情緒病，定期檢查。",
    遷移宮: "化忌入遷移，外出易有不順、小人，出門要謹慎。",
    奴僕宮: "化忌入奴僕，朋友、下屬易有誤會，借錢合作要三思。",
    官祿宮: "化忌入官祿，事業易有波折、壓力，轉工要計清楚。",
    田宅宮: "化忌入田宅，家居、置業易有煩惱，家人要多溝通。",
    福德宮: "化忌入福德，易想太多、睡不好，要學減壓。",
    父母宮: "化忌入父母，與長輩、上司易有代溝或操心，宜主動關心。",
  },
};

/** 個別主星化四化 — 加味（可選） */
const STAR_MUTAGEN_FLAVOR: Partial<Record<string, Partial<Record<MutagenLabel, string>>>> = {
  太陰: {
    科: "太陰本主溫柔財庫，化科在命尤利女性緣、藝術審美同夜間靈感。",
    祿: "太陰化祿，財來自穩健、房產或女性貴人，宜守財。",
    忌: "太陰化忌，情緒易陰晴不定，感情同家庭要多體諒。",
  },
  太陽: {
    祿: "太陽化祿，名望帶財，利公職、對外發展。",
    忌: "太陽化忌，要防過勞、眼睛同父親緣。",
  },
  武曲: {
    祿: "武曲化祿，正財旺，利金融、實業、管理財務。",
    忌: "武曲化忌，理財易固執或破財，投資忌賭。",
  },
  貪狼: {
    祿: "貪狼化祿，桃花財並存，社交、娛樂行業易有甜頭。",
    忌: "貪狼化忌，欲望易過火，感情、投資要自律。",
  },
  巨門: {
    權: "巨門化權，口才變話事權，利律師、銷售、傳媒，但要防口舌。",
    忌: "巨門化忌，易有誤會、是非，講嘢要留三分。",
  },
  破軍: {
    祿: "破軍化祿，先破後立，變動中見財，利創業、轉行。",
  },
  廉貞: {
    祿: "廉貞化祿，桃花帶財，利人際、公關行業。",
    忌: "廉貞化忌，感情、合約易有糾紛。",
  },
  天機: {
    祿: "天機化祿，腦筋轉數快，策劃、顧問、科技易有收入。",
    忌: "天機化忌，想太多、決策易反覆。",
  },
  天同: {
    祿: "天同化祿，享福安逸，衣食無憂但宜防懶散。",
    忌: "天同化忌，情緒起伏，要有人陪傾。",
  },
  天梁: {
    祿: "天梁化祿，逢凶化吉，長輩、醫藥、顧問緣佳。",
  },
  紫微: {
    權: "紫微化權，領導氣質強，易掌大權。",
    科: "紫微化科，名望尊貴，利公眾形象。",
  },
};

export interface MutagenAnalysisItem {
  star: string;
  label: MutagenLabel;
  palace: PalaceName;
  general: string;
  inPalace: string;
  starFlavor?: string;
}

export interface MutagenSummary {
  yearStem: string;
  table: { star: string; label: MutagenLabel }[];
  flying: MutagenAnalysisItem[];
  highlight?: string;
}

export function getMutagenInPalaceHint(label: MutagenLabel, palace: PalaceName): string {
  return MUTAGEN_IN_PALACE[label][palace];
}

export function getStarMutagenFlavor(star: string, label: MutagenLabel): string | undefined {
  return STAR_MUTAGEN_FLAVOR[star]?.[label];
}

export function buildMutagenAnalysis(
  star: string,
  label: MutagenLabel,
  palace: PalaceName,
): MutagenAnalysisItem {
  return {
    star,
    label,
    palace,
    general: MUTAGEN_GENERAL[label],
    inPalace: getMutagenInPalaceHint(label, palace),
    starFlavor: getStarMutagenFlavor(star, label),
  };
}

/** 生年四化完整分析（飛星位置 + 解讀） */
export function buildMutagenSummary(chart: ZiWeiChart): MutagenSummary | null {
  const yearStem = getBirthYearStem(chart);
  const table = getBirthYearMutagenTable(chart);
  if (table.length === 0) return null;

  const flyingRaw = collectFlyingMutagens(chart);
  const flying: MutagenAnalysisItem[] = [];

  for (const { star, label } of table) {
    const hit = flyingRaw.find((f) => f.star === star && f.label === label);
    const palace = hit?.palace as PalaceName | undefined;
    if (palace && PALACES.includes(palace)) {
      flying.push(buildMutagenAnalysis(star, label, palace));
    }
  }

  const mingLu = flying.find((f) => f.label === "祿" && f.palace === "命宮");
  const mingJi = flying.find((f) => f.label === "忌" && f.palace === "命宮");
  const caiLu = flying.find((f) => f.label === "祿" && f.palace === "財帛宮");

  let highlight: string | undefined;
  if (mingLu) {
    highlight = `你嘅生年化祿飛入命宮（${mingLu.star}化祿），傳統上多主一生福祿較厚、衣食較不憂，係「有財有福」嘅常見信號之一 — 實際仍要睇全盤同大限。`;
  } else if (caiLu) {
    highlight = `你嘅生年化祿飛入財帛宮（${caiLu.star}化祿），正財機會較多，理財得當易積財。`;
  } else if (mingJi) {
    highlight = `你嘅生年化忌飛入命宮（${mingJi.star}化忌），人生課題較在「執著同波折」，唔代表差，宜配合大限流年調整心態 — 師傅全批可深入講化解方向。`;
  }

  return { yearStem, table, flying, highlight };
}
