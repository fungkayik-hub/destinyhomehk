/**
 * 匯入單篇學堂文章
 *
 * 1. 將文章放入 content/inbox/article.json（見 sample）
 * 2. 執行：npm run import-article
 * 3. deploy 後出現在 /academy/{category}/{slug}
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INBOX = path.join(__dirname, "../content/inbox/article.json");
const OUT = path.join(__dirname, "../src/data/articles.json");

function slugify(title) {
  return title
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[?？!！.。,，]/g, "")
    .slice(0, 80) || `post-${Date.now()}`;
}

function paragraphsToHtml(text) {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

function main() {
  if (!fs.existsSync(INBOX)) {
    console.error(`找不到 ${INBOX}`);
    console.error("請複製 content/inbox/article.sample.json → article.json 並填寫內容");
    process.exit(1);
  }

  const input = JSON.parse(fs.readFileSync(INBOX, "utf8"));
  const title = input.title?.trim();
  const category = input.category?.trim() || "daily-insights";
  const slug = input.slug?.trim() || slugify(title);
  const content =
    input.contentHtml?.trim() ||
    (input.content ? paragraphsToHtml(input.content) : "");

  if (!title || !content) {
    console.error("article.json 需要 title 同 content（或 contentHtml）");
    process.exit(1);
  }

  const db = JSON.parse(fs.readFileSync(OUT, "utf8"));
  const existing = db.articles.findIndex(
    (a) => a.category === category && a.slug === slug,
  );

  const article = {
    slug,
    category,
    title,
    content,
    image: input.image ?? null,
    publishedAt: input.publishedAt ?? new Date().toISOString().slice(0, 10),
    sourceUrl: input.sourceUrl ?? `https://www.destinyhomehk.com/academy/${category}/${encodeURIComponent(slug)}`,
    type: "blog",
  };

  if (existing >= 0) {
    db.articles[existing] = article;
    console.log(`已更新：${category}/${slug}`);
  } else {
    db.articles.unshift(article);
    console.log(`已新增：${category}/${slug}`);
  }

  fs.writeFileSync(OUT, JSON.stringify(db, null, 2), "utf8");
  console.log(`共 ${db.articles.length} 篇 · 部署後網址：/academy/${category}/${slug}`);

  const doneDir = path.join(__dirname, "../content/inbox/done");
  fs.mkdirSync(doneDir, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  fs.renameSync(INBOX, path.join(doneDir, `${stamp}-${slug}.json`));
  console.log("inbox 已移至 content/inbox/done/");
}

main();
