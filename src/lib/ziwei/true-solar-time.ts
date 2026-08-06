import type { BirthInput } from "./types";
import { getBirthPlace, DEFAULT_BIRTH_PLACE_ID } from "./birth-places";

export interface TrueSolarTimeResult {
  placeId: string;
  placeName: string;
  applied: boolean;
  offsetMinutes: number;
  civilHour: number;
  civilMinute: number;
  correctedHour: number;
  correctedMinute: number;
  /** 相對鐘錶日期偏移（−1 = 退一日，+1 = 進一日） */
  dayDelta: number;
  /** 校正後用於排盤嘅陽曆年月日（已計 dayDelta） */
  correctedYear: number;
  correctedMonth: number;
  correctedDay: number;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatClock(hour: number, minute: number): string {
  return `${pad(hour)}:${pad(minute)}`;
}

function shiftCivilDate(
  year: number,
  month: number,
  day: number,
  dayDelta: number,
): { year: number; month: number; day: number } {
  if (dayDelta === 0) return { year, month, day };
  const d = new Date(Date.UTC(year, month - 1, day));
  d.setUTCDate(d.getUTCDate() + dayDelta);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}

/** 經度真太陽時校正（東八區每度 4 分鐘）；跨日會更新日期 */
export function applyTrueSolarTime(input: BirthInput): TrueSolarTimeResult {
  const placeId = input.birthPlaceId ?? DEFAULT_BIRTH_PLACE_ID;
  const place = getBirthPlace(placeId);
  const civilHour = input.hour;
  const civilMinute = input.minute;
  const civilDate = {
    year: input.year,
    month: input.month,
    day: input.day,
  };

  if (placeId === "standard" || input.useTrueSolarTime === false) {
    return {
      placeId,
      placeName: place.name,
      applied: false,
      offsetMinutes: 0,
      civilHour,
      civilMinute,
      correctedHour: civilHour,
      correctedMinute: civilMinute,
      dayDelta: 0,
      correctedYear: civilDate.year,
      correctedMonth: civilDate.month,
      correctedDay: civilDate.day,
    };
  }

  const civilTotal = civilHour * 60 + civilMinute;
  const offsetMinutes = Math.round((place.longitude - place.timezoneMeridian) * 4);
  const rawTotal = civilTotal + offsetMinutes;
  const dayDelta = Math.floor(rawTotal / 1440);
  const correctedTotal = ((rawTotal % 1440) + 1440) % 1440;
  const shifted = shiftCivilDate(
    civilDate.year,
    civilDate.month,
    civilDate.day,
    dayDelta,
  );

  return {
    placeId,
    placeName: place.name,
    applied: offsetMinutes !== 0 || dayDelta !== 0,
    offsetMinutes,
    civilHour,
    civilMinute,
    correctedHour: Math.floor(correctedTotal / 60),
    correctedMinute: correctedTotal % 60,
    dayDelta,
    correctedYear: shifted.year,
    correctedMonth: shifted.month,
    correctedDay: shifted.day,
  };
}
