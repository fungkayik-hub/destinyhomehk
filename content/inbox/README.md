# 每日文章匯入

## 學堂長文（SEO 文章）

1. 複製 `article.sample.json` → `article.json`
2. 填 `title`、`contentHtml`（建議最少 **1,500 字**，含 **2 段例子／故事**、FAQ、師傅一句）
3. 本地或 CI 執行：`npm run import-article`
4. **同步更新** `src/data/articles.json` 同 `content/inbox/done/` 備份
5. commit + push → 出現在 `/academy/{category}/{slug}`

寫作標準見 `.cursor/rules/academy-article-style.mdc`。

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
