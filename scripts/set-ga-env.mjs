#!/usr/bin/env node
/**
 * Set NEXT_PUBLIC_GA_ID on Vercel (production + preview).
 *
 * Usage: node scripts/set-ga-env.mjs G-XXXXXXXXXX
 */
import { execSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const gaId = process.argv[2]?.trim();
if (!gaId?.match(/^G-[A-Z0-9]+$/)) {
  console.error("Usage: node scripts/set-ga-env.mjs G-XXXXXXXXXX");
  process.exit(1);
}

const check = await fetch(
  `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`,
);
const body = await check.text();
if (!check.ok || body.length < 10_000 || body.includes("Error 404")) {
  console.error(`❌ ${gaId} is not a valid GA4 measurement ID (gtag.js returned ${check.status})`);
  process.exit(1);
}
console.log(`✅ ${gaId} validated (${body.length} bytes from gtag.js)`);

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

for (const env of ["production", "preview"]) {
  console.log(`→ Setting NEXT_PUBLIC_GA_ID on ${env}`);
  pipeToVercelEnv("NEXT_PUBLIC_GA_ID", gaId, env);
}

console.log("\nDone. Redeploy production for the change to take effect:");
console.log("  npx vercel deploy --prod");
