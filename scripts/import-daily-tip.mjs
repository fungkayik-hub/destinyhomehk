/**
 * 匯入師傅自訂流日文案（覆蓋當日 masterTip 等）
 *
 * 1. 建立 content/daily/YYYY-MM-DD.json（見 sample）
 * 2. 執行：npm run import-daily-tip
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DAILY_DIR = path.join(__dirname, "../content/daily");
const OUT = path.join(__dirname, "../src/data/daily-overrides.json");

function main() {
  const argDate = process.argv[2];
  const files = argDate
    ? [`${argDate}.json`]
    : fs.existsSync(DAILY_DIR)
      ? fs.readdirSync(DAILY_DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      : [];

  if (files.length === 0) {
    console.error("用法：npm run import-daily-tip [YYYY-MM-DD]");
    console.error("或將 JSON 放入 content/daily/");
    process.exit(1);
  }

  const overrides = JSON.parse(fs.readFileSync(OUT, "utf8"));

  for (const file of files) {
    const date = file.replace(".json", "");
    const raw = JSON.parse(fs.readFileSync(path.join(DAILY_DIR, file), "utf8"));
    const patch = {};
    for (const key of ["headline", "specialTip", "masterTip", "closing", "quote"]) {
      if (raw[key]) patch[key] = raw[key];
    }
    overrides[date] = { ...overrides[date], ...patch };
    console.log(`已匯入流日覆蓋：${date}`);
  }

  fs.writeFileSync(OUT, JSON.stringify(overrides, null, 2), "utf8");
}

main();
