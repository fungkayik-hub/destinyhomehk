#!/usr/bin/env node
/** 只設定 BOOKING_NOTIFY_EMAIL（無需 Resend key） */
import { execSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const email = "fungkayik@gmail.com";

function setEnv(name, value, env) {
  const tmp = join(tmpdir(), `vercel-${name}.txt`);
  writeFileSync(tmp, value, "utf8");
  try {
    execSync(`npx vercel env rm ${name} ${env} --yes`, { stdio: "pipe" });
  } catch { /* */ }
  execSync(`npx vercel env add ${name} ${env} < "${tmp}"`, {
    stdio: "inherit",
    shell: true,
  });
  unlinkSync(tmp);
}

for (const env of ["production", "preview"]) {
  setEnv("BOOKING_NOTIFY_EMAIL", email, env);
}
console.log("✓ BOOKING_NOTIFY_EMAIL 已設定為", email);
