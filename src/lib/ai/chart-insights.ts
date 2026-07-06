import type { PalaceInfo, PalaceName, ZiWeiChart } from "@/lib/ziwei/types";

const LUCUN_NAMES = new Set(["祿存", "禄存"]);

export type PatternConfidence = "高" | "中";

export interface DetectedPattern {
  slug: string;
  type: "吉" | "凶";
  confidence: PatternConfidence;
  evidence: string;
}

export interface ChartInsights {
  sanfangSummary: string;
  patterns: DetectedPattern[];
  mingMajorNames: string | null;
  mingComboTag: string | null;
  bodyVsSoul: string | null;
}

/** 主星雙星組合 — 優先於單星標籤 */
const COMBO_TAGS: Record<string, string> = {
  "七殺+文昌": "文武兼備，危機時反而醒，嘴硬心細",
  "七殺+文曲": "口才好兼行動力，談判同拍板都叻",
  "紫微+天府": "帶隊兼守成，有主見但唔衝動",
  "紫微+天相": "重形象識協調，做領導有人跟",
  "天機+天梁": "幕後參謀型，善分析，唔鍾意 front line",
  "天機+太陰": "腦筋細膩，諗嘢快又敏感",
  "太陽+太陰": "動靜兼備，對外熱心、內心細膩",
  "武曲+天府": "會賺會守，重實際，擅長管資源",
  "武曲+貪狼": "大器晚成，敢搏又有財商",
  "廉貞+天府": "外柔內剛，重規矩，感情同原則並存",
  "廉貞+七殺": "魄力強，做決定快，宜守法律界線",
  "太陰+天同": "隨和細心，人緣好，重生活質素",
  "貪狼+紫微": "多才帶貴氣，社交活躍，學嘢快",
  "巨門+太陽": "口才好、求名，宜對外發展",
  "天同+天梁": "逢凶化吉感，肯助人，有長者緣",
  "天相+廉貞": "重承諾有魅力，做中間人得",
  "破軍+紫微": "開創帶隊，敢變敢做",
};

function palaceIndex(palaces: PalaceInfo[], name: PalaceName): number {
  return palaces.findIndex((p) => p.name === name);
}

function palaceAt(palaces: PalaceInfo[], index: number): PalaceInfo {
  return palaces[((index % 12) + 12) % 12];
}

/** 三方四正：本宮、三合兩宮、對宮 */
export function sanfangSizheng(
  palaces: PalaceInfo[],
  center: PalaceName,
): PalaceInfo[] {
  const i = palaceIndex(palaces, center);
  if (i < 0) return [];
  return [
    palaceAt(palaces, i),
    palaceAt(palaces, i + 4),
    palaceAt(palaces, i + 8),
    palaceAt(palaces, i + 6),
  ];
}

function neighborPalaces(palaces: PalaceInfo[], center: PalaceName): [PalaceInfo, PalaceInfo] {
  const i = palaceIndex(palaces, center);
  return [palaceAt(palaces, i - 1), palaceAt(palaces, i + 1)];
}

function starNamesIn(palace: PalaceInfo): string[] {
  return palace.stars.map((s) => s.name);
}

function majorNamesIn(palace: PalaceInfo): string[] {
  return palace.stars.filter((s) => s.type !== "minor").map((s) => s.name);
}

function allStarsInRegion(region: PalaceInfo[]): Set<string> {
  const set = new Set<string>();
  for (const p of region) {
    for (const s of starNamesIn(p)) set.add(s);
  }
  return set;
}

function hasStar(region: PalaceInfo[], ...names: string[]): boolean {
  const stars = allStarsInRegion(region);
  return names.some((n) => stars.has(n));
}

function hasMajorInSoul(palaces: PalaceInfo[], ...names: string[]): boolean {
  const soul = palaces.find((p) => p.isSoulPalace);
  if (!soul) return false;
  return names.some((n) => majorNamesIn(soul).includes(n));
}

function soulPalace(palaces: PalaceInfo[]): PalaceInfo | undefined {
  return palaces.find((p) => p.isSoulPalace);
}

