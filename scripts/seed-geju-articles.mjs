/**
 * 匯入紫微斗數吉格／凶格學堂文章 + 每日流日 override（每日 5 篇）
 * 執行：npm run seed-geju-articles
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GEJU_PATTERNS } from "./geju-patterns-data.mjs";
import { buildGejuHtml } from "./geju-content-builder.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../src/data/articles.json");
const OVERRIDES = path.join(__dirname, "../src/data/daily-overrides.json");
const CATEGORY = "geju";
const START_DATE = "2026-06-25";
const ARTICLES_PER_DAY = 5;
/** 保留非格局嘅手動 override */
const PINNED_OVERRIDE_DATES = ["2026-06-23", "2026-06-24"];

const IMAGES = [
  "/images/chart-cover.png",
  "/images/site/sunny_star1.jpg",
  "/images/site/sunny_sunshine1.jpg",
  "/images/site/sunny_moon1.jpg",
  "/images/site/sunny_1.jpg",
  "/images/site/sunny_7_1.jpg",
  "/images/site/sunny9_1.jpg",
  "/images/site/6.jpg",
  "/images/site/sunny_door1.jpg",
  "/images/site/sunny_LM1.jpg",
  "/images/site/10.18CharlotteSunny6242QP.jpg",
  "/images/site/sunny.jpg",
];

function addDays(iso, n) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return dt.toISOString().slice(0, 10);
}

function shortTip(p) {
  const label = p.type === "吉" ? "吉格" : "凶格";
  return `【${label}】${p.slug}：${p.condition.replace(/。$/, "")}。`;
}

function buildDayOverride(p1, p2) {
  const b1 = p1.type === "吉" ? "吉格" : "凶格";
  const headline = p2
    ? `【${b1}】${p1.slug} · ${p2.slug}`
    : `【${b1}】${p1.slug}`;

  let masterTip = `今日學堂更新 ${p2 ? "兩篇" : "一篇"}紫微格局：${shortTip(p1)}`;
  if (p2) masterTip += ` ${shortTip(p2)}`;
  masterTip +=
    " 格局須配合全盤星象同大限。想知自己命盤有冇入格，可免費排盤或 WhatsApp 預約 Sunny 師傅全批。";

  return {
    headline,
    masterTip,
    quote: `${p1.slug}${p2 ? ` · ${p2.slug}` : ""} — 配合全盤先準`,
    articleUrl: `/academy/${CATEGORY}/${encodeURIComponent(p1.slug)}`,
    ...(p2
      ? { articleUrl2: `/academy/${CATEGORY}/${encodeURIComponent(p2.slug)}` }
      : {}),
  };
}

/** 每篇 ≥500 字，含星情拆解、例子、FAQ — 見 geju-content-builder.mjs */
function buildHtml(p) {
  return buildGejuHtml(p);
}

function main() {
  const db = JSON.parse(fs.readFileSync(OUT, "utf8"));
  let added = 0;
  let updated = 0;

  const overrides = fs.existsSync(OVERRIDES)
    ? JSON.parse(fs.readFileSync(OVERRIDES, "utf8"))
    : {};

  const pinned = {};
  for (const d of PINNED_OVERRIDE_DATES) {
    if (overrides[d]) pinned[d] = overrides[d];
  }

  // 清除舊格局 override 日期（由 START_DATE 起）
  const totalDays = Math.ceil(GEJU_PATTERNS.length / ARTICLES_PER_DAY);
  for (let d = 0; d < totalDays + 5; d++) {
    const date = addDays(START_DATE, d);
    if (!PINNED_OVERRIDE_DATES.includes(date)) {
      delete overrides[date];
    }
  }

  GEJU_PATTERNS.forEach((p, i) => {
    const slug = p.slug;
    const badge = p.type === "吉" ? "吉格" : "凶格";
    const title = `【${badge}】${p.slug} — 紫微斗數格局解析`;
    const dayIndex = Math.floor(i / ARTICLES_PER_DAY);
    const publishedAt = addDays(START_DATE, dayIndex);
    const image = IMAGES[i % IMAGES.length];

    const article = {
      slug,
      category: CATEGORY,
      title,
      content: buildHtml(p),
      image,
      publishedAt,
      sourceUrl: `https://www.destinyhomehk.com/academy/${CATEGORY}/${encodeURIComponent(slug)}`,
      type: "blog",
    };

    const idx = db.articles.findIndex(
      (a) => a.category === CATEGORY && a.slug === slug,
    );
    if (idx >= 0) {
      db.articles[idx] = article;
      updated++;
    } else {
      db.articles.unshift(article);
      added++;
    }

    if (i % ARTICLES_PER_DAY === 0) {
      const p2 = GEJU_PATTERNS[i + 1];
      const date = addDays(START_DATE, dayIndex);
      if (!PINNED_OVERRIDE_DATES.includes(date)) {
        overrides[date] = buildDayOverride(p, p2);
      }
    }
  });

  Object.assign(overrides, pinned);

  fs.writeFileSync(OUT, JSON.stringify(db, null, 2) + "\n", "utf8");

  const sortedOverrides = Object.fromEntries(
    Object.entries(overrides).sort(([a], [b]) => a.localeCompare(b)),
  );
  fs.writeFileSync(OVERRIDES, JSON.stringify(sortedOverrides, null, 2) + "\n", "utf8");

  console.log(
    `完成：新增 ${added} 篇、更新 ${updated} 篇 · 共 ${GEJU_PATTERNS.length} 篇`,
  );
  console.log(
    `排期：${START_DATE} 起每日 ${ARTICLES_PER_DAY} 篇 · 共 ${totalDays} 日 · /academy/${CATEGORY}`,
  );
}

main();
