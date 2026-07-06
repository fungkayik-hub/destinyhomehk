/**
 * 試跑求籤 — node scripts/test-fortune-stick.mjs [問題]
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  for (const name of [".env.local", ".env.development.local", ".env"]) {
    try {
      const raw = readFileSync(resolve(root, name), "utf8");
      for (const line of raw.split("\n")) {
        const t = line.trim();
        if (!t || t.startsWith("#")) continue;
        const i = t.indexOf("=");
        if (i < 0) continue;
        const k = t.slice(0, i).trim();
        let v = t.slice(i + 1).trim();
        if (
          (v.startsWith('"') && v.endsWith('"')) ||
          (v.startsWith("'") && v.endsWith("'"))
        ) {
          v = v.slice(1, -1);
        }
        if (!process.env[k]) process.env[k] = v;
      }
    } catch {
      /* skip */
    }
  }
}

loadEnv();

const question = process.argv.slice(2).join(" ").trim() || "我今年應該轉工嗎";
const drawId = `demo-test-${Date.now()}`;

const { createDrawResult } = await import(
  pathToFileURL(resolve(root, "src/lib/fortune-stick/draw.ts")).href
);
const { analyzeFortuneStick } = await import(
  pathToFileURL(resolve(root, "src/lib/ai/analyze-fortune-stick.ts")).href
);
const { detectQuestionTheme } = await import(
  pathToFileURL(resolve(root, "src/lib/fortune-stick/question-theme.ts")).href
);

const result = createDrawResult(question, drawId);

console.log("\n=== 問題 ===");
console.log(question);
console.log(`主題：${detectQuestionTheme(question)}`);

console.log("\n=== 抽籤結果 ===");
console.log(`第 ${result.lot.number} 籤 · ${result.lot.grade}`);

console.log("\n=== 籤詩 ===");
console.log(result.lot.poem);

console.log("\n=== 免費答案（小徒弟一句）===");
console.log(result.teaser);

console.log("\n=== 付費答案（完整解讀）===");
console.log("生成中…（約 10–30 秒）\n");
const start = Date.now();
const paid = await analyzeFortuneStick(question, result.lot.number);
const elapsed = ((Date.now() - start) / 1000).toFixed(1);

console.log(`來源：${paid.provider}`);
console.log(`字數：${paid.text.length} 字`);
console.log(`耗時：${elapsed}s\n`);
console.log(paid.text);
console.log("\n--- 完 ---\n");