function soulBranch(palaces: PalaceInfo[]): string {
  return soulPalace(palaces)?.earthlyBranch ?? "";
}

function hasEmptySoul(palaces: PalaceInfo[]): boolean {
  const soul = soulPalace(palaces);
  return !soul || majorNamesIn(soul).length === 0;
}

function hasMutagenInRegion(region: PalaceInfo[], mutagen: string): boolean {
  return region.some((p) => p.stars.some((s) => s.mutagen === mutagen));
}

function mutagenPalace(palaces: PalaceInfo[], mutagen: string): PalaceName | null {
  for (const p of palaces) {
    if (p.stars.some((s) => s.mutagen === mutagen)) return p.name;
  }
  return null;
}

function hasLucunInRegion(region: PalaceInfo[]): boolean {
  return region.some((p) => p.stars.some((s) => LUCUN_NAMES.has(s.name)));
}

function palaceByBranch(palaces: PalaceInfo[], branch: string): PalaceInfo | undefined {
  return palaces.find((p) => p.earthlyBranch === branch);
}

function formatPalaceLine(p: PalaceInfo): string {
  const majors = p.stars
    .filter((s) => s.type !== "minor")
    .map((s) => {
      const parts = [s.name];
      if (s.brightness) parts.push(s.brightness);
      if (s.mutagen) parts.push(s.mutagen);
      return parts.length > 1 ? `${parts[0]}(${parts.slice(1).join("·")})` : s.name;
    })
    .join("、") || "空宮";
  const tags = [p.isSoulPalace ? "命" : "", p.isBodyPalace ? "身" : ""]
    .filter(Boolean)
    .join("/");
  return `${p.name}[${p.earthlyBranch}]${tags ? `(${tags})` : ""}：${majors}`;
}

function buildSanfangSummary(palaces: PalaceInfo[]): string {
  return buildPalaceSanfangSummary(palaces, "命宮");
}

/** 指定宮位嘅三方四正摘要（付費命書 prompt 用） */
export function buildPalaceSanfangSummary(
  palaces: PalaceInfo[],
  center: PalaceName,
): string {
  const region = sanfangSizheng(palaces, center);
  if (region.length === 0) return "";
  const lines = region.map(formatPalaceLine);
  const mutagens = region.flatMap((p) =>
    p.stars
      .filter((s) => s.mutagen)
      .map((s) => `${s.name}${s.mutagen}在${p.name}`),
  );
  const mutagenLine = mutagens.length > 0 ? `四化：${mutagens.join("、")}` : "";
  return [`【${center}三方四正】`, ...lines, mutagenLine].filter(Boolean).join("\n");
}

function majorComboTag(palace: PalaceInfo): string | null {
  const majors = majorNamesIn(palace).sort();
  if (majors.length < 2) return null;
  const key = majors.join("+");
  return COMBO_TAGS[key] ?? null;
}

function buildBodyVsSoul(palaces: PalaceInfo[]): string | null {
  const soul = soulPalace(palaces);
  const body = palaces.find((p) => p.isBodyPalace);
  if (!soul || !body) return null;
  if (body.name === soul.name) {
    return `身宮同命宮同宮（${soul.name}），內在性格同後天際遇方向一致。`;
  }
  const soulM = majorNamesIn(soul).join("、") || "空宮借星";
  const bodyM = majorNamesIn(body).join("、") || "空宮借星";
  return `命宮在${soul.name}（${soulM}）表內在性格；身宮在${body.name}（${bodyM}）表後天行為同實際際遇。分析時可講「內心 vs 做事方式」嘅分別。`;
}

function pushPattern(
  hits: DetectedPattern[],
  slug: string,
  type: "吉" | "凶",
  confidence: PatternConfidence,
  evidence: string,
): void {
  if (hits.some((h) => h.slug === slug)) return;
  hits.push({ slug, type, confidence, evidence });
}

