import { astro } from "iztro";
import type { BirthInput, PalaceInfo, StarPlacement, ZiWeiChart } from "./types";
import { hourMinuteToTimeIndex, formatSolarDate } from "./time";
import { applyTrueSolarTime } from "./true-solar-time";

const PALACE_NAME_MAP: Record<string, string> = {
  命宫: "命宮",
  兄弟: "兄弟宮",
  夫妻: "夫妻宮",
  子女: "子女宮",
  财帛: "財帛宮",
  疾厄: "疾厄宮",
  迁移: "遷移宮",
  仆役: "奴僕宮",
  交友: "奴僕宮",
  官禄: "官祿宮",
  田宅: "田宅宮",
  福德: "福德宮",
  父母: "父母宮",
};

const BRIGHTNESS_MAP: Record<string, StarPlacement["brightness"]> = {
  庙: "廟",
  旺: "旺",
  得: "得",
  利: "利",
  平: "平",
  不: "不",
  陷: "陷",
};

function mapBrightness(b?: string): StarPlacement["brightness"] | undefined {
  if (!b) return undefined;
  return BRIGHTNESS_MAP[b] ?? (b as StarPlacement["brightness"]);
}

const MUTAGEN_MAP: Record<string, string> = {
  sihuaLu: "化祿",
  sihuaQuan: "化權",
  sihuaKe: "化科",
  sihuaJi: "化忌",
  祿: "化祿",
  權: "化權",
  科: "化科",
  忌: "化忌",
};

function mapMutagen(m?: string): string | undefined {
  if (!m) return undefined;
  return MUTAGEN_MAP[m] ?? (m.startsWith("化") ? m : `化${m}`);
}

function parseLunarDate(lunarDate: string) {
  const match = lunarDate.match(/(\d+)年(闰)?(.+?)月(.+)/);
  if (!match) return { year: 0, month: 1, day: 1, isLeap: false };

  const year = parseInt(match[1]);
  const isLeap = Boolean(match[2]);
  const monthText = match[3];
  const dayText = match[4];

  const monthMap: Record<string, number> = {
    正: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6,
    七: 7, 八: 8, 九: 9, 十: 10, 冬: 11, 腊: 12,
  };

  let month = 1;
  for (const [key, value] of Object.entries(monthMap)) {
    if (monthText.includes(key)) {
      month = value;
      break;
    }
  }

  const dayMap: Record<string, number> = {
    初十: 10, 二十: 20, 三十: 30,
    十一: 11, 十二: 12, 十三: 13, 十四: 14, 十五: 15,
    十六: 16, 十七: 17, 十八: 18, 十九: 19,
    廿一: 21, 廿二: 22, 廿三: 23, 廿四: 24, 廿五: 25,
    廿六: 26, 廿七: 27, 廿八: 28, 廿九: 29,
  };

  let day = 1;
  for (const [key, value] of Object.entries(dayMap)) {
    if (dayText.includes(key)) {
      day = value;
      break;
    }
  }
  if (day === 1) {
    const digit = dayText.match(/初(\d)/);
    if (digit) day = parseInt(digit[1]);
  }

  return { year, month, day, isLeap };
}

function buildSummary(chart: {
  fiveElementsClass: string;
  earthlyBranchOfSoulPalace: string;
  soul: string;
  majorStars: string[];
}): string {
  const stars = chart.majorStars.length > 0 ? chart.majorStars.join("、") : "空宮";
  return `五行局屬${chart.fiveElementsClass}，命宮在${chart.earthlyBranchOfSoulPalace}，命主${chart.soul}。命宮主星：${stars}。完整解盤請預約 Sunny 師傅親自定盤。`;
}

/**
 * 使用 iztro（《紫微斗數全書》三合派）生成命盤
 * @see https://github.com/SylarLong/iztro
 */
export function generateChart(input: BirthInput): ZiWeiChart {
  const trueSolarTime = applyTrueSolarTime(input);
  const timeIndex = hourMinuteToTimeIndex(
    trueSolarTime.correctedHour,
    trueSolarTime.correctedMinute,
  );
  const gender = input.gender === "male" ? "男" : "女";
  const solarDate = formatSolarDate(input.year, input.month, input.day);

  const astrolabe = input.calendarType === "lunar"
    ? astro.byLunar(
        `${input.year}-${input.month}-${input.day}`,
        timeIndex,
        gender,
        input.isLeapMonth ?? false,
      )
    : astro.bySolar(solarDate, timeIndex, gender);

  const soulPalace = astrolabe.palaces.find((p) => p.name === "命宫");
  const majorStarNames = soulPalace?.majorStars.map((s) => s.name) ?? [];

  const palaces: PalaceInfo[] = astrolabe.palaces.map((palace) => {
    const stars: StarPlacement[] = [
      ...palace.majorStars.map((star) => ({
        name: star.name,
        palace: (PALACE_NAME_MAP[palace.name] ?? palace.name) as PalaceInfo["name"],
        brightness: mapBrightness(star.brightness),
        mutagen: mapMutagen(star.mutagen as string | undefined),
        type: "major" as const,
      })),
      ...palace.minorStars.map((star) => ({
        name: star.name,
        palace: (PALACE_NAME_MAP[palace.name] ?? palace.name) as PalaceInfo["name"],
        mutagen: mapMutagen(star.mutagen as string | undefined),
        type: "minor" as const,
      })),
    ];

    return {
      name: (PALACE_NAME_MAP[palace.name] ?? palace.name) as PalaceInfo["name"],
      earthlyBranch: palace.earthlyBranch,
      heavenlyStem: palace.heavenlyStem,
      stars,
      isBodyPalace: palace.earthlyBranch === astrolabe.earthlyBranchOfBodyPalace,
      isSoulPalace: palace.earthlyBranch === astrolabe.earthlyBranchOfSoulPalace,
    };
  });

  // 按命宮起頭的傳統順序排列
  const soulIndex = palaces.findIndex((p) => p.isSoulPalace);
  const orderedPalaces = soulIndex >= 0
    ? [...palaces.slice(soulIndex), ...palaces.slice(0, soulIndex)]
    : palaces;

  const pillars = astrolabe.chineseDate.split(" ");
  const yearPillar = pillars[0] ?? "";

  return {
    input,
    trueSolarTime,
    solarDate: astrolabe.solarDate,
    lunarDateText: astrolabe.lunarDate,
    chineseDate: astrolabe.chineseDate,
    soulStar: astrolabe.soul,
    bodyStar: astrolabe.body,
    lunarDate: parseLunarDate(astrolabe.lunarDate),
    heavenlyStemYear: yearPillar[0] ?? "",
    earthlyBranchYear: yearPillar[1] ?? "",
    mingPalaceBranch: astrolabe.earthlyBranchOfSoulPalace,
    shenPalaceBranch: astrolabe.earthlyBranchOfBodyPalace,
    fiveElement: astrolabe.fiveElementsClass,
    palaces: orderedPalaces,
    summary: buildSummary({
      fiveElementsClass: astrolabe.fiveElementsClass,
      earthlyBranchOfSoulPalace: astrolabe.earthlyBranchOfSoulPalace,
      soul: astrolabe.soul,
      majorStars: majorStarNames,
    }),
  };
}
