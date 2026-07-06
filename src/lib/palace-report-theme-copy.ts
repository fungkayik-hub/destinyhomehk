import type { PalaceName } from "@/lib/ziwei/types";
import { PALACES } from "@/lib/ziwei/types";

export interface PalaceReportTheme {
  unlockTitle: string;
  unlockTitleEn: string;
  bullets: string[];
  bulletsEn: string[];
  /** 三宮套裝預設（若仍有空位） */
  suggestedBundle: PalaceName[];
  bundleLabel: string;
  bundleLabelEn: string;
}

const DEFAULT_BULLETS = [
  "三方四正連動分析",
  "2–3 個具體生活場景",
  "十年大限虛歲段解讀",
  "實操建議同中洲派格局",
];

const DEFAULT_BULLETS_EN = [
  "Tri-quadrant analysis",
  "2–3 life scenarios",
  "Decade luck (nominal age)",
  "Practical tips & pattern names",
];

const THEMES: Partial<Record<PalaceName, Partial<PalaceReportTheme>>> = {
  命宮: {
    unlockTitle: "解鎖命宮完整小師傅命書",
    unlockTitleEn: "Unlock full Soul Palace report",
    bullets: [
      "命格基調同主星格局深度拆解",
      "身命差異同人生大方向",
      "邊段大限命宮較活躍、配合三方四正",
      "性格優勢 + 2–3 個生活場景",
    ],
    suggestedBundle: ["命宮", "官祿宮", "財帛宮"],
    bundleLabel: "人生三宮：命 · 官 · 財",
  },
  夫妻宮: {
    unlockTitle: "付費解鎖完整姻緣運命書",
    unlockTitleEn: "Unlock full love & marriage report",
    bullets: [
      "相處模式同感情節奏",
      "適合另一半 2–3 個特質（正緣類型）",
      "此宮大限虛歲段（幾歲到幾歲感情較活躍）",
      "三方四正：福德、遷移點樣影響伴侶緣",
    ],
    suggestedBundle: ["夫妻宮", "福德宮", "遷移宮"],
    bundleLabel: "姻緣三宮：夫妻 · 福德 · 遷移",
  },
  官祿宮: {
    unlockTitle: "付費解鎖完整事業運命書",
    unlockTitleEn: "Unlock full career report",
    bullets: [
      "1–2 個具體事業方向 + 實操建議",
      "職場人際同決策風格",
      "邊段大限事業宮較活躍",
      "三方四正連動（命、財）",
    ],
    suggestedBundle: ["官祿宮", "財帛宮", "遷移宮"],
    bundleLabel: "事業三宮：官祿 · 財帛 · 遷移",
  },
  財帛宮: {
    unlockTitle: "付費解鎖完整財運命書",
    unlockTitleEn: "Unlock full wealth report",
    bullets: [
      "賺錢模式同理財習慣",
      "守財 vs 投資傾向",
      "邊段大限財帛較活躍",
      "三方四正：命、官點樣連動",
    ],
    suggestedBundle: ["財帛宮", "官祿宮", "田宅宮"],
    bundleLabel: "財務三宮：財帛 · 官祿 · 田宅",
  },
  福德宮: {
    unlockTitle: "付費解鎖內在與精神命書",
    unlockTitleEn: "Unlock inner life report",
    bullets: [
      "精神需求同生活質素",
      "情緒模式同嗜好方向",
      "大限走福德時嘅內在課題",
      "同夫妻、遷移宮連動",
    ],
    suggestedBundle: ["福德宮", "夫妻宮", "疾厄宮"],
    bundleLabel: "內在三宮：福德 · 夫妻 · 疾厄",
  },
  遷移宮: {
    unlockTitle: "付費解鎖外出與貴人命書",
    unlockTitleEn: "Unlock travel & mentors report",
    bullets: [
      "外出、變動同貴人方向",
      "留港 vs 外派/移民傾向",
      "邊段大限遷移較活躍",
      "三方四正連動",
    ],
    suggestedBundle: ["遷移宮", "官祿宮", "夫妻宮"],
    bundleLabel: "外出三宮：遷移 · 官祿 · 夫妻",
  },
  子女宮: {
    unlockTitle: "付費解鎖子女與創造力命書",
    unlockTitleEn: "Unlock children & creativity report",
    bullets: [
      "子女/後輩緣分同教養風格",
      "創造力同表達方式",
      "此宮大限虛歲段重點",
      "三方四正連動",
    ],
    suggestedBundle: ["子女宮", "夫妻宮", "田宅宮"],
    bundleLabel: "家庭三宮：子女 · 夫妻 · 田宅",
  },
  疾厄宮: {
    unlockTitle: "付費解鎖健康與作息命書",
    unlockTitleEn: "Unlock wellness report",
    bullets: [
      "體質傾向同生活習慣（唔作醫療診斷）",
      "邊段大限要特別留意作息",
      "壓力同情緒如何反映身體",
      "三方四正連動",
    ],
    suggestedBundle: ["疾厄宮", "福德宮", "父母宮"],
    bundleLabel: "健康三宮：疾厄 · 福德 · 父母",
  },
  田宅宮: {
    unlockTitle: "付費解鎖置業與家庭命書",
    unlockTitleEn: "Unlock home & property report",
    bullets: [
      "家庭環境同置業傾向",
      "居住質素同家人關係",
      "大限走田宅時嘅主題",
      "三方四正連動",
    ],
    suggestedBundle: ["田宅宮", "財帛宮", "父母宮"],
    bundleLabel: "置業三宮：田宅 · 財帛 · 父母",
  },
  父母宮: {
    unlockTitle: "付費解鎖長輩與貴人命書",
    unlockTitleEn: "Unlock parents & mentors report",
    bullets: [
      "長輩、上司緣分同相處",
      "先天福蔭同學習能力方向",
      "此宮大限虛歲段",
      "三方四正連動",
    ],
    suggestedBundle: ["父母宮", "命宮", "官祿宮"],
    bundleLabel: "貴人三宮：父母 · 命 · 官祿",
  },
  兄弟宮: {
    unlockTitle: "付費解鎖平輩與合作命書",
    unlockTitleEn: "Unlock peers & teamwork report",
    bullets: [
      "手足、同輩合作同競爭",
      "平輩關係模式",
      "此宮大限虛歲段",
      "三方四正連動",
    ],
    suggestedBundle: ["兄弟宮", "奴僕宮", "官祿宮"],
    bundleLabel: "平輩三宮：兄弟 · 奴僕 · 官祿",
  },
  奴僕宮: {
    unlockTitle: "付費解鎖人緣與團隊命書",
    unlockTitleEn: "Unlock friends & team report",
    bullets: [
      "朋友、下屬同人際助力",
      "合作同管理風格",
      "此宮大限虛歲段",
      "三方四正連動",
    ],
    suggestedBundle: ["奴僕宮", "兄弟宮", "官祿宮"],
    bundleLabel: "人緣三宮：奴僕 · 兄弟 · 官祿",
  },
};