/** 依 geju-patterns-data 規則檢測命盤格局 */
export function detectPatterns(chart: ZiWeiChart): DetectedPattern[] {
  const { palaces } = chart;
  const hits: DetectedPattern[] = [];
  const ming = sanfangSizheng(palaces, "命宮");
  const mingStars = allStarsInRegion(ming);
  const soul = soulPalace(palaces);
  const branch = soulBranch(palaces);
  const [left, right] = neighborPalaces(palaces, "命宮");

  // —— 吉格 ——
  if (hasMajorInSoul(palaces, "紫微") && branch === "午") {
    pushPattern(hits, "極向離明格", "吉", "高", "紫微在午宮坐命");
  }
  if (hasMajorInSoul(palaces, "紫微") && hasStar(ming, "左輔", "右弼")) {
    pushPattern(hits, "君臣慶會格", "吉", "高", "紫微守命，三方四正有左輔或右弼");
  }
  if ((branch === "寅" || branch === "申") && hasMajorInSoul(palaces, "紫微", "天府")) {
    pushPattern(hits, "紫府同宮格", "吉", "高", `安命${branch}，紫微天府同宮`);
  }
  if (hasStar(ming, "紫微", "天府")) {
    pushPattern(hits, "紫府朝垣格", "吉", "高", "紫微、天府於命宮三方四正會照");
  }
  if (hasStar(ming, "天府", "天相")) {
    pushPattern(hits, "府相朝垣格", "吉", "高", "天府、天相於命宮三方四正會照");
  }
  if ((branch === "卯" || branch === "酉") && hasMajorInSoul(palaces, "巨門", "天機")) {
    const hasJi = soul?.stars.some((s) => s.mutagen === "化忌");
    if (!hasJi) pushPattern(hits, "巨機同宮格", "吉", "高", `巨門天機在${branch}守命，無化忌同宮`);
  }
  if ((branch === "辰" || branch === "戌") && hasMajorInSoul(palaces, "天機", "天梁")) {
    pushPattern(hits, "善蔭朝綱格", "吉", "高", `天機天梁在${branch}守命`);
  }
  if (["天機", "太陰", "天同", "天梁"].every((s) => mingStars.has(s))) {
    pushPattern(hits, "機月同梁格", "吉", "高", "命宮三方四正會齊天機、太陰、天同、天梁");
  }
  if (hasMajorInSoul(palaces, "太陽") && branch === "午") {
    pushPattern(hits, "日麗中天格", "吉", "高", "太陽在午宮坐命");
  }
  if (hasMajorInSoul(palaces, "太陽") && branch === "卯") {
    pushPattern(hits, "日出扶桑格", "吉", "高", "太陽在卯宮坐命");
  }
  if ((branch === "丑" || branch === "未") && hasMajorInSoul(palaces, "太陽", "太陰")) {
    pushPattern(hits, "日月同宮格", "吉", "高", `命在${branch}，太陽太陰同宮`);
  }
  const sunInSi = palaceByBranch(palaces, "巳");
  const moonInYou = palaceByBranch(palaces, "酉");
  const sunInChen = palaceByBranch(palaces, "辰");
  const moonInXu = palaceByBranch(palaces, "戌");
  if (
    (sunInSi && majorNamesIn(sunInSi).includes("太陽") &&
      moonInYou && majorNamesIn(moonInYou).includes("太陰")) ||
    (sunInChen && majorNamesIn(sunInChen).includes("太陽") &&
      moonInXu && majorNamesIn(moonInXu).includes("太陰"))
  ) {
    if (hasStar(ming, "太陽", "太陰")) {
      pushPattern(hits, "日月並明格", "吉", "高", "太陽太陰居命宮三方四正");
    }
  }
  if (branch === "未" && hasEmptySoul(palaces)) {
    const mao = palaceByBranch(palaces, "卯");
    const hai = palaceByBranch(palaces, "亥");
    if (mao && majorNamesIn(mao).includes("太陽") && hai && majorNamesIn(hai).includes("太陰")) {
      pushPattern(hits, "明珠出海格", "吉", "高", "命在未空宮，太陽在卯、太陰在亥照命");
    }
  }
  if ((branch === "寅" || branch === "申") && hasMajorInSoul(palaces, "巨門", "太陽")) {
    pushPattern(hits, "巨日同宮格", "吉", "高", `巨門太陽在${branch}守命`);
  }
  if (hasStar(ming, "太陽", "天梁", "文昌") && hasLucunInRegion(ming)) {
    pushPattern(hits, "陽梁昌祿格", "吉", "高", "三方四正會齊太陽、天梁、文昌、祿存");
  }
  if ((branch === "丑" || branch === "未") && hasMajorInSoul(palaces, "武曲", "貪狼")) {
    pushPattern(hits, "貪武同行格", "吉", "高", `命在${branch}，武曲貪狼同守`);
  }
  if (hasMajorInSoul(palaces, "武曲") && (branch === "辰" || branch === "戌")) {
    pushPattern(hits, "將星得地格", "吉", "高", `武曲在${branch}坐命`);
  }
  if (hasMajorInSoul(palaces, "廉貞") && (branch === "寅" || branch === "申")) {
    pushPattern(hits, "雄宿朝垣格", "吉", "高", `廉貞在${branch}守命`);
  }
  if (hasMajorInSoul(palaces, "太陰") && branch === "亥") {
    pushPattern(hits, "月朗天門格", "吉", "高", "太陰在亥宮守命");
  }
  if (branch === "子" && hasMajorInSoul(palaces, "太陰", "天同")) {
    pushPattern(hits, "月生滄海格", "吉", "高", "太陰天同在子宮坐命");
  }
  if (hasMajorInSoul(palaces, "巨門") && (branch === "子" || branch === "午")) {
    pushPattern(hits, "石中隱玉格", "吉", "高", `巨門在${branch}守命`);
  }
  if (hasMajorInSoul(palaces, "天梁") && branch === "午") {
    pushPattern(hits, "壽星入廟格", "吉", "高", "天梁在午宮守命");
  }
  if (hasMajorInSoul(palaces, "七殺") && ["子", "午", "寅", "申"].includes(branch)) {
    pushPattern(hits, "七殺朝斗格", "吉", "高", `七殺在${branch}守命`);
  }
  if (hasMajorInSoul(palaces, "破軍") && (branch === "子" || branch === "午")) {
    pushPattern(hits, "英星入廟格", "吉", "高", `破軍在${branch}守命`);
  }
  if ((branch === "丑" || branch === "未") && hasMajorInSoul(palaces, "文昌", "文曲")) {
    pushPattern(hits, "文桂文華格", "吉", "高", `文昌文曲在${branch}守命`);
  }
  if (hasStar(ming, "文昌", "文曲")) {
    pushPattern(hits, "文星拱命格", "吉", "高", "文昌文曲俱在命宮三方四正");
  }
  if ((branch === "寅" || branch === "申") &&
    (majorNamesIn(left).includes("紫微") && majorNamesIn(right).includes("天府") ||
      majorNamesIn(left).includes("天府") && majorNamesIn(right).includes("紫微"))) {
    pushPattern(hits, "紫府夾命格", "吉", "高", `命在${branch}，紫微天府夾命`);
  }
  if ((branch === "丑" || branch === "未") &&
    (majorNamesIn(left).some((s) => s === "太陽") && majorNamesIn(right).some((s) => s === "太陰") ||
      majorNamesIn(left).some((s) => s === "太陰") && majorNamesIn(right).some((s) => s === "太陽"))) {
    pushPattern(hits, "日月夾命格", "吉", "高", `命在${branch}，太陽太陰夾命`);
  }
  if ((branch === "丑" || branch === "未") &&
    (majorNamesIn(left).some((s) => s === "左輔") && majorNamesIn(right).some((s) => s === "右弼") ||
      majorNamesIn(left).some((s) => s === "右弼") && majorNamesIn(right).some((s) => s === "左輔"))) {
    pushPattern(hits, "左右夾命格", "吉", "高", `命在${branch}，左輔右弼夾命`);
  }
  if ((branch === "丑" || branch === "未") &&
    (starNamesIn(left).some((s) => s === "文昌") && starNamesIn(right).some((s) => s === "文曲") ||
      starNamesIn(left).some((s) => s === "文曲") && starNamesIn(right).some((s) => s === "文昌"))) {
    pushPattern(hits, "昌曲夾命格", "吉", "高", `命在${branch}，文昌文曲夾命`);
  }
  if ((branch === "丑" || branch === "未") && hasMajorInSoul(palaces, "左輔", "右弼")) {
    pushPattern(hits, "左右同宮格", "吉", "高", `命在${branch}，左輔右弼同宮`);
  }
  if (hasLucunInRegion(ming) && hasMutagenInRegion(ming, "化祿")) {
    pushPattern(hits, "雙祿交流格", "吉", "高", "祿存同化祿俱在命宮三方四正");
  }
  if (hasMutagenInRegion(ming, "化祿") && hasMutagenInRegion(ming, "化權") && hasMutagenInRegion(ming, "化科")) {
    pushPattern(hits, "三奇嘉會格", "吉", "高", "化祿、化權、化科俱在命宮三方四正");
  }
  if (hasMutagenInRegion(ming, "化祿") && hasMutagenInRegion(ming, "化權")) {
    pushPattern(hits, "權祿巡逢格", "吉", "高", "化祿同化權俱在命宮三方四正");
  }
  if (hasStar(ming, "天魁", "天鉞")) {
    pushPattern(hits, "天乙拱命格", "吉", "高", "天魁天鉞俱在命宮三方四正");
  }
  if (hasMajorInSoul(palaces, "天魁") && hasStar(ming, "天鉞")) {
    pushPattern(hits, "坐貴向貴格", "吉", "高", "坐命天魁會天鉞");
  }
  if (hasMajorInSoul(palaces, "天鉞") && hasStar(ming, "天魁")) {
    pushPattern(hits, "坐貴向貴格", "吉", "高", "坐命天鉞會天魁");
  }
  const kePalace = mutagenPalace(palaces, "化科");
  const quanPalace = mutagenPalace(palaces, "化權");
  const luPalace = mutagenPalace(palaces, "化祿");
  if (kePalace === "命宮" && quanPalace && ming.some((p) => p.name === quanPalace)) {
    pushPattern(hits, "甲第登科格", "吉", "高", "化科在命，化權在三方會照");
  }
  if (kePalace === "命宮" && luPalace && ming.some((p) => p.name === luPalace)) {
    pushPattern(hits, "科名會祿格", "吉", "高", "化科在命，化祿在三方會照");
  }
  if (hasMajorInSoul(palaces, "擎羊") && ["丑", "辰", "未", "戌"].includes(branch)) {
    pushPattern(hits, "擎羊入廟格", "吉", "高", `擎羊在${branch}守命`);
  }
  if (hasStar(ming, "祿存", "天马", "天馬") || hasMutagenInRegion(ming, "化祿") && hasStar(ming, "天马", "天馬")) {
    if (hasStar(ming, "天马", "天馬")) {
      pushPattern(hits, "祿馬交馳格", "吉", "中", "命宮或三方有祿存/化祿同天馬");
    }
  }

  // 火贪 / 铃贪
  if (hasMajorInSoul(palaces, "貪狼")) {
    const hasHuo = hasStar(ming, "火星");
    const hasLing = hasStar(ming, "鈴星");
    if (hasHuo && hasLing) {
      pushPattern(hits, "火鈴貪格", "吉", "高", "貪狼守命，火星鈴星會照");
    } else if (hasHuo) {
      pushPattern(hits, "火貪格", "吉", "高", "貪狼守命，火星會照");
    } else if (hasLing) {
      pushPattern(hits, "鈴貪格", "吉", "中", "貪狼守命，鈴星會照");
    }
  }

  // 廉贞文武
  if (hasMajorInSoul(palaces, "廉貞")) {
    const guan = palaces.find((p) => p.name === "官祿宮");
    if (guan && majorNamesIn(guan).includes("武曲") && hasStar(ming, "文昌", "文曲")) {
      pushPattern(hits, "廉貞文武格", "吉", "高", "廉貞坐命，官祿武曲會，三方有昌曲");
    }
  }

  // —— 凶格 ——
  if (hasMajorInSoul(palaces, "擎羊") && branch === "午") {
    pushPattern(hits, "馬頭帶劍格", "凶", "高", "擎羊在午宮坐命");
  }
  if ((branch === "卯" || branch === "酉") && hasMajorInSoul(palaces, "紫微", "貪狼")) {
    pushPattern(hits, "極居卯酉格", "凶", "高", `紫微貪狼在${branch}同宮坐命`);
  }
  if (branch === "酉" && hasMajorInSoul(palaces, "巨門", "天機") && soul?.stars.some((s) => s.mutagen === "化忌")) {
    pushPattern(hits, "巨機化酉格", "凶", "高", "巨門天機在酉有化忌同宮");
  }
  if (hasEmptySoul(palaces)) {
    pushPattern(hits, "命無正曜格", "凶", "高", "命宮無十四主星，借對宮三方");
  }
  if (soul && starNamesIn(soul).some((s) => s === "地劫" || s === "地空")) {
    pushPattern(hits, "命裡逢空格", "凶", "中", "地劫或地空守命");
  }
  if (starNamesIn(left).some((s) => s === "地劫" || s === "地空") &&
    starNamesIn(right).some((s) => s === "地劫" || s === "地空")) {
    pushPattern(hits, "空劫夾命格", "凶", "高", "地劫地空夾命");
  }
  if ((branch === "丑" || branch === "未") && hasMajorInSoul(palaces, "廉貞", "七殺")) {
    pushPattern(hits, "貞殺同宮格", "凶", "高", `廉貞七殺在${branch}守命`);
  }
  if (hasMajorInSoul(palaces, "巨門") && hasStar(ming, "擎羊", "陀羅", "火星", "鈴星")) {
    pushPattern(hits, "巨逢四煞格", "凶", "中", "巨門守命，三方四正會煞星");
  }
  if (hasMajorInSoul(palaces, "貪狼") && branch === "子") {
    pushPattern(hits, "泛水桃花", "凶", "中", "貪狼在子守命");
  }

  return hits;
}

