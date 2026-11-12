/** 從命書文字解析十二流月（與 analyze-annual-report 品質門檻格式一致） */

export const LIUYUE_MONTHS_ZH = [
  "正月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
] as const;

export interface ParsedLiuyueMonth {
  month: string;
  theme: string;
  yi: string;
  ji: string;
  raw: string;
}

function splitYiJi(segment: string): { yi: string; ji: string } {
  const yiMatch = segment.match(/宜[：:]([^；;\n]*)/);
  const jiMatch = segment.match(/忌[：:]([^；;\n]*)/);
  return {
    yi: yiMatch?.[1]?.trim() ?? "",
    ji: jiMatch?.[1]?.trim() ?? "",
  };
}

export function parseLiuyueFromReport(text: string): ParsedLiuyueMonth[] {
  const results: ParsedLiuyueMonth[] = [];
  const lines = text.split(/\n/);

  for (const month of LIUYUE_MONTHS_ZH) {
    const line = lines.find((l) =>
      new RegExp(`^(?:農曆)?${month}\\s*[—\\-–]`).test(l.trim()),
    );
    if (!line) {
      results.push({ month, theme: "", yi: "", ji: "", raw: "" });
      continue;
    }
    const body = line.trim().replace(new RegExp(`^(?:農曆)?${month}\\s*[—\\-–]\\s*`), "");
    const themeMatch = body.match(/主題[：:]([^；;\n]+)/);
    const { yi, ji } = splitYiJi(body);
    results.push({
      month,
      theme: themeMatch?.[1]?.trim() ?? body.slice(0, 32),
      yi,
      ji,
      raw: body,
    });
  }

  return results;
}
