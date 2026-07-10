# 重新匯入步驟（修復紅色錯誤）

Google Ads Editor **我無法遠端操控**，但 CSV 已修好。你跟住做約 3 分鐘。

## 1. 清除舊嘅錯誤項目

喺 Editor 左邊：

1. 刪除 **命居**（如有）
2. 刪除 4 個 **DH-Brand / DH-FullReading / DH-DateNameFeng / DH-Tools**
3. **唔好發佈**

## 2. 按次序匯入（重要！）

**帳戶 → 匯入 → 從檔案**

| 次序 | 檔案 | 作用 |
|------|------|------|
| 1 | `campaigns.csv` | 4 個 Campaign + 預算 |
| 2 | `ad-groups.csv` | 8 個廣告群組（之前缺呢步） |
| 3 | `keywords.csv` | 關鍵字 |
| 4 | `rsa-ads.csv` | 廣告文案 |
| 5 | `negative-keywords.csv` | 否定字 |

**今次唔匯入 `extensions.csv`**（之後喺 ads.google.com 手動加站內連結）。

## 3. 檢查

- **DH-FullReading** → Ziwei-Full、Local-Area
- **DH-DateNameFeng** → Wedding-Date、Name-Change、Feng-Shui
- **DH-Tools** → Free-Chart、Online-Lot

紅色錯誤應該消失 → 先 **發佈**。

## 預算

DH-Brand $5 · DH-FullReading $15 · DH-DateNameFeng $7 · DH-Tools $3 = **$30/日**
