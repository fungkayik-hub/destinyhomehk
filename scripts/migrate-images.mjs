/**
 * Download Shopify CDN images → public/images/site/
 * Replace URLs in source files with local paths.
 */
import { createHash } from "crypto";
import { mkdir, readFile, writeFile, access } from "fs/promises";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "images", "site");
const SHOPIFY_FILES =
  "https://cdn.shopify.com/s/files/1/0655/4189/8475/files";

const SOURCE_FILES = [
  join(ROOT, "src/data/articles.json"),
  join(ROOT, "src/lib/site-images.ts"),
  join(ROOT, "src/lib/site-config.ts"),
  join(ROOT, "src/app/academy/page.tsx"),
];

/** site-images 專用 — 確保首頁橫幅等全部下載 */
const EXTRA_FILES = [
  "236.jpg",
  "6.jpg",
  "6bc8d850816d1b76a987a8e771a21a89.png",
  "WhatsApp_Image_2022-07-22_at_2.39.31_PM.webp",
];

const URL_RE =
  /(?:https?:)?\/\/(?:www\.)?destinyhomehk\.com\/cdn\/shop\/files\/[^\s"'<>]+|https?:\/\/cdn\.shopify\.com\/s\/files\/1\/0655\/4189\/8475\/files\/[^\s"'<>]+/gi;

function normalizeFilename(raw) {
  let name = decodeURIComponent(raw.split("?")[0].split("#")[0]);
  name = name.replace(/_\d+x\d+\./, ".");
  name = name.replace(/&amp;/g, "&");
  return name.split("/").pop() ?? name;
}

function toShopifyUrl(filename) {
  const clean = normalizeFilename(filename);
  return `${SHOPIFY_FILES}/${encodeURIComponent(clean).replace(/%2F/g, "/")}`;
}

function extractUrls(text) {
  const found = new Set();
  for (const match of text.matchAll(URL_RE)) {
    found.add(match[0].replace(/&amp;/g, "&"));
  }
  return [...found];
}

function localPath(filename) {
  const safe = normalizeFilename(filename);
  return `/images/site/${safe}`;
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function downloadOne(url) {
  const filename = normalizeFilename(url);
  const dest = join(OUT_DIR, filename);
  if (await fileExists(dest)) {
    return { filename, dest, skipped: true };
  }

  const candidates = [
    url.replace(/_\d+x\d+\./, "."),
    toShopifyUrl(filename),
    url.includes("destinyhomehk.com/cdn/shop")
      ? toShopifyUrl(filename)
      : url,
  ];

  for (const tryUrl of [...new Set(candidates)]) {
    try {
      const res = await fetch(tryUrl, {
        headers: { "User-Agent": "destinyhomehk-migrate/1.0" },
        redirect: "follow",
      });
      if (!res.ok) continue;
      const type = res.headers.get("content-type") ?? "";
      if (!type.startsWith("image/")) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 200) continue;
      await writeFile(dest, buf);
      return { filename, dest, skipped: false, from: tryUrl };
    } catch {
      // try next
    }
  }

  return { filename, dest, failed: true };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const allUrls = new Set();
  const fileContents = new Map();

  for (const file of SOURCE_FILES) {
    const text = await readFile(file, "utf-8");
    fileContents.set(file, text);
    for (const u of extractUrls(text)) allUrls.add(u);
  }

  for (const name of EXTRA_FILES) {
    allUrls.add(`${SHOPIFY_FILES}/${name}`);
  }

  console.log(`Found ${allUrls.size} unique image URLs`);

  const mapping = new Map();
  const failed = [];

  let i = 0;
  for (const url of allUrls) {
    i++;
    const filename = normalizeFilename(url);
    const result = await downloadOne(url);
    if (result.failed) {
      failed.push(url);
      console.log(`[${i}/${allUrls.size}] FAIL ${filename}`);
    } else {
      mapping.set(url, localPath(filename));
      const status = result.skipped ? "cached" : "saved";
      console.log(`[${i}/${allUrls.size}] ${status} ${filename}`);
    }
  }

  // Also map variants (with _480x480, &amp;, width params) → same local path
  function resolveLocal(url) {
    const base = url.replace(/&amp;/g, "&");
    if (mapping.has(base)) return mapping.get(base);
    const fn = normalizeFilename(base);
    const local = localPath(fn);
    for (const [k, v] of mapping) {
      if (normalizeFilename(k) === fn) return v;
    }
    return null;
  }

  for (const [file, text] of fileContents) {
    let next = text;
    const urls = extractUrls(text).sort((a, b) => b.length - a.length);
    for (const url of urls) {
      const local = resolveLocal(url);
      if (!local) continue;
      const escapedLocal = local.replace(/"/g, '\\"');
      next = next.split(url).join(escapedLocal);
      next = next.split(url.replace(/&/g, "&amp;")).join(escapedLocal);
    }
    if (next !== text) {
      await writeFile(file, next, "utf-8");
      console.log(`Updated ${file.replace(ROOT, "")}`);
    }
  }

  const manifest = {
    migratedAt: new Date().toISOString(),
    total: allUrls.size,
    success: mapping.size,
    failed: failed.length,
    mapping: Object.fromEntries(mapping),
    failedUrls: failed,
  };
  await writeFile(join(OUT_DIR, "_manifest.json"), JSON.stringify(manifest, null, 2));

  console.log(`\nDone: ${mapping.size} ok, ${failed.length} failed`);
  if (failed.length) {
    console.log("Failed URLs written to public/images/site/_manifest.json");
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
