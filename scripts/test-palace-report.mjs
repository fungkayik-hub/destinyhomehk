/**
 * 試跑小師傅 AI 命書 — node scripts/test-palace-report.mjs [宮位]
 * 例：node scripts/test-palace-report.mjs 夫妻宮
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  for (const name of [".env.local", ".env.development.local"]) {
    try {
      const raw = readFileSync(resolve(root, name), "utf8");
      for (const line of raw.split("\n")) {
        const t = line.trim();
        if (!t || t.startsWith("#")) continue;
        const i = t.indexOf("=");
        if (i < 0) continue;
        const k = t.slice(0, i).trim();
        const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[k]) process.env[k] = v;
      }
    } catch {
      /* skip */
    }
  }
}

loadEnv();

const palace = process.argv[2]?.trim() || "夫妻宮";
const input = {
  year: parseInt(process.argv[3] ?? "1990", 10),
  month: parseInt(process.argv[4] ?? "1", 10),
  day: parseInt(process.argv[5] ?? "1", 10),
  hour: parseInt(process.argv[6] ?? "12", 10),
  minute: parseInt(process.argv[7] ?? "0", 10),
  gender: "male",
  calendarType: "solar",
  isLeapMonth: false,
  useTrueSolarTime: true,
};

const { generateChart } = await import(
  pathToFileURL(resolve(root, "src/lib/ziwei/iztro-adapter.ts")).href
);
const { analyzePalaceReport } = await import(
  pathToFileURL(resolve(root, "src/lib/ai/analyze-palace-report.ts")).href
);

console.log(`\n=== 小師傅 AI 命書試跑 ===`);
console.log(`出生：${input.year}-${input.month}-${input.day} ${input.hour}:${String(input.minute).padStart(2, "0")} 男`);
console.log(`宮位：${palace}\n`);

const chart = generateChart(input);
const soul = chart.palaces.find((p) => p.isSoulPalace);
console.log(`命宮：${soul?.stars.filter((s) => s.type !== "minor").map((s) => s.name).join("、") || "空宮"}`);
console.log("生成中…（約 10–30 秒）\n");

const start = Date.now();
const { text, provider } = await analyzePalaceReport(chart, palace);
const elapsed = ((Date.now() - start) / 1000).toFixed(1);

console.log(`Provider: ${provider}`);
console.log(`字數: ${text.length} 字`);
console.log(`耗時: ${elapsed}s`);
console.log("\n--- 命書正文 ---\n");
console.log(text);
console.log("\n--- 完 ---\n");
