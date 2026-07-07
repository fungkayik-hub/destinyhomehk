# 馮命居 Google Ads 投放手冊

> **帳戶 ID：** 651-333-4793  
> **GA4：** G-T5XOGBRFXY（屬性 HKDD / 472825889；注意係字母 **O** 唔係數字 0）  
> **網站：** https://www.destinyhomehk.com  
>
> ⚠️ 本文 **不包含** 預算金額、出價、每日花費 — 全部由你自行決定。

---

## 一、帳戶結構（建議 4 個 Search Campaign）

| Campaign | 目的 | 落地頁 | 出價策略（類型） |
|----------|------|--------|------------------|
| **1. 品牌** | 搶自己名 | `/` 或 `/booking` | 你決定預算；可用手動 CPC |
| **2. 高意向·全批預約** | WhatsApp / 預約 | `/booking` | 有轉換後 → 盡量提高轉換 |
| **3. 高意向·擇日改名** | 結婚擇日、改名 | `/wedding-date`、`/booking` | 同上 |
| **4. 工具引流** | 免費排盤、求籤再轉化 | `/chart`、`/qiu-qian` | 盡量爭取點擊或手動 CPC |

**唔建議而家開：** Performance Max（數據少時難控制）、Display 展示（易浪費點擊）。

---

## 二、地區與時段

| 設定 | 建議 |
|------|------|
| **地區** | 香港（可加澳門如你有客） |
| **語言** | 繁體中文；英文可另開 Ad group 指向 `/en` |
| **廣告時段** | 星期一至六 **12:00–20:00**（配合營業時間；具體加減由你決定） |
| **排除** | 唔相關國家一律排除 |

---

## 三、轉換設定（已完成方向）

### 主要轉換（用嚟 optimize）
- `whatsapp_click` → 分類：**聯絡**
- `booking_submit` → 分類：**聯絡**

### 次要（只觀察，唔做主要）
- `booking_checkout_start`
- `page_view`、到達某頁

### 匯入路徑
Google Ads → **目標 → 轉換** → 從 **GA4 HKDD** 匯入上述事件。

---

## 四、Campaign 1 — 品牌

### Ad group：品牌字
```
馮命居
destiny home
destiny home 紫微
sunny 師傅
sunny 紫微
中洲派 sunny
```

**廣告最終網址：** `https://www.destinyhomehk.com/booking`

### RSA 標題（揀 8–15 條）
```
馮命居 · Sunny 師傅親批
灣仔紫微斗數全批
過千 Google 好評 ⭐4.9
中洲派紫微斗數
WhatsApp 即時預約
真人師傅 · 非 AI 訂閱
駱克道382號 · 灣仔
全批 60–90 分鐘講足
```

### RSA 描述（揀 3–4 條）
```
灣仔馮命居｜Sunny 師傅親批紫微斗數。十二宮、大限流年一次講足。WhatsApp 預約。
過千真實好評。中洲派紫微斗數。星期一至六 12:00–20:00。免費排盤試用。
```

---

## 五、Campaign 2 — 高意向·全批預約

### Ad group A：紫微全批
**關鍵字（詞組或完全匹配為主）：**
```
紫微斗數
紫微斗數 香港
紫微斗數 全批
紫微斗數 師傅
紫微斗數 灣仔
算命 師傅 香港
命理 師傅 香港
```

**落地頁：** `https://www.destinyhomehk.com/booking`  
**本地頁（可 A/B）：** `https://www.destinyhomehk.com/wan-chai-ziwei`

### Ad group B：地區本地
```
灣仔 算命
灣仔 紫微斗數
銅鑼灣 算命
香港 算命師傅
香港 紫微斗數師傅
```

**落地頁：** `https://www.destinyhomehk.com/wan-chai-ziwei`

### RSA 標題
```
灣仔紫微斗數全批
Sunny 師傅親自講解
十二宮 · 大限 · 流年
過千 Google 好評
WhatsApp 預約師傅
中洲派定盤
免費排盤試用
真人 60–90 分鐘
```

