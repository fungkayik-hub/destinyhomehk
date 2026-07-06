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
  if (score >= 85) return "緣分深厚";
  if (score >= 72) return "相處順遂";
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

  const summary =
    score >= 72
      ? `徒弟先講兩句 — 姻緣指數 ${score}（${label}）。你哋有互相吸引嘅位，相處起嚟應該幾有火花。邊段大限最適合談婚論嫁、邊年感情要特別留心，徒弟睇唔到時間軸，要師傅合婚先拆到。`
      : score >= 58
        ? `徒弟探測到姻緣指數 ${score}（${label}）。有吸引亦有磨合位，用心溝通會愈嚟愈順。你哋邊方面最易拗撬、點樣補足，要師傅對盤先準。`
        : `姻緣指數 ${score}（${label}）。命盤顯示要更多耐性同理解，唔代表唔適合，係要學點樣相處。邊段大限感情壓力較大，師傅親批會講清楚。`;

  const strengths = [
    `你喺感情裡面想要嘅類型，同對方本色有呼應 — 呢個係你哋嘅化學反應來源。`,
    `你哋開心時應該幾夾，但累嘅時候點樣相處，就要睇福德宮同大限。`,
    `夫妻宮同命宮交叉睇，你哋性格有互補位，亦有要磨合嘅位 — 唔係完美但係有料。`,
  ];

  const tips =
    score >= 72
      ? [
          "多留低開心嘅相處時刻，感情會愈穩 — 尤其係你哋都忙嘅時候。",
          "尊重彼此節奏，唔好急住要對方一次過改晒。",
          "有分歧時先聽再講；你哋命盤顯示「嘴硬心軟」都可能出現。",
        ]
      : [
          "先了解對方表達愛嘅方式，唔好用自己標準量度。",
          "有火氣時停一停，唔好喺情緒高位做決定。",
          "可以約定固定傾計時間；你哋呢對需要「講清楚」多過「估」。",
        ];

  const chemistry = buildChemistryNarrative(spouseA, soulB, spouseB, soulA);

  return { summary, strengths, tips, chemistry };
}

function buildChemistryNarrative(
  spouseA: PalaceInfo | undefined,
  soulB: PalaceInfo | undefined,
  spouseB: PalaceInfo | undefined,
  soulA: PalaceInfo | undefined,
): string {
  const aWant = majorNames(spouseA)[0];
  const bNature = majorNames(soulB)[0];
  const bWant = majorNames(spouseB)[0];
  const aNature = majorNames(soulA)[0];

  const parts: string[] = [];

  if (aWant && bNature) {
    parts.push(
      `你想要嘅感情味（夫妻宮帶${aWant}）對上對方本色（命宮帶${bNature}）— 呢個係你哋之間嘅火花來源。`,
    );
  }
  if (bWant && aNature) {
    parts.push(
      `對方想要嘅（${bWant}）對上你本色（${aNature}）— 互相滿足到幾多，就要師傅合婚先拆得深。`,
    );
  }

  return (
    parts.join(" ") ||
    "雙方夫妻宮同命宮有交叉呼應，有緣份基礎；深入合婚要師傅睇大限同四化。"
  );
}
