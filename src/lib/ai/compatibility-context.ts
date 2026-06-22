import { chartToContext } from "./chart-context";
import type { ZiWeiChart } from "@/lib/ziwei/types";

function spousePalaceLine(chart: ZiWeiChart, label: string): string {
  const spouse = chart.palaces.find((p) => p.name === "夫妻宮");
  if (!spouse) return "";
  const majors = spouse.stars
    .filter((s) => s.type !== "minor")
    .map((s) => {
      const parts = [s.name];
      if (s.brightness) parts.push(s.brightness);
      if (s.mutagen) parts.push(s.mutagen);
      return parts.join("·");
    })
    .join("、");
  const minors = spouse.stars
    .filter((s) => s.type === "minor")
    .map((s) => s.name)
    .join("、");
  return `${label}夫妻宮（${spouse.heavenlyStem}${spouse.earthlyBranch}）：主星 ${majors || "空宮"}${minors ? `；輔星 ${minors}` : ""}`;
}

function soulPalaceLine(chart: ZiWeiChart, label: string): string {
  const soul = chart.palaces.find((p) => p.isSoulPalace);
  if (!soul) return "";
  const majors = soul.stars
    .filter((s) => s.type !== "minor")
    .map((s) => (s.brightness ? `${s.name}(${s.brightness})` : s.name))
    .join("、");
  return `${label}命宮（${soul.heavenlyStem}${soul.earthlyBranch}）：${majors || "空宮"}`;
}

/** 雙人命盤 — 夾桃花分析用 */
export function compatibilityChartsContext(
  chartA: ZiWeiChart,
  chartB: ZiWeiChart,
  ruleScore: number,
  ruleLabel: string,
): string {
  return [
    "【配對參考分（系統估算）】",
    `夾度：${ruleScore} 分（${ruleLabel}）`,
    "",
    "【甲方 — 你】",
    chartToContext(chartA),
    spousePalaceLine(chartA, "甲方"),
    "",
    "【乙方 — 對方】",
    chartToContext(chartB),
    spousePalaceLine(chartB, "乙方"),
    "",
    "【交叉參考】",
    soulPalaceLine(chartA, "甲方"),
    soulPalaceLine(chartB, "乙方"),
    "請對照：甲方夫妻宮 vs 乙方命宮；乙方夫妻宮 vs 甲方命宮。",
  ].join("\n");
}
