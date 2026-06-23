import type { BirthInput } from "@/lib/ziwei/types";

/** 出生資料 → /chart 查詢字串（儲存命盤、分享用） */
export function birthInputToSearchParams(input: BirthInput): URLSearchParams {
  const p = new URLSearchParams({
    year: String(input.year),
    month: String(input.month),
    day: String(input.day),
    hour: String(input.hour),
    minute: String(input.minute),
    gender: input.gender,
    calendarType: input.calendarType,
    birthPlaceId: input.birthPlaceId ?? "hong-kong",
  });
  if (input.useTrueSolarTime === false) p.set("useTrueSolarTime", "0");
  return p;
}

export function chartPathFromInput(input: BirthInput, locale: "zh" | "en" = "zh"): string {
  const base = locale === "en" ? "/en/chart" : "/chart";
  return `${base}?${birthInputToSearchParams(input).toString()}`;
}
