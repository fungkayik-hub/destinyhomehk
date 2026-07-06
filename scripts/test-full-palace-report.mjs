/**
 * 試跑完整十二宮小師傅 AI 命書
 * node scripts/test-full-palace-report.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
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

const input = {
  year: 1993,
  month: 2,
  day: 1,
  hour: 10,
  minute: 45,
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
const { PALACES } = await import(
  pathToFileURL(resolve(root, "src/lib/ziwei/types.ts")).href
);

const chart = generateChart(input);
const soul = chart.palaces.find((p) => p.isSoulPalace);
const body = chart.palaces.find((p) => p.isBodyPalace);

console.log(`\n=== 完整十二宮小師傅 AI 命書試跑 ===`);
console.log(`出生：1993-2-1 10:45 男`);
console.log(`陽曆：${chart.solarDate} | 農曆：${chart.lunarDateText}`);
console.log(`四柱：${chart.chineseDate} | ${chart.fiveElement}`);
console.log(
  `命宮：${soul?.heavenlyStem}${soul?.earthlyBranch} ${soul?.stars.filter((s) => s.type !== "minor").map((s) => s.name).join("、") || "空宮"}`,
);
console.log(`身宮：${body?.name ?? "—"}`);
console.log(`\n共 ${PALACES.length} 宮，逐宮生成中…\n`);

const results = [];
const startAll = Date.now();

for (const palace of PALACES) {
  const t0 = Date.now();
  process.stdout.write(`  → ${palace} … `);
  const { text, provider } = await analyzePalaceReport(chart, palace);
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`${text.length} 字 · ${elapsed}s · ${provider}`);
  results.push({ palace, text, provider, chars: text.length, elapsed });
}

const totalChars = results.reduce((s, r) => s + r.chars, 0);
const totalSec = ((Date.now() - startAll) / 1000).toFixed(0);

const outDir = resolve(root, "scripts/output");
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, "full-report-1993-02-01-1045-male.txt");

const fileBody = [
  "Destiny Home · 小師傅 AI 命書（完整十二宮）",
  "AI 整理參考，非 Sunny 師傅親批",
  "",
  `出生：1993年2月1日 10:45 男`,
  `陽曆：${chart.solarDate}`,
  `農曆：${chart.lunarDateText}`,
  `四柱：${chart.chineseDate}`,
  `五行局：${chart.fiveElement}`,
  `命宮：${soul?.heavenlyStem}${soul?.earthlyBranch} ${soul?.stars.filter((s) => s.type !== "minor").map((s) => s.name).join("、") || "空宮"}`,
  `身宮：${body?.name ?? "—"}`,
  "",
  `總字數：${totalChars} 字 | 生成耗時：${totalSec} 秒`,
  "",
  "=".repeat(60),
  "",
  ...results.flatMap(({ palace, text, chars }) => [
    `【${palace}】（${chars} 字）`,
    "",
    text,
    "",
    "-".repeat(60),
    "",
  ]),
].join("\n");

writeFileSync(outPath, fileBody, "utf8");

console.log(`\n✅ 完成 — 總 ${totalChars} 字，耗時 ${totalSec}s`);
console.log(`📄 完整輸出：${outPath}\n`);

// JSON summary for tooling
console.log(JSON.stringify({ outPath, totalChars, totalSec, palaces: results.map((r) => ({ palace: r.palace, chars: r.chars, provider: r.provider })) }));
