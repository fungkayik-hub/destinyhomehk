/** 關鍵詞投放策略：廣告 vs 自然搜尋 */
export type ChannelStrategy = "ads" | "seo" | "both";

export type AdsCampaignId =
  | "brand"
  | "high-intent-reading"
  | "high-intent-dates"
  | "tools";

export const ADS_CAMPAIGN_LABELS: Record<AdsCampaignId, string> = {
  brand: "1. 品牌",
  "high-intent-reading": "2. 高意向·全批預約",
  "high-intent-dates": "3. 高意向·擇日改名",
  tools: "4. 工具引流",
};

export interface KeywordStrategy {
  keyword: string;
  group: string;
  /** ads=主要靠廣告；seo=靠內容同排名；both=兩邊一齊做 */
  channel: ChannelStrategy;
  landingPage: string;
  adsCampaign?: AdsCampaignId;
  /** 自然排名 ≤ 此值時，可考慮減廣告出價 */
  seoTakeoverRank?: number;
  note: string;
}

export const CHANNEL_LABELS: Record<ChannelStrategy, string> = {
  ads: "廣告優先",
  seo: "SEO 優先",
  both: "廣告 + SEO",
};

export const CHANNEL_BADGE_CLASS: Record<ChannelStrategy, string> = {
  ads: "bg-destiny-purple/15 text-destiny-purple border-destiny-purple/25",
  seo: "bg-emerald-50 text-emerald-800 border-emerald-200",
  both: "bg-destiny-gold/15 text-destiny-gold border-destiny-gold/35",
};

