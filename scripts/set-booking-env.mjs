#!/usr/bin/env node
/**
 * 安全設定 Vercel 環境變數（避免 echo 尾隨換行導致空值）
 *
 * 用法：
 *   node scripts/set-booking-env.mjs re_你的Resend密鑰
 *
 * 或先設本地再執行：
 *   $env:RESEND_API_KEY="re_xxx"; node scripts/set-booking-env.mjs
 */
import { execSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const resendKey = process.argv[2]?.trim() || process.env.RESEND_API_KEY?.trim();
const notifyEmail = "fungkayik@gmail.com";

if (!resendKey || !resendKey.startsWith("re_")) {
  console.error("用法: node scripts/set-booking-env.mjs re_你的Resend密鑰");
  console.error("或設定環境變數 RESEND_API_KEY 後執行");
  process.exit(1);
}

function pipeToVercelEnv(name, value, env) {
  const tmp = join(tmpdir(), `vercel-env-${name}-${Date.now()}.txt`);
  writeFileSync(tmp, value, "utf8");
  try {
    execSync(`npx vercel env rm ${name} ${env} --yes`, { stdio: "pipe" });
  } catch {
    /* may not exist */
  }
  execSync(`npx vercel env add ${name} ${env} < "${tmp}"`, {
    stdio: "inherit",
    shell: true,
  });
  unlinkSync(tmp);
}

console.log("設定 Vercel Production 環境變數…\n");

for (const env of ["production", "preview"]) {
  console.log(`→ ${env}`);
  pipeToVercelEnv("RESEND_API_KEY", resendKey, env);
  pipeToVercelEnv("BOOKING_NOTIFY_EMAIL", notifyEmail, env);
}

console.log("\n驗證 Resend key…");
process.env.RESEND_API_KEY = resendKey;
process.env.BOOKING_NOTIFY_EMAIL = notifyEmail;
execSync("node -e \"import('resend').then(async ({Resend})=>{const r=new Resend(process.env.RESEND_API_KEY);const {data,error}=await r.emails.send({from:'Destiny Home <onboarding@resend.dev>',to:process.env.BOOKING_NOTIFY_EMAIL,subject:'【設定確認】Destiny Home',html:'<p>Vercel 環境變數已更新。</p>'});if(error){console.error('Resend 失敗:',error);process.exit(1)}console.log('✅ 測試 email 已發送, id:',data.id)})\"", {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, RESEND_API_KEY: resendKey, BOOKING_NOTIFY_EMAIL: notifyEmail },
});

console.log("\n完成！請執行: npx vercel deploy --prod");
