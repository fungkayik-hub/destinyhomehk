import type { ChartPlateType } from "./types";
import { hourMinuteToTimeIndex } from "./time";

export const CHART_PLATES: {
  id: ChartPlateType;
  name: string;
  nameEn: string;
  desc: string;
  descEn: string;
}[] = [
  {
    id: "heaven",
    name: "天盤",
    nameEn: "Heaven",
    desc: "按出生時辰正常排盤，睇人生大格局",
    descEn: "Standard chart from birth time — life overview",
  },
  {
    id: "earth",
    name: "地盤",
    nameEn: "Earth",
    desc: "以身宮為命宮重排，主先天根基、時辰偏早",
    descEn: "Body palace as soul — early birth within the hour",
  },
  {
    id: "human",
    name: "人盤",
    nameEn: "Human",
    desc: "以福德宮為命宮重排，主思想、後天、時辰偏晚",
    descEn: "Fortune palace as soul — late birth within the hour",
  },
];

/** 時辰內第幾分鐘（0 起） */
function minuteOffsetInShichen(hour: number, minute: number): {
  offset: number;
  duration: number;
} {
  const total = hour * 60 + minute;
  const timeIndex = hourMinuteToTimeIndex(hour, minute);

  if (timeIndex === 0) return { offset: total, duration: 60 };
  if (timeIndex === 12) return { offset: total - 23 * 60, duration: 60 };

  const start = (timeIndex * 2 - 1) * 60;
  return { offset: total - start, duration: 120 };
}

/**
 * 中洲派時辰分刻建議（王亭之講義大致原則）
 * 時頭約 15 分鐘 → 地盤；時尾約 15 分鐘 → 人盤；其餘 → 天盤
 * 實務仍須定盤驗證，唔可機械化
 */
export function suggestPlateFromBirthTime(hour: number, minute: number): ChartPlateType {
  const { offset, duration } = minuteOffsetInShichen(hour, minute);
  const tailStart = duration - 15;
  if (offset < 15) return "earth";
  if (offset >= tailStart) return "human";
  return "heaven";
}

export function getPlateMeta(id: ChartPlateType) {
  return CHART_PLATES.find((p) => p.id === id) ?? CHART_PLATES[0];
}
