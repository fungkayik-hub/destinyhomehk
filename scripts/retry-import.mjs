/** Retry failed imports only */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, "../src/data/articles.json");

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "zh-TW,zh;q=0.9",
};

function decodeHtml(html) {
  return html.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ");
}

function extractContent(html) {
  const titleMatch =
    html.match(/<h1[^>]*class="[^"]*article-template__title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i) ||
    html.match(/<h1[^>]*class="[^"]*main-page-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i);
  const title = decodeHtml(titleMatch?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "");
  const contentMatch =
    html.match(/<div[^>]*class="[^"]*article-template__content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*class="[^"]*article-template__social/i) ||
    html.match(/<div[^>]*class="[^"]*article-template__content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/article/i) ||
    html.match(/<main[^>]*id="MainContent"[^>]*>([\s\S]*?)<\/main/i);
  let content = (contentMatch?.[1] ?? "").replace(/<script[\s\S]*?<\/script>/gi, "").trim();
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/i);
  const image = imgMatch?.[1]?.replace(/^http:/, "https:") ?? null;
  const dateMatch = html.match(/<time[^>]*datetime="([^"]+)"/i);
  return { title, content, image, publishedAt: dateMatch?.[1] ?? null };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) throw new Error(`${res.status}`);
      return res.text();
    } catch (e) {
      if (i === retries - 1) throw e;
      await sleep(2000 * (i + 1));
    }
  }
}

const data = JSON.parse(fs.readFileSync(DATA, "utf8"));
const failed = data.articles.filter((a) => !a.content || a.content.length < 50);

console.log(`Retrying ${failed.length} failed articles...`);

for (const article of failed) {
  process.stdout.write(`${article.slug.slice(0, 35)}... `);
  try {
    const html = await fetchWithRetry(article.sourceUrl);
    const extracted = extractContent(html);
    if (extracted.content.length < 50) throw new Error("short content");
    Object.assign(article, extracted, { error: undefined });
    console.log("OK");
  } catch (e) {
    console.log(`FAIL (${e.message})`);
  }
  await sleep(1500);
}

data.importedAt = new Date().toISOString();
fs.writeFileSync(DATA, JSON.stringify(data, null, 2));
const ok = data.articles.filter((a) => a.content?.length > 50).length;
console.log(`\nTotal with content: ${ok}/${data.articles.length}`);
