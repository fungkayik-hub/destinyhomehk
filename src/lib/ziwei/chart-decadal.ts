import type { DecadalPeriod, PalaceInfo, PalaceName, ZiWeiChart } from "./types";

export type { DecadalPeriod };

const IZTRO_PALACE_TO_OURS: Record<string, PalaceName> = {
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

/** 由 iztro 宮位物件抽出大限時間軸（按虛歲起排序） */
export function buildDecadalTimeline(
  iztroPalaces: { name: string; decadal: { range: [number, number]; heavenlyStem: string; earthlyBranch: string } }[],
): DecadalPeriod[] {
  return iztroPalaces
    .map((p) => {
      const palace = IZTRO_PALACE_TO_OURS[p.name];
      if (!palace) return null;
      return {
        palace,
        ageStart: p.decadal.range[0],
        ageEnd: p.decadal.range[1],
        heavenlyStem: p.decadal.heavenlyStem,
        earthlyBranch: p.decadal.earthlyBranch,
      };
    })
    .filter((d): d is DecadalPeriod => d !== null)
    .sort((a, b) => a.ageStart - b.ageStart);
}

/** 虛歲（農曆年齡，紫微斗數常用） */
export function nominalAge(birthYear: number, asOfYear?: number): number {
  const year = asOfYear ?? new Date().getFullYear();
  return year - birthYear + 1;
}

export function findDecadalAtAge(
  timeline: DecadalPeriod[],
  age: number,
): DecadalPeriod | undefined {
  return timeline.find((d) => age >= d.ageStart && age <= d.ageEnd);
}

function formatPalaceBrief(p: PalaceInfo | undefined): string {
  if (!p) return "—";
  const majors =
    p.stars
      .filter((s) => s.type !== "minor")
      .map((s) => s.name)
      .join("、") || "空宮";
  return `${p.name}（${majors}）`;
}

function decadalLine(d: DecadalPeriod, palaceInfo: PalaceInfo | undefined, mark?: string): string {
  const prefix = mark ? `${mark} ` : "";
  return `${prefix}${d.ageStart}–${d.ageEnd}虛歲：大限走【${d.palace}】${d.heavenlyStem}${d.earthlyBranch} — 本命${formatPalaceBrief(palaceInfo)}`;
}

/** 完整大限表 + 而家行緊邊段（供 AI prompt） */
export function formatDecadalBlock(chart: ZiWeiChart, asOfYear?: number): string {
  const timeline = chart.decadalTimeline;
  if (!timeline?.length) {
    return "【十年大限】排盤未載大限資料。";
  }

  const age = nominalAge(chart.input.year, asOfYear);
  const current = findDecadalAtAge(timeline, age);
  const palaceByName = new Map(chart.palaces.map((p) => [p.name, p]));

  const lines = [
    "════ 十年大限（程式已算好虛歲段，必須引用）════",
    `出生 ${chart.input.year} 年；${asOfYear ?? new Date().getFullYear()} 年約 ${age} 虛歲。`,
    "",
    ...timeline.map((d) =>
      decadalLine(
        d,
        palaceByName.get(d.palace),
        current?.palace === d.palace ? "▶ 而家" : undefined,
      ),
    ),
  ];

  if (current) {
    lines.push(
      "",
      `▶ 目前約 ${age} 虛歲，行【${current.palace}】大限（${current.ageStart}–${current.ageEnd} 虛歲）。`,
    );
  }

  return lines.join("\n");
}

/** 與指定宮位直接相關嘅大限段（該宮作為大限宮） */
export function formatPalaceDecadalFocus(
  chart: ZiWeiChart,
  palace: PalaceName,
  asOfYear?: number,
): string {
  const timeline = chart.decadalTimeline;
  if (!timeline?.length) return "";

  const match = timeline.find((d) => d.palace === palace);
  const age = nominalAge(chart.input.year, asOfYear);
  const current = findDecadalAtAge(timeline, age);
  const palaceInfo = chart.palaces.find((p) => p.name === palace);

  const lines = ["════ 【" + palace + "】相關十年大限（必須分析）════"];

  if (match) {
    const active =
      current?.palace === palace
        ? "（▶ 而家行緊呢段）"
        : age < match.ageStart
          ? "（未來大限）"
          : age > match.ageEnd
            ? "（已過去大限）"
            : "";
    lines.push(
      `當 ${match.ageStart}–${match.ageEnd} 虛歲，大限走【${palace}】${match.heavenlyStem}${match.earthlyBranch}${active}。`,
      `本命此宮：${formatPalaceBrief(palaceInfo)}。`,
      "命書必須用以上虛歲段講此宮喺邊十年較活躍，配合主星同三方四正。",
    );
  } else {
    lines.push(`未找到 ${palace} 作為大限宮嘅資料。`);
  }

  return lines.join("\n");
}
