/**
 * 將具體時間轉換為 iztro 時辰索引
 * 0=早子, 1=丑, 2=寅 ... 5=巳, 6=午 ... 11=亥, 12=晚子
 */
export function hourMinuteToTimeIndex(hour: number, minute: number): number {
  const totalMinutes = hour * 60 + minute;

  if (hour === 0 && totalMinutes < 60) return 0;
  if (hour === 23) return 12;
  if (hour >= 1 && hour <= 22) return Math.ceil(hour / 2);

  return 0;
}

/**
 * 排盤用時辰索引（對齊文墨天機等常見軟件）
 * iztro 晚子(12)同早子(0)安星不同；文墨將 23:00–00:59 子時作同一套安星。
 * 因此晚子統一用早子索引起盤。
 */
export function toChartTimeIndex(hour: number, minute: number): number {
  const index = hourMinuteToTimeIndex(hour, minute);
  return index === 12 ? 0 : index;
}

export function formatSolarDate(year: number, month: number, day: number): string {
  return `${year}-${month}-${day}`;
}

export function getShichenLabel(timeIndex: number): string {
  const labels = [
    "早子時（00:00–00:59）",
    "丑時（01:00–02:59）",
    "寅時（03:00–04:59）",
    "卯時（05:00–06:59）",
    "辰時（07:00–08:59）",
    "巳時（09:00–10:59）",
    "午時（11:00–12:59）",
    "未時（13:00–14:59）",
    "申時（15:00–16:59）",
    "酉時（17:00–18:59）",
    "戌時（19:00–20:59）",
    "亥時（21:00–22:59）",
    "晚子時（23:00–23:59）",
  ];
  return labels[timeIndex] ?? labels[0];
}
