/**
 * 將 content/inbox/done/*.json 嘅 contentHtml 同步到 src/data/articles.json
 * 用法：node scripts/sync-article.mjs 濱景花園玉環帶腰風水 北角玉帶環腰風水
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../src/data/articles.json");
const DONE_DIR = path.join(__dirname, "../content/inbox/done");

const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error("用法：node scripts/sync-article.mjs <slug> [slug2...]");
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(OUT, "utf8"));
const doneFiles = fs.readdirSync(DONE_DIR).filter((f) => f.endsWith(".json"));

for (const slug of slugs) {
  const doneFile = doneFiles.find((f) => f.includes(slug));
  if (!doneFile) {
    console.error(`找不到 done 檔：${slug}`);
    process.exit(1);
  }
  const input = JSON.parse(
    fs.readFileSync(path.join(DONE_DIR, doneFile), "utf8"),
  );
  const idx = db.articles.findIndex(
    (a) => a.category === input.category && a.slug === input.slug,
  );
  if (idx < 0) {
    console.error(`articles.json 找不到：${input.category}/${input.slug}`);
    process.exit(1);
  }
  db.articles[idx] = {
    ...db.articles[idx],
    title: input.title,
    content: input.contentHtml,
    image: input.image ?? db.articles[idx].image,
    publishedAt: input.publishedAt ?? db.articles[idx].publishedAt,
  };
  const chars = input.contentHtml.replace(/<[^>]+>/g, "").length;
  console.log(`已同步 ${input.slug}（${chars} 字）`);
}

fs.writeFileSync(OUT, JSON.stringify(db, null, 2) + "\n", "utf8");
console.log("articles.json 已更新");
