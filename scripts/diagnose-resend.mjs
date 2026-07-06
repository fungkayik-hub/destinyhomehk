/**
 * 診斷 Resend 設定 — 唔會 commit，用畢請刪 .env.production.test
 * 用法：node scripts/diagnose-resend.mjs
 */
import { readFileSync } from "fs";
import { Resend } from "resend";

function loadEnvFile(path) {
  const env = {};
  try {
    const raw = readFileSync(path, "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (!m) continue;
      const key = m[1].trim();
      let val = m[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  } catch {
    /* ignore */
  }
  return env;
}

const env = loadEnvFile(".env.production.test");
const apiKey = env.RESEND_API_KEY?.trim();
const notifyEmail = env.BOOKING_NOTIFY_EMAIL?.trim() || "fungkayik@gmail.com";
const fromEmail = env.BOOKING_FROM_EMAIL?.trim() || "Destiny Home <onboarding@resend.dev>";

console.log("=== Resend 診斷 ===\n");

if (!apiKey) {
  console.log("❌ RESEND_API_KEY：未設定或係空字串");
  console.log("   Vercel 可能顯示「已加入」，但值係空 — 請喺 Dashboard 重新貼上完整 key");
  process.exit(1);
}

console.log(`✓ RESEND_API_KEY：已設定（長度 ${apiKey.length}，開頭 ${apiKey.slice(0, 6)}...）`);
if (apiKey !== env.RESEND_API_KEY) {
  console.log("⚠️  API key 首尾有空格，已 trim — Vercel 上建議重新設定");
}
if (apiKey.length < 20) {
  console.log("⚠️  API key 似乎太短，可能不完整");
}

console.log(`✓ 收件人 BOOKING_NOTIFY_EMAIL：${notifyEmail}`);
console.log(`✓ 寄件人：${fromEmail}\n`);

const resend = new Resend(apiKey);
const { data, error } = await resend.emails.send({
  from: fromEmail,
  to: notifyEmail,
  subject: "【測試】Destiny Home 預約通知診斷",
  html: "<p>如果你收到呢封 email，代表 Resend 設定正常。</p>",
});

if (error) {
  console.log("❌ Resend 發送失敗：");
  console.log(JSON.stringify(error, null, 2));
  console.log("\n常見原因：");
  console.log("- onboarding@resend.dev 只可以寄去 Resend 註冊 email");
  console.log("- API key 無效或過期");
  console.log("- 需要驗證 destinyhomehk.com 域名");
  process.exit(1);
}

console.log("✅ 測試 email 已發送！");
console.log(`   Resend ID: ${data?.id}`);
console.log(`   請檢查 ${notifyEmail}（同垃圾郵件）`);
