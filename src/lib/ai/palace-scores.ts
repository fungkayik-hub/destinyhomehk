import type { PalaceInfo, PalaceName, StarPlacement } from "@/lib/ziwei/types";
import type { PalaceScore, PalaceScoreLabel } from "./types";

const BRIGHTNESS_SCORE: Record<NonNullable<StarPlacement["brightness"]>, number> = {
  廟: 92,
  旺: 82,
  得: 72,
  利: 66,
  平: 56,
  不: 46,
  陷: 36,
};

export function scoreToLabel(score: number): PalaceScoreLabel {
  if (score >= 85) return "極佳";
  if (score >= 70) return "佳";
  if (score >= 55) return "平";
  if (score >= 40) return "待加強";
  return "需注意";
}

function briefForPalace(palace: PalaceInfo, score: number): string {
  const majors = palace.stars.filter((s) => s.type !== "minor");
  if (majors.length === 0) {
    return "空宮有借星力，仍有發揮位";
  }
  const names = majors.map((s) => s.name).join("、");
  if (score >= 85) return `${names}廟旺，能量強勁`;
  if (score >= 70) return `${names}配置佳，穩定發揮`;
  if (score >= 55) return `${names}有潛力，宜循序發展`;
  if (score >= 40) return `${names}要執一執方向，仍有位`;
  return `${names}宜保守穩陣，慢慢嚟`;
}

export function fallbackPalaceScores(palaces: PalaceInfo[]): PalaceScore[] {
  return palaces.map((palace) => {
    const majors = palace.stars.filter((s) => s.type !== "minor");
    let score: number;

    if (majors.length === 0) {
      score = 52;
    } else {
      const values = majors.map((s) => BRIGHTNESS_SCORE[s.brightness ?? "平"] ?? 56);
      score = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    }

    if (palace.isSoulPalace) score = Math.min(100, score + 3);
    if (palace.isBodyPalace) score = Math.min(100, score + 2);

    return {
      palace: palace.name,
      score,
      label: scoreToLabel(score),
      brief: briefForPalace(palace, score),
    };
  });
}

export function parsePalaceScoresJson(
  raw: string,
  expected: PalaceName[],
): PalaceScore[] | null {
  const trimmed = raw.trim();
  const jsonText = trimmed.startsWith("[")
    ? trimmed
    : trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1]?.trim() ?? null;

  if (!jsonText) return null;

  try {
    const parsed = JSON.parse(jsonText) as {
      palace?: string;
      score?: number;
      brief?: string;
    }[];

    if (!Array.isArray(parsed) || parsed.length === 0) return null;

    const byName = new Map<string, PalaceScore>();
    for (const item of parsed) {
      if (!item.palace || typeof item.score !== "number") continue;
      const score = Math.min(100, Math.max(1, Math.round(item.score)));
      byName.set(item.palace, {
        palace: item.palace as PalaceName,
        score,
        label: scoreToLabel(score),
        brief: (item.brief ?? "").slice(0, 40) || "主星配置綜合評估",
      });
    }

    const ordered = expected
      .map((name) => byName.get(name))
      .filter((s): s is PalaceScore => Boolean(s));

    return ordered.length === expected.length ? ordered : null;
  } catch {
    return null;
  }
}
