import type { BirthInput } from "@/lib/ziwei/types";
import { DEFAULT_BIRTH_PLACE_ID } from "@/lib/ziwei/birth-places";
import { parseBirthPlaceId, parseUseTrueSolarTime } from "@/lib/parse-birth-fields";

const DEFAULT_A: BirthInput = {
  year: 1995,
  month: 6,
  day: 15,
  hour: 12,
  minute: 0,
  gender: "female",
  calendarType: "solar",
  birthPlaceId: DEFAULT_BIRTH_PLACE_ID,
  useTrueSolarTime: true,
};

const DEFAULT_B: BirthInput = {
  year: 1993,
  month: 3,
  day: 20,
  hour: 18,
  minute: 0,
  gender: "male",
  calendarType: "solar",
  birthPlaceId: DEFAULT_BIRTH_PLACE_ID,
  useTrueSolarTime: true,
};

function first(sp: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const v = sp[key];
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v[0];
  return undefined;
}

function clampInt(raw: string | undefined, fallback: number, min: number, max: number): number {
  const n = parseInt(raw ?? "", 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function normalizeBirthInput(input: BirthInput): BirthInput {
  const birthPlaceId = input.birthPlaceId ?? DEFAULT_BIRTH_PLACE_ID;
  let useTrueSolarTime = input.useTrueSolarTime;
  if (birthPlaceId === "standard") useTrueSolarTime = false;
  else if (useTrueSolarTime === undefined) useTrueSolarTime = true;
  return { ...input, birthPlaceId, useTrueSolarTime };
}

function parsePerson(
  sp: Record<string, string | string[] | undefined>,
  prefix: "a" | "b",
  defaults: BirthInput,
): BirthInput {
  return {
    year: clampInt(first(sp, `${prefix}_year`), defaults.year, 1900, 2100),
    month: clampInt(first(sp, `${prefix}_month`), defaults.month, 1, 12),
    day: clampInt(first(sp, `${prefix}_day`), defaults.day, 1, 31),
    hour: clampInt(first(sp, `${prefix}_hour`), defaults.hour, 0, 23),
    minute: clampInt(first(sp, `${prefix}_minute`), defaults.minute, 0, 59),
    gender: first(sp, `${prefix}_gender`) === "female" ? "female" : "male",
    calendarType: first(sp, `${prefix}_calendarType`) === "lunar" ? "lunar" : "solar",
    birthPlaceId: parseBirthPlaceId(first(sp, `${prefix}_birthPlaceId`) ?? defaults.birthPlaceId),
    useTrueSolarTime: parseUseTrueSolarTime(first(sp, `${prefix}_useTrueSolarTime`)),
  };
}

function validateDate(input: BirthInput): string | undefined {
  if (input.month === 2 && input.day > 29) {
    return "請檢查日期是否正確（2 月最多 29 日）";
  }
  return undefined;
}

export function compatibilityInputFromSearchParams(
  sp: Record<string, string | string[] | undefined>,
): {
  submitted: boolean;
  personA: BirthInput;
  personB: BirthInput;
  error?: string;
} {
  if (!first(sp, "a_year")) {
    return { submitted: false, personA: DEFAULT_A, personB: DEFAULT_B };
  }

  const personA = normalizeBirthInput(parsePerson(sp, "a", DEFAULT_A));
  const personB = normalizeBirthInput(parsePerson(sp, "b", DEFAULT_B));
  const error = validateDate(personA) ?? validateDate(personB);

  return { submitted: true, personA, personB, error };
}
