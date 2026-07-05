/**
 * Replace legacy /blogs/ and /pages/ internal links in articles.json
 * using the same mapping as shopify-redirects.ts.
 * Run: npm run fix-internal-links
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const articlesPath = join(__dirname, "../src/data/articles.json");

/** Keep in sync with src/lib/shopify-redirects.ts */
const BLOG_CATEGORY_REDIRECTS = {
  "/blogs/sunny%E8%AC%9B%E6%95%85%E4%BA%8B": "/academy/stories",
  "/blogs/sunny%E8%AB%87%E9%A2%A8%E6%B0%B4": "/academy/feng-shui",
  "/blogs/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8%E5%AD%B8%E5%A0%82": "/academy/stars",
  "/blogs/sunny": "/academy/stories",
  "/blogs/refund-policy": "/booking",
  "/blogs/refund-policy/refund-policy": "/booking",
};

const TYPO_REDIRECTS = {
  "/blogs/sunny%E8%AB%87%E9%A2%A8%E6%B0%B4/2022-%E4%B9%9D%E5%AE%AE%E9%A3%9B%E6%98%9F%E5%9C%96%E5%8F%8A%E6%93%9A%E8%A8%AD":
    "/academy/feng-shui/2022-%E4%B9%9D%E5%AE%AE%E9%A3%9B%E6%98%9F%E5%9C%96%E5%8F%8A%E6%93%BA%E8%A8%AD",
};

const STATIC_PAGE_REDIRECTS = {
  "/pages/about-us": "/about",
  "/pages/%E6%94%B6%E8%B2%BB%E8%A9%B3%E6%83%85%E5%8F%8A%E9%A0%90%E7%B4%84%E5%B8%AB%E5%82%85": "/booking",
  "/pages/%E6%9C%8D%E5%8B%99%E6%94%B6%E8%B2%BB": "/booking",
  "/pages/%E7%AE%97%E5%91%BD%E5%89%8D%E5%BF%85%E7%9C%8B": "/about",
  "/pages/%E7%B4%AB%E5%BE%AE%E5%8D%B3%E6%99%82%E6%8E%92%E7%9B%A4%E5%8F%8A%E5%88%86%E6%9E%90": "/chart",
  "/pages/%E7%82%BA%E4%BB%80%E9%BA%BC%E6%88%91%E7%9A%84ai%E7%AE%97%E5%91%BD-%E6%AF%94%E5%82%B3%E7%B5%B1ai%E6%9B%B4%E5%8F%AF%E4%BF%A1-%E4%B8%80%E6%8E%A2%E7%B2%BE%E6%BA%96%E5%91%BD%E7%90%86%E7%9A%84%E7%A7%98%E5%AF%86":
    "/chart",
  "/products/%E7%AB%8B%E5%8D%B3%E7%B6%B2%E4%B8%8A%E9%A0%90%E7%B4%84": "/booking",
};

function articleDestination(article) {
  if (article.type === "page" && article.slug === article.category) {
    return `/academy/${article.category}`;
  }
  return `/academy/${article.category}/${encodeURIComponent(article.slug)}`;
}

function pathnameFromUrl(url) {
  return new URL(url).pathname;
}

function register(map, source, destination) {
  if (!source || source === destination) return;
  map.set(source, destination);
  try {
    const decoded = decodeURIComponent(source);
    if (decoded !== source) map.set(decoded, destination);
  } catch {
    // ignore invalid escape sequences
  }
}

function buildRedirectMap(articles) {
  const map = new Map();

  for (const [source, destination] of Object.entries(TYPO_REDIRECTS)) {
    register(map, source, destination);
  }
  for (const [source, destination] of Object.entries(BLOG_CATEGORY_REDIRECTS)) {
    register(map, source, destination);
  }
  for (const [source, destination] of Object.entries(STATIC_PAGE_REDIRECTS)) {
    register(map, source, destination);
  }
  for (const article of articles) {
    if (!article.sourceUrl) continue;
    register(map, pathnameFromUrl(article.sourceUrl), articleDestination(article));
  }

  return map;
}

function lookupRedirect(map, path) {
  if (map.has(path)) return map.get(path);
  try {
    const decoded = decodeURIComponent(path);
    if (map.has(decoded)) return map.get(decoded);
  } catch {
    // ignore
  }
  try {
    const encoded = encodeURI(decodeURIComponent(path));
    if (map.has(encoded)) return map.get(encoded);
  } catch {
    // ignore
  }
  return null;
}

const SHOPIFY_BACK_RE =
  /\s*<\/div>\s*<div class="article-template__back[\s\S]*$/g;

const HREF_RE = /href="(\/(?:blogs|pages|products)[^"]*)"/g;

const data = JSON.parse(readFileSync(articlesPath, "utf-8"));
const redirectMap = buildRedirectMap(data.articles);

let linksReplaced = 0;
let footersRemoved = 0;
const unresolved = new Set();

for (const article of data.articles) {
  if (!article.content || typeof article.content !== "string") continue;

  let content = article.content;

  const beforeFooters = content;
  content = content.replace(SHOPIFY_BACK_RE, "");
  if (content !== beforeFooters) footersRemoved++;

  content = content.replace(HREF_RE, (match, path) => {
    const destination = lookupRedirect(redirectMap, path);
    if (destination) {
      linksReplaced++;
      return `href="${destination}"`;
    }
    unresolved.add(path);
    return match;
  });

  article.content = content;
}

writeFileSync(articlesPath, `${JSON.stringify(data, null, 2)}\n`);

console.log(`Links replaced: ${linksReplaced}`);
console.log(`Shopify footers removed: ${footersRemoved}`);
if (unresolved.size > 0) {
  console.log(`Unresolved links (${unresolved.size}):`);
  for (const path of [...unresolved].sort()) {
    console.log(`  ${path}`);
  }
} else {
  console.log("No unresolved legacy links.");
}
