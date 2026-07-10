import type { BirthInput } from "@/lib/ziwei/types";

/** 結婚儀式類型（10 種） */
export type WeddingCeremonyId =
  | "wedding"
  | "bed-setting"
  | "betrothal"
  | "bride-departure"
  | "bride-entry"
  | "banquet"
  | "registration"
  | "ancestor-worship"
  | "return-visit"
  | "engagement";

export interface WeddingDatePickerInput {
  ceremonyId: WeddingCeremonyId;
  startDate: string;
  endDate: string;
  personA: BirthInput;
  personB: BirthInput;
}

export type DateRating = "大吉" | "吉" | "平" | "凶";

export interface ScoredWeddingDate {
  date: string;
  solarLabel: string;
  weekday: string;
  lunarDate: string;
  dayOfficer: string;
  score: number;
  rating: DateRating;
  yi: string[];
  ji: string[];
  luckyStars: string[];
  unluckyStars: string[];
  chong: string;
  notes: string[];
  warnings: string[];
}

export interface WeddingDatePickerResult {
  ceremonyId: WeddingCeremonyId;
  ceremonyLabel: string;
  startDate: string;
  endDate: string;
  totalDaysScanned: number;
  matchCount: number;
  dates: ScoredWeddingDate[];
  personAZodiac: string;
  personBZodiac: string;
}
