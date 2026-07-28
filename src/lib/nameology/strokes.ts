import * as OpenCC from "opencc-js";
import kangxiStrokes from "@/data/kangxi-strokes.json";

const strokeMap = kangxiStrokes as Record<string, number>;
const toTraditional = OpenCC.Converter({ from: "cn", to: "tw" });

const CJK_CHAR =
  /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]/;

export function isCjkChar(char: string): boolean {
  return CJK_CHAR.test(char);
}

export function extractCjkChars(text: string): string[] {
  const chars: string[] = [];
  for (const ch of Array.from(text.normalize("NFC").trim())) {
    if (isCjkChar(ch)) chars.push(ch);
  }
  return chars;
}

/** 康熙筆劃查詢；簡體先轉繁再查，兩邊都試。 */
export function lookupKangxiStroke(char: string): {
  traditional: string;
  strokes: number;
} | null {
  const traditional = toTraditional(char);
  const strokes = strokeMap[traditional] ?? strokeMap[char];
  if (strokes == null) return null;
  return { traditional, strokes };
}
