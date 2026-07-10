import type { BirthInput, ChartPlateType } from "@/lib/ziwei/types";

function birthParts(input: BirthInput): (string | number | boolean)[] {
  return [
    input.year,
    input.month,
    input.day,
    input.hour,
    input.minute,
    input.gender,
    input.calendarType,
    input.isLeapMonth ?? false,
    input.birthPlaceId ?? "",
    input.useTrueSolarTime ?? true,
  ];
}

/** 出生資料 key — 付費命書解鎖、定盤問卷儲存共用 */
export function buildBirthKey(input: BirthInput): string {
  return birthParts(input).join("-");
}

/** 出生資料 + 盤類型 → AI 快取 key */
export function buildChartKey(input: BirthInput, plate: ChartPlateType): string {
  return [...birthParts(input), plate].join("-");
}
