/** Google Search Console 建議追蹤關鍵詞（按意圖分組） */
export const GSC_KEYWORD_GROUPS = [
  {
    id: "brand",
    title: "品牌詞",
    note: "應該排第一頁；若無曝光要檢查品牌名是否寫入 title / schema",
    keywords: [
      "馮命居",
      "Destiny Home",
      "Sunny 師傅",
      "Sunny 師傅 紫微斗數",
      "destinyhomehk",
    ],
  },
  {
    id: "local",
    title: "本地服務詞（高轉化）",
    note: "灣仔／香港 + 服務；重點睇點擊率同預約轉化",
    keywords: [
      "灣仔紫微斗數",
      "灣仔算命師傅",
      "香港算命師傅",
      "香港紫微斗數師傅",
      "香港算命師傅推薦",
      "香港風水師傅",
      "駱克道 算命",
    ],
  },
  {
    id: "service",
    title: "服務詞",
    note: "對應 booking / chart 頁；留意曝光上升時 landing page 係咪啱",
    keywords: [
      "紫微斗數全批",
      "紫微斗數全批 香港",
      "結婚擇日 香港",
      "流年問事 香港",
      "紫微斗數排盤",
      "免費紫微斗數排盤",
      "香港免費紫微斗數排盤",
    ],
  },
  {
    id: "tool",
    title: "工具詞",
    note: "免費工具帶流量；睇 /chart、/qiu-qian、/compatibility 頁面表現",
    keywords: [
      "紫微排盤",
      "紫微斗數排盤 免費",
      "線上求籤",
      "姻緣探測器",
      "每日黃曆",
      "結婚擇日 免費",
    ],
  },
  {
    id: "content",
    title: "內容／學堂詞",
    note: "學堂文章長尾；曝光慢但累積價值高",
    keywords: [
      "十四主星",
      "破軍星 性格",
      "紫微格局",
      "府相朝垣格",
      "玄空飛星",
      "天地人盤 定盤",
      "AI 算命 準嗎",
    ],
  },
] as const;

/** 每月 GEO 監測流程（固定步驟） */
export const GEO_MONTHLY_CHECKLIST = [
  {
    step: 1,
    title: "準備（每月 1 號）",
    tasks: [
      "開新一行 Google Sheet（或 Notion），欄位見下方「記錄模板」",
      "確認 ChatGPT 已開搜尋、Perplexity 用預設模式",
      "用無痕視窗測 Google（避免個人化結果）",
    ],
  },
  {
    step: 2,
    title: "跑 10 條 AI 監測問題",
    tasks: [
      "每條問題分別喺 ChatGPT（搜尋開）、Perplexity、Google AI Overview 問一次",
      "記錄：有冇提到「馮命居／Destiny Home／Sunny 師傅」",
      "記錄：有冇引用 destinyhomehk.com（截圖 + URL）",
      "記錄：出現邊個競爭對手、引用邊個網站",
    ],
  },
  {
    step: 3,
    title: "查 Google Search Console（同週完成）",
    tasks: [
      "Performance → 過去 28 天 → 對照下方「GSC 關鍵詞清單」",
      "記錄每組有曝光嘅詞：曝光次數、點擊、平均排名",
      "Pages：/chart、/booking、/academy/* 邊頁流量升／跌",
      "Indexing：有冇新 404 或「已發現但未索引」",
    ],
  },
  {
    step: 4,
    title: "查 GA4（同週完成）",
    tasks: [
      "Reports → Engagement → Pages：/chart、/academy 流量趨勢",
      "Events：tool_submit、whatsapp_click、booking_submit 數量",
      "比較上月：免費工具用量有冇升",
    ],
  },
  {
    step: 5,
    title: "行動（測完 48 小時內）",
    tasks: [
      "AI 未引用你 → 寫一篇對應問題嘅學堂文或更新 /ai-faq",
      "GSC 有曝光無點擊 → 改該頁 title / description",
      "某關鍵詞排名 11–20 → 加內部連結指向該頁",
      "記低本月結論同下月重點（1–3 句）",
    ],
  },
] as const;

/** Google Sheet 記錄欄位 */
export const GEO_LOG_COLUMNS = [
  "日期",
  "平台（ChatGPT / Perplexity / Google AIO）",
  "監測問題",
  "提及品牌（Y/N）",
  "引用網站（Y/N）",
  "引用 URL",
  "競爭對手／其他來源",
  "備註",
  "下月內容動作",
] as const;

export const GSC_LOG_COLUMNS = [
  "關鍵詞",
  "分組",
  "曝光",
  "點擊",
  "CTR",
  "平均排名",
  "對應頁面",
  "本月動作",
] as const;