/** 全站關鍵詞策略表 — 對照 GSC 查詢 + Google Ads 搜尋字詞報告 */
export const KEYWORD_STRATEGIES: KeywordStrategy[] = [
  // 品牌
  {
    keyword: "馮命居",
    group: "品牌",
    channel: "both",
    landingPage: "/booking",
    adsCampaign: "brand",
    seoTakeoverRank: 3,
    note: "品牌必守；自然排前 3 可減廣告出價",
  },
  {
    keyword: "destiny home",
    group: "品牌",
    channel: "both",
    landingPage: "/booking",
    adsCampaign: "brand",
    seoTakeoverRank: 3,
    note: "英文品牌；Ad group 可另開",
  },
  {
    keyword: "sunny 師傅",
    group: "品牌",
    channel: "both",
    landingPage: "/booking",
    adsCampaign: "brand",
    seoTakeoverRank: 5,
    note: "個人品牌詞；留意大小寫變體",
  },
  {
    keyword: "sunny 紫微",
    group: "品牌",
    channel: "both",
    landingPage: "/booking",
    adsCampaign: "brand",
    note: "品牌變體",
  },
  {
    keyword: "destinyhomehk",
    group: "品牌",
    channel: "seo",
    landingPage: "/",
    note: "網域搜尋；靠品牌 SEO 即可",
  },
  // 本地高意向
  {
    keyword: "灣仔紫微斗數",
    group: "本地服務",
    channel: "both",
    landingPage: "/wan-chai-ziwei",
    adsCampaign: "high-intent-reading",
    seoTakeoverRank: 10,
    note: "核心本地詞；落地頁用灣仔專頁",
  },
  {
    keyword: "灣仔算命",
    group: "本地服務",
    channel: "both",
    landingPage: "/wan-chai-ziwei",
    adsCampaign: "high-intent-reading",
    seoTakeoverRank: 10,
    note: "Ad group B 地區本地",
  },
  {
    keyword: "灣仔算命師傅",
    group: "本地服務",
    channel: "both",
    landingPage: "/wan-chai-ziwei",
    adsCampaign: "high-intent-reading",
    note: "同灣仔算命",
  },
  {
    keyword: "香港算命師傅",
    group: "本地服務",
    channel: "both",
    landingPage: "/hong-kong-fortune-telling",
    adsCampaign: "high-intent-reading",
    seoTakeoverRank: 10,
    note: "廣泛本地詞；用香港落地頁",
  },
  {
    keyword: "香港算命師傅推薦",
    group: "本地服務",
    channel: "both",
    landingPage: "/hong-kong-fortune-telling",
    adsCampaign: "high-intent-reading",
    note: "高意向推薦類；title 要有好評數字",
  },
  {
    keyword: "香港紫微斗數師傅",
    group: "本地服務",
    channel: "both",
    landingPage: "/booking",
    adsCampaign: "high-intent-reading",
    seoTakeoverRank: 15,
    note: "服務 + 地區",
  },
  {
    keyword: "銅鑼灣 算命",
    group: "本地服務",
    channel: "ads",
    landingPage: "/wan-chai-ziwei",
    adsCampaign: "high-intent-reading",
    note: "鄰區詞；廣告先行，SEO 靠灣仔頁帶",
  },
  {
    keyword: "香港風水師傅",
    group: "本地服務",
    channel: "both",
    landingPage: "/academy/feng-shui",
    adsCampaign: "high-intent-dates",
    note: "風水服務；學堂風水專題支撐 SEO",
  },
  // 服務詞
  {
    keyword: "紫微斗數",
    group: "服務",
    channel: "both",
    landingPage: "/booking",
    adsCampaign: "high-intent-reading",
    seoTakeoverRank: 15,
    note: "競爭大；廣告必買，SEO 靠學堂 + 工具",
  },
  {
    keyword: "紫微斗數 香港",
    group: "服務",
    channel: "both",
    landingPage: "/booking",
    adsCampaign: "high-intent-reading",
    note: "詞組匹配",
  },
  {
    keyword: "紫微斗數 全批",
    group: "服務",
    channel: "both",
    landingPage: "/booking",
    adsCampaign: "high-intent-reading",
    seoTakeoverRank: 10,
    note: "最高意向；落地頁必須 /booking",
  },
  {
    keyword: "紫微斗數全批",
    group: "服務",
    channel: "both",
    landingPage: "/booking",
    adsCampaign: "high-intent-reading",
    note: "同全批變體",
  },
  {
    keyword: "紫微斗數 師傅",
    group: "服務",
    channel: "both",
    landingPage: "/booking",
    adsCampaign: "high-intent-reading",
    note: "師傅意圖強",
  },
  {
    keyword: "算命 師傅 香港",
    group: "服務",
    channel: "both",
    landingPage: "/hong-kong-fortune-telling",
    adsCampaign: "high-intent-reading",
    note: "廣泛服務詞",
  },
  {
    keyword: "結婚擇日 香港",
    group: "服務",
    channel: "both",
    landingPage: "/wedding-date",
    adsCampaign: "high-intent-dates",
    seoTakeoverRank: 15,
    note: "擇日專頁 + 免費 date-picker 引流",
  },
  {
    keyword: "流年問事 香港",
    group: "服務",
    channel: "ads",
    landingPage: "/booking",
    adsCampaign: "high-intent-reading",
    note: "量細；廣告精準投放",
  },
  {
    keyword: "命理 師傅 香港",
    group: "服務",
    channel: "both",
    landingPage: "/booking",
    adsCampaign: "high-intent-reading",
    note: "同算命師傅",
  },
  // 工具詞
  {
    keyword: "紫微排盤",
    group: "工具",
    channel: "both",
    landingPage: "/chart",
    adsCampaign: "tools",
    seoTakeoverRank: 20,
    note: "免費工具引流；轉化靠 WhatsApp",
  },
  {
    keyword: "紫微斗數排盤",
    group: "工具",
    channel: "both",
    landingPage: "/chart",
    adsCampaign: "tools",
    note: "核心工具詞",
  },
  {
    keyword: "免費紫微斗數排盤",
    group: "工具",
    channel: "both",
    landingPage: "/chart",
    adsCampaign: "tools",
    note: "免費字眼 CTR 高",
  },
  {
    keyword: "香港免費紫微斗數排盤",
    group: "工具",
    channel: "both",
    landingPage: "/chart",
    adsCampaign: "tools",
    note: "地區 + 免費",
  },
  {
    keyword: "紫微斗數排盤 免費",
    group: "工具",
    channel: "seo",
    landingPage: "/chart",
    note: "SEO 長尾；廣告可選",
  },
  {
    keyword: "線上求籤",
    group: "工具",
    channel: "both",
    landingPage: "/qiu-qian",
    adsCampaign: "tools",
    note: "求籤工具",
  },
  {
    keyword: "結婚擇日 免費",
    group: "工具",
    channel: "seo",
    landingPage: "/date-picker",
    note: "免費篩選 → 付費擇日轉化",
  },
  {
    keyword: "每日黃曆",
    group: "工具",
    channel: "seo",
    landingPage: "/daily",
    note: "每日更新；靠 SEO 累積",
  },
  {
    keyword: "姻緣探測器",
    group: "工具",
    channel: "seo",
    landingPage: "/compatibility",
    note: "小眾；SEO 即可",
  },
  // 內容／學堂
  {
    keyword: "十四主星",
    group: "內容",
    channel: "seo",
    landingPage: "/academy/stars",
    note: "學堂 hub；排盤頁已連結",
  },
  {
    keyword: "紫微格局",
    group: "內容",
    channel: "seo",
    landingPage: "/academy/geju",
    note: "75 篇格局文支撐",
  },
  {
    keyword: "府相朝垣格",
    group: "內容",
    channel: "seo",
    landingPage: "/academy/geju",
    note: "長尾格局名",
  },
  {
    keyword: "破軍星",
    group: "內容",
    channel: "seo",
    landingPage: "/academy/stars",
    note: "主星長尾",
  },
  {
    keyword: "玄空飛星",
    group: "內容",
    channel: "seo",
    landingPage: "/academy/feng-shui",
    note: "風水學堂",
  },
  {
    keyword: "天地人盤 定盤",
    group: "內容",
    channel: "seo",
    landingPage: "/academy/ding-pan",
    note: "定盤專題 + 排盤工具",
  },
  {
    keyword: "AI 算命 準嗎",
    group: "內容",
    channel: "seo",
    landingPage: "/ai-faq",
    note: "GEO + SEO 雙用",
  },
];

