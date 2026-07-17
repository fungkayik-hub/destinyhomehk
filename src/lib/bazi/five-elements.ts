/** 八字五行 — 由四柱推算缺五行與忌神（入門參考） */

export type WuXing = "金" | "木" | "水" | "火" | "土";

export const WU_XING_ORDER: WuXing[] = ["金", "木", "水", "火", "土"];

const STEM_ELEMENT: Record<string, WuXing> = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
};

const BRANCH_ELEMENT: Record<string, WuXing> = {
  子: "水",
  丑: "土",
  寅: "木",
  卯: "木",
  辰: "土",
  巳: "火",
  午: "火",
  未: "土",
  申: "金",
  酉: "金",
  戌: "土",
  亥: "水",
};

/** 五行相生：a 生 b */
function generates(a: WuXing, b: WuXing): boolean {
  const cycle: Record<WuXing, WuXing> = {
    木: "火",
    火: "土",
    土: "金",
    金: "水",
    水: "木",
  };
  return cycle[a] === b;
}

/** 五行相克：a 克 b */
function overcomes(a: WuXing, b: WuXing): boolean {
  const cycle: Record<WuXing, WuXing> = {
    木: "土",
    土: "水",
    水: "火",
    火: "金",
    金: "木",
  };
  return cycle[a] === b;
}

export interface BaziFiveElementsResult {
  dayMaster: string;
  dayMasterElement: WuXing;
  strength: "身強" | "身弱" | "中和";
  counts: Record<WuXing, number>;
  missing: WuXing[];
  taboo: WuXing[];
  favorable: WuXing[];
}

function emptyCounts(): Record<WuXing, number> {
  return { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };
}

function parsePillars(chineseDate: string): { stem: string; branch: string }[] {
  return chineseDate
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((pillar) => ({
      stem: pillar[0] ?? "",
      branch: pillar[1] ?? "",
    }));
}

/** 由四柱八字推算五行分佈、缺五行、喜忌（簡化版，供排盤速覽） */
export function analyzeBaziFiveElements(chineseDate: string): BaziFiveElementsResult | null {
  const pillars = parsePillars(chineseDate);
  if (pillars.length < 3) return null;

  const counts = emptyCounts();
  for (const { stem, branch } of pillars) {
    const stemEl = STEM_ELEMENT[stem];
    const branchEl = BRANCH_ELEMENT[branch];
    if (stemEl) counts[stemEl]++;
    if (branchEl) counts[branchEl]++;
  }

  const dayStem = pillars[2]?.stem ?? "";
  const dayMasterElement = STEM_ELEMENT[dayStem];
  if (!dayMasterElement) return null;

  const missing = WU_XING_ORDER.filter((el) => counts[el] === 0);

  let support = 0;
  let drain = 0;
  for (const el of WU_XING_ORDER) {
    const n = counts[el];
    if (el === dayMasterElement) {
      support += n;
    } else if (generates(el, dayMasterElement)) {
      support += n;
    } else if (generates(dayMasterElement, el)) {
      drain += n;
    } else if (overcomes(el, dayMasterElement)) {
      drain += n;
    } else if (overcomes(dayMasterElement, el)) {
      drain += n;
    }
  }

  let strength: BaziFiveElementsResult["strength"];
  if (support > drain + 1) strength = "身強";
  else if (drain > support + 1) strength = "身弱";
  else strength = "中和";

  const favorable: WuXing[] = [];
  const taboo: WuXing[] = [];

  for (const el of WU_XING_ORDER) {
    if (el === dayMasterElement) {
      if (strength === "身弱") favorable.push(el);
      else if (strength === "身強") taboo.push(el);
      continue;
    }
    if (generates(el, dayMasterElement)) {
      if (strength === "身弱") favorable.push(el);
      else if (strength === "身強") taboo.push(el);
    } else if (generates(dayMasterElement, el) || overcomes(dayMasterElement, el) || overcomes(el, dayMasterElement)) {
      if (strength === "身強") favorable.push(el);
      else if (strength === "身弱") taboo.push(el);
    }
  }

  return {
    dayMaster: dayStem,
    dayMasterElement,
    strength,
    counts,
    missing,
    taboo,
    favorable,
  };
}

export function formatWuXingList(elements: WuXing[], locale: "zh" | "en" = "zh"): string {
  if (elements.length === 0) {
    return locale === "en" ? "—" : "—";
  }
  return elements.join(locale === "en" ? ", " : "、");
}
