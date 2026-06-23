/**
 * 匯入 Instagram 最新帖子 → 學堂 /academy/instagram
 *
 * 用法：
 *   npm run import-instagram
 *   npm run import-instagram -- --export "C:/Downloads/instagram-destiny_home"
 *   npm run import-instagram -- --limit 20
 *
 * 方式（按優先序）：
 * 1. Meta「下載你的資訊」匯出資料夾（--export 或 scripts/data/instagram-export/）
 * 2. Instagram Graph API（.env.local 設 INSTAGRAM_ACCESS_TOKEN）
 * 3. 手動 JSON（scripts/data/instagram-posts.json）
 */
import { access, copyFile, mkdir, readFile, readdir, writeFile } from "fs/promises";
import { createHash } from "crypto";
import { join, dirname, basename, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ARTICLES_PATH = join(ROOT, "src/data/articles.json");
const OUT_IMG_DIR = join(ROOT, "public/images/site/ig");
const DEFAULT_EXPORT_DIR = join(ROOT, "scripts/data/instagram-export");
const MANUAL_JSON = join(ROOT, "scripts/data/instagram-posts.json");
const CATEGORY = "instagram";
const DEFAULT_LIMIT = 20;

const args = process.argv.slice(2);
function argValue(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : null;
}

const limit = Number(argValue("--limit") || DEFAULT_LIMIT);
const exportDir = argValue("--export") || DEFAULT_EXPORT_DIR;
const dryRun = args.includes("--dry-run");

async function loadEnvLocal() {
  try {
    const raw = await readFile(join(ROOT, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // optional
  }
}

function slugify(text, fallback) {
  const base = (text || fallback || "post")
    .replace(/[#@]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .slice(0, 48);
  return base || fallback || "post";
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function captionToHtml(caption) {
  if (!caption) return "";
  return caption
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("\n");
}

function buildContent(images, caption, permalink) {
  const imgs = images
    .map(
      (src, i) =>
        `<img src="${src}" alt="Sunny IG 精選 ${i + 1}" loading="lazy" class="rounded-lg mb-4 w-full">`,
    )
    .join("\n");
  const igLink = permalink
    ? `<p class="text-sm mt-6 pt-4 border-t border-destiny-purple/10"><a href="${escapeHtml(permalink)}" target="_blank" rel="noopener noreferrer" class="text-destiny-gold hover:underline">查看 Instagram 原文 ↗</a></p>`
    : "";
  return `<div class="ig-import">\n${imgs}\n${captionToHtml(caption)}\n${igLink}\n</div>`;
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function downloadImage(url, destPath) {
  if (await fileExists(destPath)) return destPath;
  const res = await fetch(url, {
    headers: { "User-Agent": "DestinyHomeHK/1.0" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(destPath), { recursive: true });
  await writeFile(destPath, buf);
  return destPath;
}

async function copyLocalImage(srcPath, shortId) {
  const ext = extname(srcPath) || ".jpg";
  const name = `${shortId}${ext}`;
  const dest = join(OUT_IMG_DIR, name);
  if (!(await fileExists(dest))) {
    await mkdir(OUT_IMG_DIR, { recursive: true });
    await copyFile(srcPath, dest);
  }
  return `/images/site/ig/${name}`;
}

async function walkJsonFiles(dir, acc = []) {
  if (!(await fileExists(dir))) return acc;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walkJsonFiles(p, acc);
    else if (e.isFile() && e.name.startsWith("posts") && e.name.endsWith(".json")) acc.push(p);
  }
  return acc;
}

function normalizeExportItem(item, exportRoot) {
  const caption = item.title ?? item.caption ?? item.description ?? "";
  const ts = item.creation_timestamp ?? item.taken_at ?? item.timestamp ?? 0;
  const permalink = item.permalink ?? item.href ?? null;
  const shortcode = item.shortcode ?? item.code ?? null;

  const uris = [];
  if (item.uri) uris.push(item.uri);
  if (Array.isArray(item.media)) {
    for (const m of item.media) {
      if (m.uri) uris.push(m.uri);
    }
  }
  if (Array.isArray(item.children)) {
    for (const c of item.children) {
      if (c.uri) uris.push(c.uri);
    }
  }

  return {
    caption,
    timestamp: typeof ts === "number" ? (ts > 1e12 ? Math.floor(ts / 1000) : ts) : 0,
    permalink,
    shortcode,
    localUris: uris.map((u) => join(exportRoot, u.replace(/\\/g, "/"))),
  };
}

async function loadFromMetaExport(exportRoot) {
  const jsonFiles = await walkJsonFiles(exportRoot);
  if (jsonFiles.length === 0) return null;

  const posts = [];
  for (const file of jsonFiles) {
    const data = JSON.parse(await readFile(file, "utf8"));
    const items = data.media ?? data.ig_media ?? data.posts ?? [];
    for (const item of items) {
      posts.push(normalizeExportItem(item, exportRoot));
    }
  }

  return posts
    .filter((p) => p.caption || p.localUris.length > 0)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

async function loadFromGraphApi() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  if (!token) return null;

  let userId = process.env.INSTAGRAM_USER_ID?.trim();
  if (!userId) {
    const meRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${token}`,
    );
    if (!meRes.ok) {
      console.error("Graph API /me failed:", meRes.status, await meRes.text());
      return null;
    }
    userId = (await meRes.json()).id;
  }

  const fields = [
    "id",
    "caption",
    "media_type",
    "media_url",
    "permalink",
    "thumbnail_url",
    "timestamp",
    "children{media_type,media_url}",
  ].join(",");
  const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=${limit}&access_token=${token}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error("Graph API media failed:", res.status, await res.text());
    return null;
  }

  const data = await res.json();
  return (data.data ?? []).map((item) => {
    const localUris = [];
    const remoteUrls = [];
    if (item.media_url) remoteUrls.push(item.media_url);
    for (const child of item.children?.data ?? []) {
      if (child.media_url) remoteUrls.push(child.media_url);
    }
    const shortcode = item.permalink?.match(/\/(p|reel|tv)\/([^/?]+)/)?.[2] ?? item.id;
    return {
      caption: item.caption ?? "",
      timestamp: item.timestamp ? Math.floor(new Date(item.timestamp).getTime() / 1000) : 0,
      permalink: item.permalink ?? null,
      shortcode,
      localUris,
      remoteUrls,
    };
  });
}

async function loadFromManualJson() {
  if (!(await fileExists(MANUAL_JSON))) return null;
  const items = JSON.parse(await readFile(MANUAL_JSON, "utf8"));
  if (!Array.isArray(items)) return null;
  return items.slice(0, limit).map((item, i) => ({
    caption: item.caption ?? item.title ?? "",
    timestamp: item.timestamp ?? item.creation_timestamp ?? Date.now() / 1000 - i,
    permalink: item.permalink ?? item.url ?? null,
    shortcode: item.shortcode ?? `manual-${i}`,
    localUris: item.localPath ? [join(ROOT, item.localPath)] : [],
    remoteUrls: item.imageUrl ? [item.imageUrl] : item.media_url ? [item.media_url] : [],
  }));
}

async function resolveImages(post, index) {
  const id =
    post.shortcode ??
    createHash("md5").update(post.caption.slice(0, 40) + index).digest("hex").slice(0, 10);
  const paths = [];

  for (const local of post.localUris ?? []) {
    if (await fileExists(local)) {
      paths.push(await copyLocalImage(local, `${id}-${paths.length}`));
    }
  }

  for (const remote of post.remoteUrls ?? []) {
    const ext = extname(new URL(remote).pathname) || ".jpg";
    const dest = join(OUT_IMG_DIR, `${id}-${paths.length}${ext}`);
    if (!dryRun) {
      try {
        await downloadImage(remote, dest);
        paths.push(`/images/site/ig/${basename(dest)}`);
      } catch (e) {
        console.warn("  skip image:", e.message);
      }
    } else {
      paths.push(`/images/site/ig/${basename(dest)}`);
    }
  }

  return paths;
}

function titleFromCaption(caption, index) {
  const line = (caption || "").split("\n").find((l) => l.trim())?.trim();
  if (!line) return `Sunny IG 精選 ${index + 1}`;
  return line.length > 72 ? `${line.slice(0, 71)}…` : line;
}

async function postsToArticles(posts) {
  const articles = [];
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const images = await resolveImages(post, i);
    const shortcode = post.shortcode ?? `post-${i}`;
    const slug = `ig-${slugify(post.caption?.split("\n")[0], shortcode)}`;
    const publishedAt = post.timestamp
      ? new Date(post.timestamp * 1000).toISOString()
      : new Date().toISOString();

    articles.push({
      slug,
      category: CATEGORY,
      title: titleFromCaption(post.caption, i),
      content: buildContent(images, post.caption, post.permalink),
      image: images[0] ?? null,
      publishedAt,
      sourceUrl: post.permalink ?? `https://www.instagram.com/destiny_home_/`,
      type: "blog",
    });
    console.log(`  ✓ ${articles.at(-1).title}`);
  }
  return articles;
}

async function mergeArticles(newPosts) {
  const data = JSON.parse(await readFile(ARTICLES_PATH, "utf8"));
  const kept = data.articles.filter((a) => a.category !== CATEGORY);
  data.articles = [...newPosts, ...kept];
  data.instagramImportedAt = new Date().toISOString();
  if (!dryRun) {
    await writeFile(ARTICLES_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
  }
  return newPosts.length;
}

function printHelp() {
  console.log(`
未能自動讀取 @destiny_home_ 帖子（Instagram 需要登入或官方匯出）。

請揀一個方式：

【推薦】Meta 官方匯出（一次過拎晒帖子）
  1. IG App → 設定 → 帳戶中心 → 你的資訊和權限 → 下載你的資訊
  2. 揀 Instagram、格式 JSON、內容只勾「帖子」
  3. 下載 zip 解壓到：
     ${DEFAULT_EXPORT_DIR}
  4. 再執行：npm run import-instagram

【進階】Instagram Graph API（商業帳戶）
  在 .env.local 加：
  INSTAGRAM_ACCESS_TOKEN=你的長期token
  INSTAGRAM_USER_ID=（可留空，自動讀 me）

【手動】scripts/data/instagram-posts.json
  格式見 scripts/data/instagram-posts.sample.json
`);
}

await loadEnvLocal();

console.log(`Import Instagram → academy/${CATEGORY} (最新 ${limit} 篇)\n`);

let posts =
  (await loadFromMetaExport(exportDir)) ??
  (await loadFromGraphApi()) ??
  (await loadFromManualJson());

if (!posts?.length) {
  printHelp();
  process.exit(1);
}

console.log(`來源：${posts.length} 篇\n`);
const articles = await postsToArticles(posts);
const count = await mergeArticles(articles);

console.log(`\n${dryRun ? "[dry-run] " : ""}已匯入 ${count} 篇 → /academy/${CATEGORY}`);
console.log("重新 deploy 後即可在網站睇到。");
