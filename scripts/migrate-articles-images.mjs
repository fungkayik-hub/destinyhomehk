/**
 * Migrate image URLs inside articles.json via proper JSON parse/stringify.
 */
import { readFile, writeFile, mkdir, access } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "images", "site");
const SHOPIFY_FILES =
  "https://cdn.shopify.com/s/files/1/0655/4189/8475/files";
const articlesPath = join(ROOT, "src/data/articles.json");

const URL_RE =
  /(?:https?:)?\/\/(?:www\.)?destinyhomehk\.com\/cdn\/shop\/files\/[^\s"'<>]+|https?:\/\/cdn\.shopify\.com\/s\/files\/1\/0655\/4189\/8475\/files\/[^\s"'<>]+/gi;

function normalizeFilename(raw) {
  let name = decodeURIComponent(raw.split("?")[0].split("#")[0]);
  name = name.replace(/_\d+x\d+\./, ".");
  return name.split("/").pop() ?? name;
}

function toShopifyUrl(filename) {
  return `${SHOPIFY_FILES}/${encodeURIComponent(normalizeFilename(filename)).replace(/%2F/g, "/")}`;
}

function localPath(filename) {
  return `/images/site/${normalizeFilename(filename)}`;
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function download(filename) {
  const dest = join(OUT_DIR, normalizeFilename(filename));
  if (await fileExists(dest)) return dest;

  for (const url of [toShopifyUrl(filename)]) {
    const res = await fetch(url, {
      headers: { "User-Agent": "destinyhomehk-migrate/1.0" },
    });
    if (!res.ok) continue;
    const type = res.headers.get("content-type") ?? "";
    if (!type.startsWith("image/")) continue;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 200) continue;
    await writeFile(dest, buf);
    return dest;
  }
  throw new Error(`Failed to download ${filename}`);
}

function replaceUrlsInText(text, cache) {
  return text.replace(URL_RE, (url) => {
    const clean = url.replace(/&amp;/g, "&");
    const fn = normalizeFilename(clean);
    const local = localPath(fn);
    cache.set(fn, local);
    return local;
  });
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const data = JSON.parse(await readFile(articlesPath, "utf-8"));
  const cache = new Map();

  for (const article of data.articles) {
    if (article.content) {
      article.content = replaceUrlsInText(article.content, cache);
    }
    if (article.image) {
      article.image = replaceUrlsInText(article.image, cache);
    }
  }

  for (const fn of cache.keys()) {
    await download(fn);
    console.log("ok", fn);
  }

  await writeFile(articlesPath, JSON.stringify(data, null, 2) + "\n");
  console.log(`Updated ${cache.size} images in articles.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