/** 見到 GSC 數據後點決策 */
export const GSC_DECISION_RULES = [
  {
    condition: "有曝光、CTR < 2%",
    action: "改該落地頁 title／description，加「過千好評」「灣仔」「WhatsApp」",
  },
  {
    condition: "排名 11–20、策略 = SEO",
    action: "加內部連結（學堂文 → 對應落地頁）、更新一篇相關文章",
  },
  {
    condition: "排名 ≤ seoTakeoverRank、廣告有買",
    action: "試減廣告出價 20%，觀察 2 週轉化有冇跌",
  },
  {
    condition: "廣告有 conversion、GSC 無曝光",
    action: "寫 1 篇學堂文針對該詞，或優化落地頁 H1",
  },
  {
    condition: "自然點擊升、廣告 CPC 高",
    action: "將預算由廣告詞轉去仍無自然排名嘅高意向詞",
  },
  {
    condition: "工具詞曝光升、whatsapp_click 少",
    action: "檢查 /chart 頁 CTA 位置；加「預約師傅全批」banner",
  },
] as const;

export const GSC_SETUP_STEPS = [
  {
    title: "驗證網站",
    detail: "GSC → 新增資源 → 網址前置字元 https://www.destinyhomehk.com",
    link: "https://search.google.com/search-console",
  },
  {
    title: "連結 GA4",
    detail: "設定 → 關聯 → 選 G-9785R0BX68（HKDD）",
    link: "https://analytics.google.com/",
  },
  {
    title: "連結 Google Ads",
    detail: "設定 → 關聯服務 → Google Ads 帳戶 651-333-4793",
    link: "https://ads.google.com/",
  },
  {
    title: "提交 Sitemap",
    detail: "索引 → Sitemap → 新增 https://www.destinyhomehk.com/sitemap.xml",
    link: null,
  },
  {
    title: "每月匯出查詢",
    detail: "成效 → 查詢 → 過去 28 天 → 匯出 CSV，貼入下方追蹤表",
    link: null,
  },
] as const;

export const MONTHLY_TRACKER_CSV_HEADER = [
  "記錄月份",
  "關鍵詞",
  "分組",
  "策略",
  "落地頁",
  "Ads Campaign",
  "GSC曝光",
  "GSC點擊",
  "GSC平均排名",
  "GSC_CTR",
  "廣告有買(Y/N)",
  "廣告點擊",
  "廣告轉換",
  "本月動作",
  "備註",
] as const;

/** 產生可下載嘅 CSV 模板（預填關鍵詞） */
export function buildMonthlyTrackerCsv(monthLabel = ""): string {
  const header = MONTHLY_TRACKER_CSV_HEADER.join(",");
  const rows = KEYWORD_STRATEGIES.map((k) =>
    [
      monthLabel,
      csvCell(k.keyword),
      csvCell(k.group),
      csvCell(CHANNEL_LABELS[k.channel]),
      csvCell(k.landingPage),
      csvCell(k.adsCampaign ? ADS_CAMPAIGN_LABELS[k.adsCampaign] : ""),
      "",
      "",
      "",
      "",
      k.channel !== "seo" ? "Y" : "N",
      "",
      "",
      "",
      csvCell(k.note),
    ].join(","),
  );
  return `\uFEFF${[header, ...rows].join("\n")}`;
}

function csvCell(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function groupStrategiesByChannel(): Record<ChannelStrategy, KeywordStrategy[]> {
  return {
    ads: KEYWORD_STRATEGIES.filter((k) => k.channel === "ads"),
    seo: KEYWORD_STRATEGIES.filter((k) => k.channel === "seo"),
    both: KEYWORD_STRATEGIES.filter((k) => k.channel === "both"),
  };
}
