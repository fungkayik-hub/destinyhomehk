# Instagram 匯出資料放喺呢度

1. 去 Instagram App → **設定** → **帳戶中心** → **你的資訊和權限** → **下載你的資訊**
2. 揀 **Instagram**、格式 **JSON**、只勾 **帖子**
3. Meta 會 email 連結，下載 zip 後**解壓成個 folder** 放喺呢度（入面應有 `your_instagram_activity/media/posts_1.json`）
4. 喺專案根目錄執行：

```bash
npm run import-instagram
```

會自動匯入**最新 20 篇**去 `/academy/instagram`。
