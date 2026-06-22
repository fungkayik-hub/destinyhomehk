export type ZodiacStatus = "highlight" | "stable" | "caution";

export interface ZodiacHint {
  name: string;
  emoji: string;
  branch: string;
  label: string;
  status: ZodiacStatus;
}

export interface DailyAlmanac {
  date: string;
  solarLabel: string;
  weekday: string;
  ganzhi: {
    year: string;
    month: string;
    day: string;
  };
  lunarLabel: string;
  dayOfficer: string;
  dayOfficerFull: string;
  tianShen: string;
  tianShenLuck: string;
  headline: string;
  specialTip: string;
  masterTip: string;
  luckyStars: string[];
  unluckyStars: string[];
  starNote: string;
  yi: string[];
  ji: string[];
  zodiacs: ZodiacHint[];
  closing: string;
  quote: string;
  chong: string;
  sha: string;
}