export function getPalaceReportTheme(
  palace: PalaceName,
  locale: "zh" | "en" = "zh",
): PalaceReportTheme {
  const partial = THEMES[palace];
  const suggestedBundle =
    partial?.suggestedBundle ??
    ([palace, ...PALACES.filter((p) => p !== palace).slice(0, 2)] as PalaceName[]);

  return {
    unlockTitle:
      (locale === "en" ? partial?.unlockTitleEn : partial?.unlockTitle) ??
      (locale === "en"
        ? `Unlock full ${palace} report`
        : `解鎖【${palace}】完整小師傅命書`),
    unlockTitleEn: partial?.unlockTitleEn ?? `Unlock full ${palace} report`,
    bullets: locale === "en" ? (partial?.bulletsEn ?? DEFAULT_BULLETS_EN) : (partial?.bullets ?? DEFAULT_BULLETS),
    bulletsEn: partial?.bulletsEn ?? DEFAULT_BULLETS_EN,
    suggestedBundle,
    bundleLabel:
      (locale === "en" ? partial?.bundleLabelEn : partial?.bundleLabel) ??
      (locale === "en" ? "Pick any 3 palaces bundle" : "自選三宮套裝"),
    bundleLabelEn: partial?.bundleLabelEn ?? "Pick any 3 palaces bundle",
  };
}
