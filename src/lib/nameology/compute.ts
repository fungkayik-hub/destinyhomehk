import { lookupLuck, reduceTo81 } from "./luck";
import type { GridResult, NameologyInput, NameologyResult } from "./types";
import { extractCjkChars, lookupKangxiStroke } from "./strokes";

const BAD_LUCK = new Set(["凶", "大凶", "凶多於吉"]);

function sum(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

function grid(
  key: GridResult["key"],
  label: string,
  role: string,
  strokes: number,
): GridResult {
  const luck = lookupLuck(strokes);
  return {
    key,
    label,
    role,
    strokes,
    number: reduceTo81(strokes),
    element: luck.element,
    luck: luck.luck,
    desc: luck.desc,
  };
}

/**
 * 台灣姓名學五格剖象（康熙筆劃）
 * - 單姓雙名 / 單姓單名 / 複姓雙名 / 複姓單名
 */
export function computeWuge(input: NameologyInput): NameologyResult {
  const surnameChars = extractCjkChars(input.surname);
  const givenChars = extractCjkChars(input.givenName);

  if (surnameChars.length < 1 || surnameChars.length > 2) {
    throw new Error("請輸入 1–2 個字嘅姓氏（支援複姓）。");
  }
  if (givenChars.length < 1 || givenChars.length > 3) {
    throw new Error("請輸入 1–3 個字嘅名字。");
  }

  const allChars = [...surnameChars, ...givenChars];
  const resolved = allChars.map((char) => {
    const hit = lookupKangxiStroke(char);
    if (!hit) {
      throw new Error(`「${char}」唔喺康熙字典筆劃庫，請改用繁體常見字再試。`);
    }
    return { char, traditional: hit.traditional, strokes: hit.strokes };
  });

  const sStrokes = resolved.slice(0, surnameChars.length).map((c) => c.strokes);
  const gStrokes = resolved.slice(surnameChars.length).map((c) => c.strokes);

  const isCompoundSurname = surnameChars.length === 2;
  const isSingleGiven = givenChars.length === 1;
  const lastSurname = sStrokes[sStrokes.length - 1]!;
  const firstGiven = gStrokes[0]!;
  const lastGiven = gStrokes[gStrokes.length - 1]!;

  // 天格
  const tian = isCompoundSurname ? sum(sStrokes) : lastSurname + 1;
  // 人格
  const ren = lastSurname + firstGiven;
  // 地格
  const di = isSingleGiven ? firstGiven + 1 : sum(gStrokes);
  // 外格
  let wai: number;
  if (isCompoundSurname && isSingleGiven) {
    wai = sStrokes[0]! + 1;
  } else if (isCompoundSurname) {
    wai = sStrokes[0]! + lastGiven;
  } else if (isSingleGiven) {
    wai = 2;
  } else {
    wai = lastGiven + 1;
  }
  // 總格（唔假添）
  const zong = sum([...sStrokes, ...gStrokes]);

  const grids: GridResult[] = [
    grid("tian", "天格", "先天運 · 約 1–12 歲", tian),
    grid("ren", "人格", "主運 · 約 25–36 歲（論命重點）", ren),
    grid("di", "地格", "前運 · 約 13–24 歲", di),
    grid("wai", "外格", "副運 · 約 37–48 歲", wai),
    grid("zong", "總格", "後天運 · 約 49 歲至晚年", zong),
  ];

  const renGrid = grids.find((g) => g.key === "ren")!;
  const zongGrid = grids.find((g) => g.key === "zong")!;
  const needsAttention =
    BAD_LUCK.has(renGrid.luck) || BAD_LUCK.has(zongGrid.luck);

  return {
    surname: surnameChars.join(""),
    givenName: givenChars.join(""),
    fullName: [...surnameChars, ...givenChars].join(""),
    isCompoundSurname,
    isSingleGiven,
    chars: resolved,
    grids,
    needsAttention,
  };
}
