import type { ZiWeiChart } from "@/lib/ziwei/types";

function formatStarLabel(star: {
  name: string;
  brightness?: string;
  mutagen?: string;
}): string {
  const parts = [star.name];
  if (star.brightness) parts.push(star.brightness);
  if (star.mutagen) parts.push(star.mutagen);
  return parts.length > 1 ? `${parts[0]}(${parts.slice(1).join("·")})` : star.name;
}

/** 將命盤整理成 AI prompt 用的文字摘要 */
export function chartToContext(chart: ZiWeiChart): string {
  const gender = chart.input.gender === "male" ? "男" : "女";
  const palaceLines = chart.palaces.map((p) => {
    const majors = p.stars
      .filter((s) => s.type !== "minor")
      .map((s) => formatStarLabel(s))
      .join("、");
    const minors = p.stars
      .filter((s) => s.type === "minor")
      .map((s) => formatStarLabel(s))
      .join("、");
    const tags = [
      p.isSoulPalace ? "命宮" : "",
      p.isBodyPalace ? "身宮" : "",
    ]
      .filter(Boolean)
      .join("/");
    return `${p.name}${tags ? `[${tags}]` : ""} ${p.heavenlyStem}${p.earthlyBranch}：主星 ${majors || "空宮"}${minors ? `；輔星 ${minors}` : ""}`;
  });

  const mutagenLines = chart.palaces.flatMap((p) =>
    p.stars
      .filter((s) => s.mutagen)
      .map((s) => `${s.name}${s.mutagen}在${p.name}`),
  );
  const lucunPalace = chart.palaces.find((p) =>
    p.stars.some((s) => s.name === "祿存" || s.name === "禄存"),
  )?.name;

  const soulPalace = chart.palaces.find((p) => p.isSoulPalace);
  const bodyPalace = chart.palaces.find((p) => p.isBodyPalace);

  const soulLine = soulPalace
    ? `命宮主星：${soulPalace.stars.filter((s) => s.type !== "minor").map((s) => formatStarLabel(s)).join("、") || "空宮"}`
    : null;
  const bodyLine = bodyPalace
    ? `身宮在：${bodyPalace.name}（${bodyPalace.heavenlyStem}${bodyPalace.earthlyBranch}）`
    : null;

  const patternHints = [
    soulLine,
    bodyLine,
    mutagenLines.length > 0 ? `四化：${mutagenLines.join("、")}` : null,
    lucunPalace ? `祿存：在${lucunPalace}` : null,
  ].filter(Boolean);

  return [
    `性別：${gender}`,
    `陽曆：${chart.solarDate}`,
    `農曆：${chart.lunarDateText}`,
    `四柱：${chart.chineseDate}`,
    `五行局：${chart.fiveElement}`,
    `命宮地支：${chart.mingPalaceBranch}`,
    `身宮地支：${chart.shenPalaceBranch}`,
    `命主：${chart.soulStar}`,
    `身主：${chart.bodyStar}`,
    ...(patternHints.length > 0 ? ["", "格局參考（中洲派）：", ...patternHints] : []),
    "",
    "十二宮：",
    ...palaceLines,
  ].join("\n");
}
