import type { DateRating } from "./types";
import type { WeddingCeremonyDef } from "./event-types";
import { jiListMatches, passesYiFilter } from "./event-types";
import {
  checkPersonalClash,
  hasSevereUnluckyStar,
  severeUnluckyLabels,
} from "./clash";
import type { BirthInput } from "@/lib/ziwei/types";

export interface DayScoreInput {
  ceremony: WeddingCeremonyDef;
  personA: BirthInput;
  personB: BirthInput;
  yi: string[];
  ji: string[];
  unluckyStars: string[];
  dayChongAnimal: string;
}

export interface DayScoreResult {
  passes: boolean;
  score: number;
  rating: DateRating;
  notes: string[];
  warnings: string[];
}

function ratingFromScore(score: number): DateRating {
  if (score >= 75) return "大吉";
  if (score >= 55) return "吉";
  if (score >= 35) return "平";
  return "凶";
}

export function scoreWeddingDay(input: DayScoreInput): DayScoreResult {
  const notes: string[] = [];
  const warnings: string[] = [];
  const score = 60;

  if (!passesYiFilter(input.yi, input.ceremony.requiredYi)) {
    return {
      passes: false,
      score: 0,
      rating: "凶",
      notes: ["黃曆未見相應宜事"],
      warnings: [],
    };
  }

  notes.push(`宜：${input.yi.slice(0, 4).join("、")}`);

  if (jiListMatches(input.ji, input.ceremony.forbiddenJi)) {
    return {
      passes: false,
      score: 0,
      rating: "凶",
      notes: ["日忌與儀式相沖"],
      warnings: [`忌：${input.ji.slice(0, 4).join("、")}`],
    };
  }

  if (hasSevereUnluckyStar(input.unluckyStars)) {
    const labels = severeUnluckyLabels(input.unluckyStars);
    return {
      passes: false,
      score: 0,
      rating: "凶",
      notes: ["逢大凶神煞"],
      warnings: labels.map((l) => `凶煞：${l}`),
    };
  }

  const clash = checkPersonalClash(input.dayChongAnimal, input.personA, input.personB);
  if (clash.blocked) {
    return {
      passes: false,
      score: 0,
      rating: "凶",
      notes: ["冲新人生肖"],
      warnings: clash.warnings,
    };
  }

  const rating = ratingFromScore(score);

  return {
    passes: true,
    score,
    rating,
    notes,
    warnings,
  };
}
