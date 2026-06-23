import type { DailyAlmanac } from "@/lib/daily-almanac/types";
import { getSiteUrl } from "@/lib/site-url";

/** IG Story / GBP 帖文文案 */
export function buildDailyCaption(data: DailyAlmanac): string {
  const url = `${getSiteUrl()}/daily/${data.date}`;
  const zodiacLine = data.zodiacs
    .filter((z) => z.status === "highlight")
    .slice(0, 3)
    .map((z) => `${z.emoji}${z.name}`)
    .join(" ");

  return [
    `📅 ${data.solarLabel}（${data.weekday}）`,
    `${data.ganzhi.year}年 ${data.ganzhi.month}月 ${data.ganzhi.day}日`,
    data.lunarLabel,
    "",
    data.headline,
    "",
    `💡 師傅點撥：${data.masterTip}`,
    "",
    `✅ 宜：${data.yi.slice(0, 5).join("、")}`,
    `⛔ 忌：${data.ji.slice(0, 4).join("、")}`,
    zodiacLine ? `🐾 生肖留意：${zodiacLine}` : "",
    "",
    `「${data.quote}」`,
    "",
    "— Sunny 師傅 · Destiny Home 中洲派",
    `🔗 ${url}`,
    "",
    "#流日 #黃曆 #每日運程 #紫微斗數 #destinyhomehk #香港算命 #Sunny師傅",
  ]
    .filter(Boolean)
    .join("\n");
}
