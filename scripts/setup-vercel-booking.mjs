#!/usr/bin/env node
/**
 * 網上預約 — Vercel 正式環境設定助手
 *
 * 用法：node scripts/setup-vercel-booking.mjs
 *
 * 步驟：
 * 1. 喺瀏覽器接受 Neon 條款（只需做一次）
 * 2. 本腳本會嘗試建立 Postgres 並 redeploy
 */

import { execSync } from "child_process";

const NEON_TERMS_URL =
  "https://vercel.com/destinyhome/~/integrations/accept-terms/neon?source=cli";

function run(cmd, opts = {}) {
  console.log(`\n> ${cmd}\n`);
  return execSync(cmd, { stdio: "inherit", cwd: process.cwd(), ...opts });
}

console.log(`
╔══════════════════════════════════════════════════════════════╗
║  Destiny Home — 網上預約 Vercel 設定                          ║
╚══════════════════════════════════════════════════════════════╝
`);

console.log("【第一步】接受 Neon 條款（只需做一次）");
console.log(`請喺瀏覽器開啟：\n  ${NEON_TERMS_URL}\n`);
console.log("接受條款後，按 Enter 繼續…");
process.stdin.resume();
await new Promise((resolve) => process.stdin.once("data", resolve));

try {
  run(
    "npx vercel integration add neon --name destinyhomehk-booking -e production -e preview",
  );
} catch {
  console.error("\nNeon 安裝失敗。請確認已接受條款，或喺 Vercel Dashboard → Storage 手動建立。");
  process.exit(1);
}

console.log("\n【第二步】確認環境變數");
console.log("BOOKING_NOTIFY_EMAIL 應已設為 fungkayik@gmail.com");
console.log("如未設定 Resend，請執行：");
console.log('  echo "re_你的密鑰" | npx vercel env add RESEND_API_KEY production');
console.log('  echo "re_你的密鑰" | npx vercel env add RESEND_API_KEY preview');

try {
  run("npx vercel env pull .env.vercel.check --environment=production");
} catch {
  /* optional */
}

console.log("\n【第三步】重新部署");
run("npx vercel deploy --prod");

console.log("\n✓ 完成！請到 https://www.destinyhomehk.com/book 試預約。");
