export const siteConfig = {
  name: "Destiny Home",
  tagline: "香港紫微斗數 · 風水擇日 · Master Sunny",
  description:
    "【過千真實好評】Destiny Home 由 Sunny 師傅主理，提供專業紫微斗數命盤分析、結婚擇日、台灣姓名學及風水顧問服務。",
  announcement:
    "可能係最體貼嘅紫微斗數師傅 🤍🤍🤍 已達過千客人真實好評‼️請到 IG 查詢好評，不斷更新",
  announcementShort: "過千真實好評 ⭐ 4.9 · ViuTV · 企業風水講座",
  logo: "https://www.destinyhomehk.com/cdn/shop/files/Adobe_Express_-_file.png?v=1760593648",
  heroImage:
    "https://www.destinyhomehk.com/cdn/shop/files/10.18CharlotteSunny6242QP.jpg?v=1760597984",
  instagram: "https://www.instagram.com/destiny_home_/",
  whatsapp: {
    number: "85292631544",
    message: "你好，有興趣了解全批",
    label: "與 Sunny 聯絡",
  },
  phone: "+852 9263 1544",
  address: "灣仔駱克道382號1807室",
  hours: "星期一至六 12:00–20:00",
  rating: { score: 4.9, count: 1000 },
  school: "中洲派紫微斗數",
  pricingPromo: {
    title: "出 STORY 勁減 $200",
    detail: "於 Instagram story 分享可享折扣，詳情 WhatsApp 查詢。",
  },
};

/** 師傅收費表 — 與 IG / 店內價目一致 */
export const pricingPlans = [
  {
    id: "full-reading",
    title: "全批",
    duration: "需時 60–90 分鐘",
    description:
      "個人運程、婚姻、身心靈、事業、財運、父母、子女、兄弟、田宅、人緣、移民、健康等；含大限十年及流年分析。",
    price: "HK$2,000",
    whatsappMessage: "你好，我想預約全批，請問可預約時間同需要咩資料？",
    imageKey: "fullReading" as const,
    highlight: true,
  },
  {
    id: "date-picker",
    title: "擇日及吉時",
    duration: "需時 15–30 分鐘",
    description: "上頭、過大禮、出門、入門等結婚吉時擇日。",
    price: "HK$800",
    whatsappMessage: "你好，我想預約擇日及吉時（結婚），請問收費同需要咩資料？",
    imageKey: "datePicker" as const,
  },
  {
    id: "annual-inquiry",
    title: "流年 · 單項查詢／問事",
    duration: "需時 30–45 分鐘",
    description: "流月詳批，針對特定問題或年份深入分析。",
    price: "HK$1,000",
    whatsappMessage: "你好，我想做流年單項查詢／問事，請問可預約時間？",
    imageKey: "chart" as const,
  },
  {
    id: "feng-shui",
    title: "風水陽宅",
    description: "家居風水勘察及佈局建議，按實用面積計算。",
    price: "HK$11／尺",
    priceNote: "（實用尺）",
    whatsappMessage: "你好，我想預約風水陽宅，請問點計費同需要咩資料？",
    imageKey: "fengShui" as const,
  },
  {
    id: "birth-name",
    title: "擇日擇時生孩／改名",
    description: "包括 8 個名字建議及 15–30 分鐘電話講解。",
    price: "HK$3,800",
    whatsappMessage: "你好，我想預約擇日擇時生孩／改名，請問流程同需要咩資料？",
    imageKey: "nameNumerology" as const,
  },
] as const;

