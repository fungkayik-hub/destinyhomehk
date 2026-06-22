/** iztro 時辰索引對照 */
export const SHICHEN = [
  { index: 0, name: "早子", range: "00:00–00:59", branch: "子" },
  { index: 1, name: "丑", range: "01:00–02:59", branch: "丑" },
  { index: 2, name: "寅", range: "03:00–04:59", branch: "寅" },
  { index: 3, name: "卯", range: "05:00–06:59", branch: "卯" },
  { index: 4, name: "辰", range: "07:00–08:59", branch: "辰" },
  { index: 5, name: "巳", range: "09:00–10:59", branch: "巳" },
  { index: 6, name: "午", range: "11:00–12:59", branch: "午" },
  { index: 7, name: "未", range: "13:00–14:59", branch: "未" },
  { index: 8, name: "申", range: "15:00–16:59", branch: "申" },
  { index: 9, name: "酉", range: "17:00–18:59", branch: "酉" },
  { index: 10, name: "戌", range: "19:00–20:59", branch: "戌" },
  { index: 11, name: "亥", range: "21:00–22:59", branch: "亥" },
  { index: 12, name: "晚子", range: "23:00–23:59", branch: "子" },
] as const;

/** 十二宮位 */
export const PALACES = [
  "命宮", "兄弟宮", "夫妻宮", "子女宮", "財帛宮", "疾厄宮",
  "遷移宮", "奴僕宮", "官祿宮", "田宅宮", "福德宮", "父母宮",
] as const;

export type PalaceName = (typeof PALACES)[number];
export type Gender = "male" | "female";
export type CalendarType = "solar" | "lunar";

export interface BirthInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: Gender;
  calendarType: CalendarType;
  isLeapMonth?: boolean;
}

export interface StarPlacement {
  name: string;
  palace: PalaceName;
  brightness?: "廟" | "旺" | "得" | "利" | "平" | "不" | "陷";
  type?: "major" | "minor";
  /** 四化：祿 / 權 / 科 / 忌 */
  mutagen?: string;
}

export interface PalaceInfo {
  name: PalaceName;
  earthlyBranch: string;
  heavenlyStem: string;
  stars: StarPlacement[];
  isBodyPalace?: boolean;
  isSoulPalace?: boolean;
}

export interface ZiWeiChart {
  input: BirthInput;
  solarDate: string;
  lunarDateText: string;
  chineseDate: string;
  soulStar: string;
  bodyStar: string;
  lunarDate: { year: number; month: number; day: number; isLeap: boolean };
  heavenlyStemYear: string;
  earthlyBranchYear: string;
  mingPalaceBranch: string;
  shenPalaceBranch: string;
  fiveElement: string;
  palaces: PalaceInfo[];
  summary: string;
}

export interface DatePickerInput {
  eventType: "wedding" | "business" | "moving" | "other";
  startDate: string;
  endDate: string;
  person1?: BirthInput;
  person2?: BirthInput;
}

export interface AuspiciousDate {
  date: string;
  lunarDate: string;
  score: number;
  rating: "大吉" | "吉" | "平" | "凶";
  notes: string[];
}
