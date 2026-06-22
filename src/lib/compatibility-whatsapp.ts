import type { CompatibilityResult } from "@/lib/compatibility/types";
import type { BirthInput, ZiWeiChart } from "@/lib/ziwei/types";
import { getShichenLabel, hourMinuteToTimeIndex } from "@/lib/ziwei/time";
import { whatsappUrl } from "@/lib/site-config";

const GENDER_LABEL = { male: "男", female: "女" } as const;

function birthLine(label: string, input: BirthInput, chart: ZiWeiChart): string {
  const shichen = getShichenLabel(hourMinuteToTimeIndex(input.hour, input.minute));
  return [
    `【${label}】`,
    `陽曆：${chart.solarDate}`,
    `性別：${GENDER_LABEL[input.gender]}`,
    `時間：${String(input.hour).padStart(2, "0")}:${String(input.minute).padStart(2, "0")}（${shichen}）`,
    `命宮：${chart.mingPalaceBranch}`,
  ].join("\n");
}

export function buildCompatibilityWhatsAppMessage(
  personA: BirthInput,
  personB: BirthInput,
  chartA: ZiWeiChart,
  chartB: ZiWeiChart,
  result: CompatibilityResult,
): string {
  const lines = [
    "你好，我用 Destiny Home 夾桃花睇咗配對，想請 Sunny 師傅幫手深入睇睇 🙏",
    "",
    birthLine("你", personA, chartA),
    "",
    birthLine("對方", personB, chartB),
    "",
    "【夾桃花結果】",
    `夾度：${result.score} 分（${result.label}）`,
    result.summary,
    "",
    "想請師傅幫手睇感情同合婚，謝謝！",
  ];

  return lines.join("\n");
}

export function compatibilityWhatsAppUrl(
  personA: BirthInput,
  personB: BirthInput,
  chartA: ZiWeiChart,
  chartB: ZiWeiChart,
  result: CompatibilityResult,
): string {
  return whatsappUrl(
    buildCompatibilityWhatsAppMessage(personA, personB, chartA, chartB, result),
  );
}
