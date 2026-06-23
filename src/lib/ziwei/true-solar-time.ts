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
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatClock(hour: number, minute: number): string {
  return `${pad(hour)}:${pad(minute)}`;
}

/** 經度真太陽時校正（東八區每度 4 分鐘） */
export function applyTrueSolarTime(input: BirthInput): TrueSolarTimeResult {
  const placeId = input.birthPlaceId ?? DEFAULT_BIRTH_PLACE_ID;
  const place = getBirthPlace(placeId);
  const civilHour = input.hour;
  const civilMinute = input.minute;

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
    };
  }

  const civilTotal = civilHour * 60 + civilMinute;
  const offsetMinutes = Math.round((place.longitude - place.timezoneMeridian) * 4);
  let correctedTotal = civilTotal + offsetMinutes;
  correctedTotal = ((correctedTotal % 1440) + 1440) % 1440;

  return {
    placeId,
    placeName: place.name,
    applied: offsetMinutes !== 0,
    offsetMinutes,
    civilHour,
    civilMinute,
    correctedHour: Math.floor(correctedTotal / 60),
    correctedMinute: correctedTotal % 60,
  };
}
