import type { BirthInput } from "@/lib/ziwei/types";
import { canonicalZodiac, getBirthZodiac, zodiacMatches } from "./zodiac";

/** 大凶神煞 — 出現則剔除 */
export const SEVERE_UNLUCKY_STARS = new Set([
  "月破",
  "四绝",
  "四離",
  "四离",
  "四忌",
  "四废",
  "四廢",
  "受死",
  "致死",
  "重丧",
  "重喪",
  "三阴",
  "三陰",
  "纯阴",
  "純陰",
  "绝阳",
  "絕陽",
  "阴阳俱错",
  "陰陽俱錯",
]);

export interface ClashCheck {
  personA: BirthInput;
  personB: BirthInput;
  dayChongAnimal: string;
}

export function clashesPerson(dayChongAnimal: string, person: BirthInput): boolean {
  const { animal } = getBirthZodiac(person);
  return zodiacMatches(dayChongAnimal, animal);
}

export function checkPersonalClash(
  dayChongAnimal: string,
  personA: BirthInput,
  personB: BirthInput,
): { blocked: boolean; warnings: string[] } {
  const warnings: string[] = [];
  const aZodiac = canonicalZodiac(getBirthZodiac(personA).animal);
  const bZodiac = canonicalZodiac(getBirthZodiac(personB).animal);

  const clashA = clashesPerson(dayChongAnimal, personA);
  const clashB = clashesPerson(dayChongAnimal, personB);

  if (clashA) warnings.push(`冲新娘／新郎生肖（${aZodiac}）`);
  if (clashB) warnings.push(`冲新娘／新郎生肖（${bZodiac}）`);

  return {
    blocked: clashA || clashB,
    warnings,
  };
}

export function hasSevereUnluckyStar(stars: string[]): boolean {
  return stars.some((s) => SEVERE_UNLUCKY_STARS.has(s));
}

export function severeUnluckyLabels(stars: string[]): string[] {
  return stars.filter((s) => SEVERE_UNLUCKY_STARS.has(s));
}
