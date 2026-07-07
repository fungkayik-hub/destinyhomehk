import type { WeddingCeremonyId } from "./types";

export interface WeddingCeremonyDef {
  id: WeddingCeremonyId;
  label: string;
  description: string;
  /** 至少命中一項先算通過黃曆篩選 */
  requiredYi: string[][];
  /** 日忌出現則扣分／剔除 */
  forbiddenJi: string[];
}

/** 宜忌關鍵字別名（簡繁／異體） */
export const YI_ALIASES: Record<string, string[]> = {
  嫁娶: ["嫁娶"],
  纳采: ["纳采", "納采"],
  订盟: ["订盟", "訂盟"],
  訂盟: ["订盟", "訂盟"],
  安床: ["安床"],
  出行: ["出行"],
  入宅: ["入宅"],
  会亲友: ["会亲友", "會親友"],
  祭祀: ["祭祀"],
  归宁: ["归宁", "歸寧"],
  问名: ["问名", "問名"],
  冠笄: ["冠笄"],
  开市: ["开市", "開市"],
  求嗣: ["求嗣"],
};

export function yiListMatches(items: string[], keywords: string[]): boolean {
  const normalizedItems = items.map((x) => x.trim());
  return keywords.some((kw) => {
    const aliases = YI_ALIASES[kw] ?? [kw];
    return aliases.some((alias) => normalizedItems.includes(alias));
  });
}

/** 至少一組宜忌關鍵字命中（組內為 OR） */
export function passesYiFilter(items: string[], groups: string[][]): boolean {
  if (groups.length === 0) return true;
  return groups.some((group) => yiListMatches(items, group));
}

export function jiListMatches(items: string[], keywords: string[]): boolean {
  return yiListMatches(items, keywords);
}

const COMMON_WEDDING_FORBIDDEN_JI = [
  "嫁娶",
  "安葬",
  "破土",
  "动土",
  "動土",
  "入殓",
  "入殮",
  "开市",
  "開市",
  "出行",
  "移徙",
  "修造",
  "作灶",
];

/** 結婚擇日 — 10 種儀式 */
export const WEDDING_CEREMONIES: WeddingCeremonyDef[] = [
  {
    id: "wedding",
    label: "嫁娶（主婚禮）",
    description: "迎娶、拜堂、主婚禮儀式",
    requiredYi: [["嫁娶"]],
    forbiddenJi: ["安葬", "破土", "动土", "動土", "入殓", "入殮"],
  },
  {
    id: "bed-setting",
    label: "上頭／安床",
    description: "新娘上頭、新房安床",
    requiredYi: [["安床"]],
    forbiddenJi: [...COMMON_WEDDING_FORBIDDEN_JI.filter((x) => x !== "嫁娶")],
  },
  {
    id: "betrothal",
    label: "過大禮／納采",
    description: "男家送禮、納采問聘",
    requiredYi: [["纳采", "订盟"]],
    forbiddenJi: ["安葬", "破土", "动土", "動土", "嫁娶"],
  },
  {
    id: "bride-departure",
    label: "出門（新娘出閨）",
    description: "新娘離開孃家出發",
    requiredYi: [["出行", "嫁娶"]],
    forbiddenJi: ["安葬", "破土", "动土", "動土", "入殓", "入殮"],
  },
  {
    id: "bride-entry",
    label: "入門（入宅）",
    description: "新娘入男家、入新房",
    requiredYi: [["入宅"]],
    forbiddenJi: ["安葬", "破土", "动土", "動土", "入殓", "入殮"],
  },
  {
    id: "banquet",
    label: "擺酒／開席",
    description: "婚宴、酒樓開席",
    requiredYi: [["会亲友", "嫁娶"]],
    forbiddenJi: ["安葬", "破土", "动土", "動土", "入殓", "入殮"],
  },
  {
    id: "registration",
    label: "註冊結婚",
    description: "婚姻註冊處簽紙",
    requiredYi: [["嫁娶", "订盟"]],
    forbiddenJi: ["安葬", "破土", "动土", "動土"],
  },
  {
    id: "ancestor-worship",
    label: "拜祖先",
    description: "過大禮或婚禮前拜祖先",
    requiredYi: [["祭祀"]],
    forbiddenJi: ["安葬", "破土", "动土", "動土", "嫁娶"],
  },
  {
    id: "return-visit",
    label: "回門",
    description: "婚後新娘回孃家",
    requiredYi: [["归宁"]],
    forbiddenJi: ["安葬", "破土", "动土", "動土", "入殓", "入殮"],
  },
  {
    id: "engagement",
    label: "訂婚／文定",
    description: "訂婚、文定、問名",
    requiredYi: [["订盟", "纳采", "问名"]],
    forbiddenJi: ["安葬", "破土", "动土", "動土", "嫁娶"],
  },
];

export function getWeddingCeremony(id: WeddingCeremonyId): WeddingCeremonyDef {
  const found = WEDDING_CEREMONIES.find((c) => c.id === id);
  if (!found) return WEDDING_CEREMONIES[0];
  return found;
}

export const DEFAULT_CEREMONY_ID: WeddingCeremonyId = "wedding";
