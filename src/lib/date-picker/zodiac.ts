import { Lunar, Solar } from "lunar-typescript";
import type { BirthInput } from "@/lib/ziwei/types";

/** 簡繁生肖對照（lunar-typescript 多數返回簡體） */
const ZODIAC_CANONICAL: Record<string, string> = {
  鼠: "鼠",
  牛: "牛",
  虎: "虎",
  兔: "兔",
  龙: "龍",
  龍: "龍",
  蛇: "蛇",
  马: "馬",
  馬: "馬",
  羊: "羊",
  猴: "猴",
  鸡: "雞",
  雞: "雞",
  狗: "狗",
  猪: "豬",
  豬: "豬",
};

export function canonicalZodiac(raw: string): string {
  return ZODIAC_CANONICAL[raw] ?? raw;
}

export function zodiacMatches(a: string, b: string): boolean {
  return canonicalZodiac(a) === canonicalZodiac(b);
}

/** 由出生資料取得生肖（以農曆年為準） */
export function getBirthZodiac(input: BirthInput): { animal: string; branch: string } {
  const lunar =
    input.calendarType === "lunar"
      ? Lunar.fromYmd(
          input.year,
          input.isLeapMonth ? -input.month : input.month,
          input.day,
        )
      : Solar.fromYmd(input.year, input.month, input.day).getLunar();

  const ganZhi = lunar.getYearInGanZhiExact();
  return {
    animal: canonicalZodiac(lunar.getYearShengXiao()),
    branch: ganZhi.slice(-1),
  };
}
