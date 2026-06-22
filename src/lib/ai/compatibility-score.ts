import type { CompatibilityFactors, CompatibilityLabel } from "@/lib/compatibility/types";
import type { PalaceInfo, ZiWeiChart } from "@/lib/ziwei/types";

const BRIGHTNESS: Record<string, number> = {
  廟: 92,
  旺: 82,
  得: 72,
  利: 66,
  平: 56,
  不: 46,
  陷: 36,
};

const PEACH_STARS = new Set([
  "貪狼",
  "廉貞",
  "文昌",
  "文曲",
  "紅鸞",
  "天喜",
  "天姚",
  "祿存",
  "太陰",
  "天同",
]);

const HARMONY_PAIRS: [string, string][] = [
  ["紫微", "天府"],
  ["天同", "天相"],
  ["太陽", "太陰"],
  ["武曲", "貪狼"],
  ["廉貞", "天府"],
];

const CLASH_STARS = new Set(["七殺", "破軍", "擎羊", "陀羅"]);

function palaceBaseScore(palace: PalaceInfo | undefined): number {
  if (!palace) return 50;
  const majors = palace.stars.filter((s) => s.type !== "minor");
  if (majors.length === 0) return 52;

  let score =
    majors.reduce((sum, s) => sum + (BRIGHTNESS[s.brightness ?? "平"] ?? 56), 0) / majors.length;

  for (const s of palace.stars) {
    if (PEACH_STARS.has(s.name)) score += 3;
  }

  return Math.min(95, Math.round(score));
}

function majorNames(palace: PalaceInfo | undefined): string[] {
  if (!palace) return [];
  return palace.stars.filter((s) => s.type !== "minor").map((s) => s.name);
}

function crossScore(wants: PalaceInfo | undefined, partnerSoul: PalaceInfo | undefined): number {
  const base = Math.round((palaceBaseScore(wants) + palaceBaseScore(partnerSoul)) / 2);
  const a = majorNames(wants);
  const b = majorNames(partnerSoul);

  let bonus = 0;
  for (const [x, y] of HARMONY_PAIRS) {
    if ((a.includes(x) && b.includes(y)) || (a.includes(y) && b.includes(x))) {
      bonus += 6;
    }
  }

  const clashA = a.filter((n) => CLASH_STARS.has(n));
  const clashB = b.filter((n) => CLASH_STARS.has(n));
  if (clashA.length > 0 && clashB.length > 0) bonus -= 8;

  if (a.length === 0 || b.length === 0) bonus += 2;

  return Math.min(95, Math.max(35, base + bonus));
}

export function scoreToCompatibilityLabel(score: number): CompatibilityLabel {
  if (score >= 85) return "超夾";
  if (score >= 72) return "幾夾";
  if (score >= 58) return "尚可";
  if (score >= 45) return "要多溝通";
  return "要用心經營";
}

export function computeCompatibilityScore(
  chartA: ZiWeiChart,
  chartB: ZiWeiChart,
): { score: number; label: CompatibilityLabel; factors: CompatibilityFactors } {
  const spouseA = chartA.palaces.find((p) => p.name === "夫妻宮");
  const spouseB = chartB.palaces.find((p) => p.name === "夫妻宮");
  const soulA = chartA.palaces.find((p) => p.isSoulPalace);
  const soulB = chartB.palaces.find((p) => p.isSoulPalace);
  const moodA = chartA.palaces.find((p) => p.name === "福德宮");
  const moodB = chartB.palaces.find((p) => p.name === "福德宮");

  const factors: CompatibilityFactors = {
    spouseA: palaceBaseScore(spouseA),
    spouseB: palaceBaseScore(spouseB),
    crossAB: crossScore(spouseA, soulB),
    crossBA: crossScore(spouseB, soulA),
    mood: Math.round((palaceBaseScore(moodA) + palaceBaseScore(moodB)) / 2),
  };

  const weighted =
    factors.spouseA * 0.2 +
    factors.spouseB * 0.2 +
    factors.crossAB * 0.25 +
    factors.crossBA * 0.25 +
    factors.mood * 0.1;

  const peachBonus =
    [spouseA, spouseB, soulA, soulB].reduce((sum, p) => {
      if (!p) return sum;
      return sum + p.stars.filter((s) => PEACH_STARS.has(s.name)).length * 1.5;
    }, 0);

  const score = Math.min(95, Math.max(40, Math.round(weighted + peachBonus)));

  return { score, label: scoreToCompatibilityLabel(score), factors };
}

export function fallbackCompatibilityText(
  chartA: ZiWeiChart,
  chartB: ZiWeiChart,
  score: number,
  label: CompatibilityLabel,
): {
  summary: string;
  strengths: string[];
  tips: string[];
  chemistry: string;
} {
  const spouseA = chartA.palaces.find((p) => p.name === "夫妻宮");
  const spouseB = chartB.palaces.find((p) => p.name === "夫妻宮");
  const soulA = chartA.palaces.find((p) => p.isSoulPalace);
  const soulB = chartB.palaces.find((p) => p.isSoulPalace);

  const aSpouseStars = majorNames(spouseA).join("、") || "空宮借星";
  const bSpouseStars = majorNames(spouseB).join("、") || "空宮借星";
  const aSoulStars = majorNames(soulA).join("、") || "空宮借星";
  const bSoulStars = majorNames(soulB).join("、") || "空宮借星";

  const summary =
    score >= 72
      ? `整體夾度 ${score} 分（${label}）。你哋夫妻宮同命宮有互相呼應嘅位，感情有火花，值得慢慢培養。`
      : score >= 58
        ? `夾度 ${score} 分（${label}）。有吸引亦有磨合位，用心溝通會愈嚟愈順。`
        : `夾度 ${score} 分（${label}）。命盤顯示要更多耐性同理解，唔代表唔夾，係要學點樣相處。`;

  const strengths = [
    `你嘅夫妻宮主星：${aSpouseStars}，反映你心目中另一半嘅輪廓。`,
    `對方夫妻宮主星：${bSpouseStars}，睇佢點樣諗感情。`,
    `你命宮 ${aSoulStars} 同對方命宮 ${bSoulStars} 一齊睇，可以睇到性格點樣互補。`,
  ];

  const tips =
    score >= 72
      ? [
          "多留低開心嘅相處時刻，感情會愈穩。",
          "尊重彼此節奏，唔好急住要對方改變。",
          "有分歧時先聽再講，比拗贏更重要。",
        ]
      : [
          "先了解對方表達愛嘅方式，唔好用自己標準量度。",
          "有火氣時停一停，唔好喺情緒高位做決定。",
          "可以約定固定傾計時間，減少誤會。",
        ];

  const chemistry =
    factorsCrossHint(spouseA, soulB) +
    " " +
    factorsCrossHint(spouseB, soulA);

  return { summary, strengths, tips, chemistry };
}

function factorsCrossHint(
  spouse: PalaceInfo | undefined,
  partnerSoul: PalaceInfo | undefined,
): string {
  const s = majorNames(spouse).join("、") || "借星";
  const p = majorNames(partnerSoul).join("、") || "借星";
  return `一方想要嘅（夫妻宮 ${s}）對上另一方本色（命宮 ${p}），係感情化學反應嘅關鍵。`;
}
