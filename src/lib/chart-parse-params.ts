import type { BirthInput } from "@/lib/ziwei/types";

const DEFAULT_INPUT: BirthInput = {
  year: 2000,
  month: 1,
  day: 1,
  hour: 12,
  minute: 0,
  gender: "male",
  calendarType: "solar",
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

export function birthInputFromSearchParams(
  sp: Record<string, string | string[] | undefined>,
): { submitted: boolean; input: BirthInput; error?: string } {
  if (!first(sp, "year")) {
    return { submitted: false, input: DEFAULT_INPUT };
  }

  const input: BirthInput = {
    year: clampInt(first(sp, "year"), DEFAULT_INPUT.year, 1900, 2100),
    month: clampInt(first(sp, "month"), DEFAULT_INPUT.month, 1, 12),
    day: clampInt(first(sp, "day"), DEFAULT_INPUT.day, 1, 31),
    hour: clampInt(first(sp, "hour"), DEFAULT_INPUT.hour, 0, 23),
    minute: clampInt(first(sp, "minute"), DEFAULT_INPUT.minute, 0, 59),
    gender: first(sp, "gender") === "female" ? "female" : "male",
    calendarType: first(sp, "calendarType") === "lunar" ? "lunar" : "solar",
  };

  if (input.month === 2 && input.day > 29) {
    return { submitted: true, input, error: "請檢查日期是否正確（2 月最多 29 日）" };
  }

  return { submitted: true, input };
}
