# 每日文章匯入

## 學堂長文（SEO 文章）

1. 複製 `article.sample.json` → `article.json`
2. 填 `title`、`content`（你每日俾我嘅文章貼入 `content`）
3. 本地或 CI 執行：`npm run import-article`
4. commit + push → 出現在 `/academy/daily-insights/...`

**喺 Cursor 對話：** 直接貼文章俾我，我可以幫你寫入 `article.json` 並 import。

## 流日當日點撥（覆蓋海報文案）

1. 建立 `content/daily/2026-06-22.json`：

```json
{
  "masterTip": "師傅今日想講嘅重點…",
  "quote": "一句金句",
  "headline": "【可選 — 覆蓋標題】"
}
```

2. `npm run import-daily-tip`
3. deploy 後 `/daily` 同 Story 圖會用新文案
