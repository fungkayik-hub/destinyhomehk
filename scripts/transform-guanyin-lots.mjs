/**
 * Transform senso-ji-stick-data data.zh.json → guanyin-lots.json
 * Source: https://github.com/Tamshen/senso-ji-stick-data (CC / open data)
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const rawPath = path.join(root, "data", "guanyin-lots-raw.json");
const outPath = path.join(root, "src", "data", "guanyin-lots.json");

const raw = JSON.parse(readFileSync(rawPath, "utf-8"));
const lots = [];

for (let i = 1; i < raw.qcs.length; i++) {
  const entry = raw.qcs[i];
  const [grade, poem, explanation, aspects, advice = ""] = entry;
  lots.push({
    number: i,
    grade: String(grade).trim(),
    poem: String(poem).trim(),
    explanation: String(explanation).trim(),
    aspects: String(aspects).trim(),
    advice: String(advice).trim(),
  });
}

mkdirSync(path.dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(lots, null, 2), "utf-8");
console.log(`Wrote ${lots.length} lots → ${outPath}`);