### RSA 描述
```
想知事業、感情、流年？馮命居 Sunny 師傅全批，灣仔工作室，WhatsApp 預約。
唔係月費 AI — 真人師傅親批。可先免費排盤，再預約深入解盤。
```

---

## 六、Campaign 3 — 擇日 · 改名 · 風水

### Ad group：結婚擇日
```
結婚擇日
結婚擇日 香港
婚禮 擇日
上頭 吉時
結婚 吉日
擺酒 擇日
```

**落地頁：** `https://www.destinyhomehk.com/wedding-date`

### Ad group：改名 / 姓名學
```
改名 香港
嬰兒 改名
姓名學 總格
改名 師傅
```

**落地頁：** `https://www.destinyhomehk.com/academy/name-numerology` 或 `/booking`

### Ad group：風水
```
家居 風水
風水 師傅 香港
風水 勘察
```

**落地頁：** `https://www.destinyhomehk.com/academy/feng-shui` 或 `/booking`

---

## 七、Campaign 4 — 工具引流（量大利細，要否定字）

### Ad group：免費排盤
```
紫微 排盤
紫微斗數 排盤
命盤 免費
```

**落地頁：** `https://www.destinyhomehk.com/chart`

### Ad group：求籤
```
線上 求籤
觀音 靈籤
一事一問
```

**落地頁：** `https://www.destinyhomehk.com/qiu-qian`

> 工具頁廣告文案要寫明：「免費試用 → 深入請 WhatsApp 師傅」，避免只吸引免費客。

---

## 八、否定關鍵字（帳戶層級共享）

```
免費 app
下載
自己學
課程
書籍
pdf
打工
招聘
兼職
星座 每日
十二生肖 今日運程
youtube
抖音
小紅書
大陸
台灣 免費
game
遊戲
```

定期檢查 **搜尋字詞報告**，將唔相關字加入否定。

---

## 九、廣告附加資訊（Extensions）

| 類型 | 內容 |
|------|------|
| **來電** | +852 9263 1544 |
| **地址** | 灣仔駱克道382號1807室（連結 Google Business Profile） |
| **站內連結** | 免費排盤 `/chart`、收費預約 `/booking`、結婚擇日 `/wedding-date`、線上求籤 `/qiu-qian` |
| **附加說明** | 過千好評、中洲派紫微、WhatsApp 預約、星期一至六營業 |
| **結構化摘要** | 服務：全批、擇日、改名、風水 |

---

## 十、出價策略（只講類型，金額你定）

| 階段 | 條件 | 建議策略類型 |
|------|------|--------------|
| **起步** | 轉換少於 ~15 次/月 | 手動 CPC 或 盡量爭取點擊（**預算由你定**） |
| **穩定** | 每月有穩定 `whatsapp_click` / `booking_submit` | **盡量提高轉換**（主要轉換揀聯絡類） |
| **進階** | 轉換多且穩定 | 可試目標每次轉換費用（**目標金額由你定**） |

---

## 十一、每週檢查清單

- [ ] 搜尋字詞報告 → 加否定字
- [ ] 轉換：WhatsApp、預約有冇錄到
- [ ] 廣告文案：CTR 低於同類中位數 → 換標題
- [ ] 落地頁：高意向字去 `/booking`，唔好全部去首頁
- [ ] GA4 即時 + Ads 轉換數是否接近

---

## 十二、常見錯誤（避免）

1. ❌ 全部廣告去首頁  
2. ❌ 用 `page_view` 做主要轉換  
3. ❌ 開太多 campaign 分散數據  
4. ❌ 否定字太少，浪費在「免費學紫微」  
5. ❌ 未連 GA4 就開「盡量提高轉換」

---

## 十三、網站已追蹤嘅 GA4 事件

| 事件 | 觸發位置 |
|------|----------|
| `whatsapp_click` | 浮動 WhatsApp 掣、師傅 CTA、預約頁等 |
| `booking_submit` | 網上預約表單提交 |
| `booking_checkout_start` | 開始 Stripe 付款流程 |

在 Google Ads 確認以上已匯入並設為 **主要轉換（聯絡）**。
