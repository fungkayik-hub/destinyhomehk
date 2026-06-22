import type { ZiWeiChart } from "@/lib/ziwei/types";
import { getShichenLabel, hourMinuteToTimeIndex } from "@/lib/ziwei/time";
import { whatsappUrl } from "@/lib/site-config";

const GENDER_LABEL = { male: "男", female: "女" } as const;

/** 將命盤整理成 WhatsApp 訊息，方便客人發俾師傅解盤 */
export function buildChartWhatsAppMessage(chart: ZiWeiChart): string {
  const { input } = chart;
  const shichen = getShichenLabel(hourMinuteToTimeIndex(input.hour, input.minute));
  const soulPalace = chart.palaces.find((p) => p.isSoulPalace);
  const soulStars =
    soulPalace?.stars
      .filter((s) => s.type !== "minor")
      .map((s) => (s.brightness ? `${s.name}(${s.brightness})` : s.name))
      .join("、") || "空宮";

  const palaceLines = chart.palaces.map((p) => {
    const majors = p.stars
      .filter((s) => s.type !== "minor")
      .map((s) => s.name)
      .join("、");
    return `${p.name}：${majors || "空宮"}`;
  });

  const lines = [
    "你好，我剛用 Destiny Home 排了盤，想請 Sunny 師傅幫忙解盤 🙏",
    "",
    "【出生資料】",
    `陽曆：${chart.solarDate}`,
    `性別：${GENDER_LABEL[input.gender]}`,
    `時間：${String(input.hour).padStart(2, "0")}:${String(input.minute).padStart(2, "0")}（${shichen}）`,
    "",
    "【命盤摘要】",
    `農曆：${chart.lunarDateText}`,
    `四柱：${chart.chineseDate}`,
    `五行局：${chart.fiveElement}`,
    `命宮：${chart.mingPalaceBranch}（${soulStars}）`,
    `身宮：${chart.shenPalaceBranch}`,
    `命主：${chart.soulStar}｜身主：${chart.bodyStar}`,
    "",
    "【十二宮主星】",
    ...palaceLines,
    "",
    "請師傅幫忙睇睇，謝謝！",
  ];

  return lines.join("\n");
}

export function chartWhatsAppUrl(chart: ZiWeiChart): string {
  return whatsappUrl(buildChartWhatsAppMessage(chart));
}
