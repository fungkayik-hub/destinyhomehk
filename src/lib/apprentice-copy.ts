/** 對外文案 — 師傅門下小徒弟（唔 front 寫 AI） */
export const apprenticeCopy = {
  badge: "Destiny Home · 師傅小徒弟",
  tagline: "師傅授意 · 免費贈你幾句",
  shortBadge: "小徒弟贈言",
  analysisDisclaimer:
    "以上為小徒弟按中洲派排盤整理嘅入門參考，僅供參考。",
  notMasterNote: "非 Sunny 師傅親批",
  dingPanNote: "定盤、大限流年請 WhatsApp 預約師傅",
  swipeHint: "左右滑動揀其他宮位。",
  scoreLegend: "評分僅供入門參考，非師傅親批。",
  chartSectionHint: "左右滑動揀宮 · 小徒弟逐宮贈你幾句，越睇越清楚",
  clickForAnalysis: "點擊睇小徒弟贈言 →",
  clickPalaceHint: "點擊外圍宮位睇小徒弟贈言",
  loadingHint: "首次起盤約需 10–20 秒（小徒弟整理贈言）；換排版唔使再等。採用《紫微斗數全書》三合派安星法。",
  /** 姻緣探測器 */
  detectorName: "姻緣探測器",
  detectorSubtitle: "紫微斗數雙人配對 · 師傅授意免費贈言",
  detectorBadge: "Destiny Home · 師傅小徒弟 · 姻緣探測",
  detectorScoreLabel: "姻緣指數",
  detectorSubmit: "開始探測姻緣",
  detectorFormHint:
    "用夫妻宮、命宮交叉探測緣分 — 入門贈言免費，深入合婚請 WhatsApp 師傅。",
  detectorLoadingHint: "首次探測約需 10–20 秒（小徒弟整理贈言）；同一對資料唔使再等。",
  detectorFormFooter:
    "入門贈言僅供參考；感情細節、結婚時機、大限流年等，建議預約師傅合婚全批。",
  detectorDisclaimer:
    "以上為小徒弟按雙方命盤整理嘅入門參考，僅供參考。",
  detectorDingPanNote: "深入合婚、結婚時機、大限流年請 WhatsApp 預約師傅",
  chemistryTitle: "緣分火花",
  strengthsTitle: "徒弟睇到嘅位",
  tipsTitle: "呢對咁相處會順啲",
  factorsTitle: "探測維度",
  factorHookPrefix: "呢個維度要留意 —",
} as const;

export const apprenticeCopyEn = {
  badge: "Destiny Home · Master's apprentice",
  tagline: "A few free lines for you",
  shortBadge: "Apprentice notes",
  analysisDisclaimer:
    "Entry-level notes arranged from your chart using Zhong Zhou school rules — for reference only.",
  notMasterNote: "Not a reading by Master Sunny in person",
  dingPanNote: "For chart confirmation, decade luck & annual cycles — WhatsApp Master Sunny",
  swipeHint: "Swipe to explore other palaces.",
  scoreLegend: "Scores are for reference only — not a master reading.",
  chartSectionHint: "Swipe palaces · a few free lines per palace from the apprentice",
  clickForAnalysis: "Tap for apprentice notes →",
  clickPalaceHint: "Tap a palace for apprentice notes",
  loadingHint:
    "First chart may take 10–20s (apprentice notes); layout changes are instant. Zhong Zhou school method.",
} as const;

export function getApprenticeCopy(locale: "zh" | "en" = "zh") {
  return locale === "en" ? apprenticeCopyEn : apprenticeCopy;
}
