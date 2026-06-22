import type { ZodiacHint, ZodiacStatus } from "./types";

const ANIMALS: { name: string; emoji: string; branch: string }[] = [
  { name: "鼠", emoji: "🐭", branch: "子" },
  { name: "牛", emoji: "🐂", branch: "丑" },
  { name: "虎", emoji: "🐯", branch: "寅" },
  { name: "兔", emoji: "🐰", branch: "卯" },
  { name: "龍", emoji: "🐲", branch: "辰" },
  { name: "蛇", emoji: "🐍", branch: "巳" },
  { name: "馬", emoji: "🐴", branch: "午" },
  { name: "羊", emoji: "🐑", branch: "未" },
  { name: "猴", emoji: "🐵", branch: "申" },
  { name: "雞", emoji: "🐔", branch: "酉" },
  { name: "狗", emoji: "🐶", branch: "戌" },
  { name: "豬", emoji: "🐷", branch: "亥" },
];

const SAN_HE = [
  ["申", "子", "辰"],
  ["寅", "午", "戌"],
  ["亥", "卯", "未"],
  ["巳", "酉", "丑"],
] as const;

const LIU_HE: [string, string][] = [
  ["子", "丑"],
  ["寅", "亥"],
  ["卯", "戌"],
  ["辰", "酉"],
  ["巳", "申"],
  ["午", "未"],
];

const CHONG: [string, string][] = [
  ["子", "午"],
  ["丑", "未"],
  ["寅", "申"],
  ["卯", "酉"],
  ["辰", "戌"],
  ["巳", "亥"],
];

function inGroup(branch: string, group: readonly string[]): boolean {
  return group.includes(branch);
}

function pairsWith(dayBranch: string, pairs: [string, string][]): string | null {
  for (const [a, b] of pairs) {
    if (dayBranch === a) return b;
    if (dayBranch === b) return a;
  }
  return null;
}

export function zodiacHintsForDay(dayBranch: string): ZodiacHint[] {
  return ANIMALS.map((animal) => {
    let status: ZodiacStatus = "stable";
    let label = "平穩";

    const chongPartner = pairsWith(dayBranch, CHONG);
    if (chongPartner === animal.branch) {
      status = "caution";
      label = "宜低調";
      return { ...animal, label, status };
    }

    for (const group of SAN_HE) {
      if (inGroup(dayBranch, group) && inGroup(animal.branch, group) && animal.branch !== dayBranch) {
        status = "highlight";
        label = "三合";
        return { ...animal, label, status };
      }
    }

    const hePartner = pairsWith(dayBranch, LIU_HE);
    if (hePartner === animal.branch) {
      status = "highlight";
      label = "六合";
      return { ...animal, label, status };
    }

    if (animal.branch === dayBranch) {
      status = "caution";
      label = "本命日";
      return { ...animal, label, status };
    }

    return { ...animal, label, status };
  });
}
