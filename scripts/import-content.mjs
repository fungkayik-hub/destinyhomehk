/**
 * 從 destinyhomehk.com (Shopify) 匯入學堂文章
 * 執行: node scripts/import-content.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../src/data/articles.json");

const BLOG_MAP = {
  "sunny講故事": "stories",
  "sunny談風水": "feng-shui",
  "紫微斗數學堂": "stars",
  sunny: "stories",
};

const PAGE_MAP = [
  { url: "https://www.destinyhomehk.com/pages/%E5%8F%B0%E7%81%A3%E5%A7%93%E5%90%8D%E5%AD%B8%E7%B8%BD%E7%AD%86%E5%8A%83%E5%90%89%E5%87%B6", category: "name-numerology", slug: "name-numerology" },
  { url: "https://www.destinyhomehk.com/pages/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8%E8%88%87%E5%AD%90%E5%B9%B3%E5%85%AB%E5%AD%97%E7%9A%84%E6%AD%B7%E5%8F%B2%E6%95%85%E4%BA%8B", category: "history", slug: "history" },
  { url: "https://www.destinyhomehk.com/pages/%E5%A4%A9%E5%9C%B0%E4%BA%BA%E8%88%87%E5%AE%9A%E7%9B%A4", category: "ding-pan", slug: "ding-pan" },
  { url: "https://www.destinyhomehk.com/pages/%E7%8E%84%E5%AD%B8%E8%88%87%E7%B5%B1%E8%A8%88%E5%AD%B8%E9%A1%8F%E8%89%B2%E8%AB%96", category: "theory", slug: "theory" },
  { url: "https://www.destinyhomehk.com/pages/2026-sunny%E5%8D%81%E4%BA%8C%E7%94%9F%E8%82%96%E6%B5%81%E5%B9%B4", category: "2026-zodiac", slug: "2026-zodiac" },
];

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "zh-TW,zh;q=0.9",
  Accept: "text/html,application/xhtml+xml",
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function decodeHtml(html) {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function extractContent(html) {
  const titleMatch =
    html.match(/<h1[^>]*class="[^"]*article-template__title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i) ||
    html.match(/<h1[^>]*class="[^"]*main-page-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i) ||
    html.match(/<title>([^<|]+)/i);
  const title = decodeHtml(titleMatch?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "Untitled");

  const contentMatch =
    html.match(/<div[^>]*class="[^"]*article-template__content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*class="[^"]*article-template__social/i) ||
    html.match(/<div[^>]*class="[^"]*article-template__content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/article/i) ||
    html.match(/<div[^>]*class="[^"]*rte[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/main/i) ||
    html.match(/<main[^>]*id="MainContent"[^>]*>([\s\S]*?)<\/main/i);

  let content = contentMatch?.[1] ?? "";
  content = content.replace(/<script[\s\S]*?<\/script>/gi, "");
  content = content.replace(/<style[\s\S]*?<\/style>/gi, "");
  content = content.trim();

  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/i) || html.match(/property="og:image"[^>]+content="([^"]+)"/i);
  const image = imgMatch?.[1]?.replace(/^http:/, "https:") ?? null;

  const dateMatch = html.match(/<time[^>]*datetime="([^"]+)"/i);
  const publishedAt = dateMatch?.[1] ?? null;

  return { title, content, image, publishedAt };
}

function slugFromUrl(url) {
  const parts = new URL(url).pathname.split("/").filter(Boolean);
  return decodeURIComponent(parts[parts.length - 1]);
}

function blogCategoryFromUrl(url) {
  const parts = new URL(url).pathname.split("/").filter(Boolean);
  if (parts[0] !== "blogs" || parts.length < 3) return null;
  const blogHandle = decodeURIComponent(parts[1]);
  return BLOG_MAP[blogHandle] ?? "general";
}

function parseSitemap(xml) {
  const urls = [];
  const locRe = /<loc>([^<]+)<\/loc>/g;
  const imageRe = /<image:loc>([^<]+)<\/image:loc>\s*<image:title>([^<]*)<\/image:title>/g;
  let m;
  while ((m = locRe.exec(xml)) !== null) {
    urls.push({ url: m[1], image: null, imageTitle: null });
  }
  const images = [...xml.matchAll(imageRe)];
  images.forEach((img, i) => {
    const articleUrls = urls.filter((u) => u.url.split("/").length > 5);
    if (articleUrls[i]) {
      articleUrls[i].image = img[1];
      articleUrls[i].imageTitle = decodeHtml(img[2]);
    }
  });
  return urls.filter((u) => {
    const p = new URL(u.url).pathname.split("/").filter(Boolean);
    return p[0] === "blogs" && p.length >= 3 && !p[2]?.includes("refund");
  });
}

async function fetchPage(url) {
  const res = await fetch(url, { headers: HEADERS, redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function main() {
  console.log("Reading sitemap...");
  const sitemap = fs.readFileSync(path.join(__dirname, "sitemap-blogs.xml"), "utf8");
  const blogUrls = parseSitemap(sitemap);
  console.log(`Found ${blogUrls.length} blog articles`);

  const articles = [];
  let i = 0;

  for (const item of blogUrls) {
    i++;
    const slug = slugFromUrl(item.url);
    const category = blogCategoryFromUrl(item.url);
    process.stdout.write(`[${i}/${blogUrls.length}] ${slug.slice(0, 40)}... `);

    try {
      const html = await fetchPage(item.url);
      const { title, content, image, publishedAt } = extractContent(html);
      if (content.length < 50) throw new Error("content too short");

      articles.push({
        slug,
        category,
        title: title || item.imageTitle || slug,
        content,
        image: image || item.image,
        publishedAt,
        sourceUrl: item.url,
        type: "blog",
      });
      console.log("OK");
    } catch (err) {
      console.log(`FAIL: ${err.message}`);
      articles.push({
        slug,
        category,
        title: item.imageTitle || slug,
        content: "",
        image: item.image,
        publishedAt: null,
        sourceUrl: item.url,
        type: "blog",
        error: err.message,
      });
    }
    await sleep(800);
  }

  console.log("\nFetching static pages...");
  for (const page of PAGE_MAP) {
    process.stdout.write(`Page ${page.slug}... `);
    try {
      const html = await fetchPage(page.url);
      const { title, content, image, publishedAt } = extractContent(html);
      articles.push({
        slug: page.slug,
        category: page.category,
        title,
        content,
        image,
        publishedAt,
        sourceUrl: page.url,
        type: "page",
      });
      console.log("OK");
    } catch (err) {
      console.log(`FAIL: ${err.message}`);
    }
    await sleep(800);
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ importedAt: new Date().toISOString(), articles }, null, 2));
  const ok = articles.filter((a) => a.content?.length > 50).length;
  console.log(`\nDone: ${ok}/${articles.length} articles with content`);
  console.log(`Saved to ${OUT}`);
}

main().catch(console.error);