export function computeChartInsights(chart: ZiWeiChart): ChartInsights {
  const soul = soulPalace(chart.palaces);
  const mingMajors = soul ? majorNamesIn(soul) : [];
  return {
    sanfangSummary: buildSanfangSummary(chart.palaces),
    patterns: detectPatterns(chart),
    mingMajorNames: mingMajors.length > 0 ? mingMajors.join("+") : null,
    mingComboTag: soul ? majorComboTag(soul) : null,
    bodyVsSoul: buildBodyVsSoul(chart.palaces),
  };
}

export function formatInsightsBlock(insights: ChartInsights): string {
  const lines: string[] = [
    "════ 排盤摘要（程式已算好，請直接引用）════",
    insights.sanfangSummary,
  ];

  if (insights.patterns.length > 0) {
    lines.push("", "【程式檢測格局 — 有就必須提及，用中洲派格名】");
    for (const p of insights.patterns) {
      const mark = p.confidence === "高" ? "✓" : "△";
      lines.push(`${mark} ${p.slug}（${p.type}·${p.confidence}）：${p.evidence}`);
    }
  } else {
    lines.push("", "【程式檢測格局】未命中常見格局名，請依主星亮度同三方四正具體分析");
  }

  if (insights.mingComboTag && insights.mingMajorNames) {
    lines.push("", `【命宮主星組合】${insights.mingMajorNames} → ${insights.mingComboTag}（唔好只寫單星標籤）`);
  }

  if (insights.bodyVsSoul) {
    lines.push("", `【身命差異】${insights.bodyVsSoul}`);
  }

  return lines.join("\n");
}
