/**
 * Build src/data/kangxi-strokes.json from breezyreeds/kangxi-strokecount CSV.
 * Usage: node scripts/build-kangxi-strokes.mjs [path-to-csv]
 */
import fs from "fs";
import path from "path";

const csvPath = process.argv[2] || path.join(process.cwd(), "tmp-kangxi.csv");
const outPath = path.join(process.cwd(), "src", "data", "kangxi-strokes.json");

const raw = fs.readFileSync(csvPath, "utf8");
const lines = raw.split(/\r?\n/);
const map = {};
let start = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith("CodePoint,")) {
    start = i + 1;
    break;
  }
}
for (let i = start; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  const parts = line.split(",");
  if (parts.length < 4) continue;
  const ch = parts[2];
  const strokes = parseInt(parts[3], 10);
  if (ch && Number.isFinite(strokes)) map[ch] = strokes;
}

fs.writeFileSync(outPath, JSON.stringify(map));
console.log(`Wrote ${Object.keys(map).length} chars → ${outPath}`);