export const navItems = [
  { href: "/", label: "首頁" },
  { href: "/chart", label: "紫微即時排盤及分析" },
  { href: "/booking", label: "收費詳情及預約師傅" },
  {
    label: "紫微斗數學堂",
    children: [
      { href: "/academy/name-numerology", label: "台灣姓名學（總筆劃吉凶）" },
      { href: "/academy/history", label: "紫微斗數與子平八字的歷史故事" },
      { href: "/academy/feng-shui", label: "Sunny 談風水" },
      { href: "/academy/stories", label: "Sunny 講故事" },
      { href: "/academy/ding-pan", label: "天地人與定盤" },
      { href: "/academy/theory", label: "玄學理論" },
      { href: "/academy/2026-zodiac", label: "2026 十二生肖流年" },
    ],
  },
  { href: "/about", label: "關於師傅" },
];

export const services = [
  {
    title: "紫微斗數全批",
    description: "個人運程、十二宮、大限十年及流年，由 Sunny 師傅親批。",
    price: "HK$2,000",
    href: "/booking",
    imageKey: "fullReading" as const,
  },
  {
    title: "紫微即時排盤",
    description: "輸入出生資料，即時生成命盤，了解基本性格與命格方向。",
    price: "免費",
    href: "/chart",
    imageKey: "chart" as const,
  },
  {
    title: "結婚擇日及吉時",
    description: "上頭、過大禮、出門、入門等，由師傅親自擇日。",
    price: "HK$800",
    href: "/booking?service=date",
    imageKey: "datePicker" as const,
  },
  {
    title: "流年單項／問事",
    description: "流月詳批，針對特定問題或年份。",
    price: "HK$1,000",
    href: "/booking",
    imageKey: "chart" as const,
  },
  {
    title: "風水陽宅",
    description: "家居風水勘察，按實用面積 HK$11／尺。",
    price: "HK$11／尺",
    href: "/booking",
    imageKey: "fengShui" as const,
  },
  {
    title: "生孩擇日／改名",
    description: "8 個名字建議 + 電話講解。",
    price: "HK$3,800",
    href: "/booking",
    imageKey: "nameNumerology" as const,
  },
];

export const youtubeVideos = [
  {
    id: "hFCKjqmZBKs",
    title:
      "【Sunny 笑住講 EP010】眉毛有痣係好事？旺夫相 vs 剋夫相！從眼、耳、口、鼻、額頭、顴骨睇清一個人！",
  },
  {
    id: "XiedYrcA9DU",
    title: "【Sunny 笑住講】EP01 - 玄學與顏色（5 分鐘幫你找出人生方向）",
  },
];

export const academyCategories = [
  {
    slug: "name-numerology",
    title: "台灣姓名學（總筆劃吉凶）",
    description: "以總筆劃分析姓名吉凶，為改名提供專業參考。",
  },
  {
    slug: "history",
    title: "紫微斗數與子平八字的歷史故事",
    description: "探索兩大命理体系的歷史淵源與發展。",
  },
  {
    slug: "feng-shui",
    title: "Sunny 談風水",
    description: "家居風水、玄關佈局、九宮飛星等實用風水知識。",
  },
  {
    slug: "stories",
    title: "Sunny 講故事",
    description: "命理故事、人生感悟，以淺白方式分享玄學智慧。",
  },
  {
    slug: "ding-pan",
    title: "天地人與定盤",
    description: "定盤的重要性與方法，確保命盤準確。",
  },
  {
    slug: "theory",
    title: "玄學理論",
    description: "統計學與玄學、顏色論等核心理論。",
  },
  {
    slug: "2026-zodiac",
    title: "2026 十二生肖流年",
    description: "2026 年各生肖流年運勢分析。",
  },
  {
    slug: "stars",
    title: "十四主星專題",
    description: "紫微斗數十四主星逐一解析。",
  },
];

export function whatsappUrl(message?: string) {
  const text = encodeURIComponent(message ?? siteConfig.whatsapp.message);
  return `https://api.whatsapp.com/send?phone=${siteConfig.whatsapp.number}&text=${text}`;
}

export function whatsappDatePickerUrl() {
  return whatsappUrl(
    "你好，我想預約結婚／入伙擇日，請問收費同需要咩資料？",
  );
}
