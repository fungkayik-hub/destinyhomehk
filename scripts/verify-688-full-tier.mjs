/**
 * Assert HK$688 全批 product definition (copy + checkout + AI prompt).
 * node scripts/verify-688-full-tier.mjs
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
}

const MONTHS_ZH = [
  "正月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "十一月", "十二月",
];

function monthlyThemesDistinctEnough(text) {
  const themes = [];
  for (const m of MONTHS_ZH) {
    const re = new RegExp(`${m}[^\\n]*主題[：:]([^；;\\n]+)`);
    const match = text.match(re);
    if (match?.[1]) themes.push(match[1].trim());
  }
  if (themes.length < 12) return false;
  return new Set(themes).size >= 8;
}

function fullTierStructureOk(text) {
  return (
    /【一生大運】/.test(text) &&
    /【十年大運】/.test(text) &&
    /【流年命運】/.test(text)
  );
}

const configSrc = readFileSync(resolve(root, "src/lib/palace-report/config.ts"), "utf8");
const fullCheckoutMatch = configSrc.match(
  /case "full":\s*\n\s*return "([^"]+)"/,
);
const fullCheckout = fullCheckoutMatch?.[1] ?? "";
if (!fullCheckout.includes("一生大運") || !fullCheckout.includes("十年大運")) {
  fail(`checkoutDescriptionForTier('full') unexpected: ${fullCheckout}`);
}

const copySrc = readFileSync(resolve(root, "src/lib/palace-report-copy.ts"), "utf8");
if (copySrc.includes("流年風水點化")) {
  fail("palace-report-copy still mentions 流年風水點化 in full-tier bullets");
}
if (!copySrc.includes("一生大運：命盤格局")) {
  fail("palace-report-copy missing new 一生大運 bullet");
}

const annualSrc = readFileSync(
  resolve(root, "src/lib/ai/analyze-annual-report.ts"),
  "utf8",
);
if (!annualSrc.includes("【一生大運】") || !annualSrc.includes("【十年大運】")) {
  fail("analyze-annual-report.ts full-tier prompt missing required sections");
}
if (annualSrc.includes("【流年風水點化】")) {
  fail("analyze-annual-report.ts still has feng shui chapter in full fallback");
}

const faqSrc = readFileSync(resolve(root, "src/lib/faq-content.ts"), "utf8");
if (faqSrc.includes("再加流年風水點化")) {
  fail("faq-content still describes old HK$688 upsell");
}

const sampleFull = [
  "【一生大運】",
  "【十年大運】",
  "【流年命運】",
  ...MONTHS_ZH.map((m, i) => `${m} — 主題：T${i}；宜：a；忌：b`),
].join("\n");

if (!fullTierStructureOk(sampleFull)) {
  fail("fullTierStructureOk rejected valid sample");
}
if (!monthlyThemesDistinctEnough(sampleFull)) {
  fail("monthlyThemesDistinctEnough rejected distinct sample");
}

if (process.exitCode) {
  console.error("\n688 full-tier verification failed.\n");
} else {
  console.log("OK: HK$688 全批 copy, checkout, and quality gates look correct.");
}
