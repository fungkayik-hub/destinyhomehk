import type { BirthInput } from "@/lib/ziwei/types";

/** 同一出生資料 → 同一 chartKey（排盤 AI 快取、付費命書解鎖共用） */
export function buildChartKey(input: BirthInput): string {
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
  ].join("-");
}
