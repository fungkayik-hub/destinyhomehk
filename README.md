# destinyhomehk

Destiny Home 獨立網站 — 脫離 Shopify，支援紫微即時排盤、網上擇日、預約服務。

## 功能

- **首頁** — 品牌介紹、三色人格統計、服務入口
- **紫微即時排盤** (`/chart`) — 輸入出生資料，即時生成十二宮命盤
- **網上擇日** (`/date-picker`) — 結婚/開業/入伙吉日搜尋
- **收費及預約** (`/booking`) — 服務方案與預約方式
- **紫微斗數學堂** (`/academy`) — 文章列表（待搬移內容）
- **關於師傅** (`/about`) — Sunny 師傅介紹

## 技術棧

- Next.js 15 + TypeScript + Tailwind CSS
- 自研紫微排盤原型引擎 (`src/lib/ziwei/`)
- 自研擇日原型引擎

## 開始使用

需要安裝 [Node.js](https://nodejs.org/)（建議 v20+）：

```bash
cd destinyhomehk
npm install
npm run dev
```

瀏覽 http://localhost:3000

## 重要提醒

排盤同擇日引擎目前係**原型版本**，正式上線前需要：

1. 接入完整農曆轉換庫
2. 按 Sunny 師傅門派校正星曜安星算法
3. 用已知命盤做對照測試
4. 完善擇日冲煞邏輯

## 脫離 Shopify 步驟

1. 完成新站開發同測試
2. 搬移 Shopify 文章同圖片
3. 將 `destinyhomehk.com` DNS 指向新主機（如 Vercel）
4. 設定 301 轉址保留 SEO
5. 確認預約流程正常後取消 Shopify 訂閱（無需網上收款）

## 部署建議

- **Vercel** — `vercel deploy`（最簡單）
- 域名在域名註冊商設定 CNAME 指向 Vercel
