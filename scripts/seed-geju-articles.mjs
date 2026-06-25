/**
 * 匯入紫微斗數吉格／凶格學堂文章 + 每日流日 override
 * 執行：npm run seed-geju-articles
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GEJU_PATTERNS } from "./geju-patterns-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../src/data/articles.json");
const OVERRIDES = path.join(__dirname, "../src/data/daily-overrides.json");
const CATEGORY = "geju";
const START_DATE = "2026-06-25";

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

function plainTip(p) {
  const label = p.type === "吉" ? "吉格" : "凶格";
  return `${label}【${p.slug}】入格條件：${p.condition} ${p.note} 格局須配合全盤星象同大限先準；想知自己命盤有冇入格，可免費排盤或 WhatsApp 預約 Sunny 師傅全批。`;
}

function buildHtml(p) {
  const badge = p.type === "吉" ? "吉格" : "凶格";
  const tone =
    p.type === "吉"
      ? "傳統論命視為有利格局，但吉中亦可帶凶，仍要睇三方四正、大限流年先至知點樣發揮。"
      : "凶格並非「一定不好」，有時係提醒你要留意嘅方向；配合師傅解讀同後天調整，仍可減輕影響。";

  const intro =
    p.type === "吉" && p.slug === "極向離明格"
      ? "命宮<strong>紫微坐午宮</strong>，就係出名嘅極向離明格。紫微為斗數主星，午宮屬離卦、正午陽光最盛 — 有如北極星高照，天生具<strong>管理統御</strong>之氣，傳統稱「皇帝命」格局，領導力同格局感較強。"
      : `紫微斗數<strong>${badge}【${p.slug}】</strong> — 若你命盤符合條件，代表命盤上有一個值得留意的格局標記。`;

  return `<p>${intro}</p>

<h2>入格條件</h2>
<p>${p.condition}</p>

<h2>格局義理</h2>
<p>${p.note}</p>
<p>${tone}</p>
<p>命盤中格局雖然存在，仍須配合宮位星象之吉凶指數判斷：吉星多則好格易發揮，甚至凶格可逢凶化吉；若宮位星象偏弱，好格亦難盡展。</p>

<h2>點樣知道自己有冇入格？</h2>
<p>用 Destiny Home <a href="/chart">免費紫微排盤</a>，睇命宮主星、三方四正同輔星分布。時辰唔肯定可先參考<a href="/academy/ding-pan">天地人盤定盤</a>。</p>
<p>想師傅逐格對照你個人經歷同大限？<a href="/booking">預約全批 HK$2,000</a> · 灣仔<a href="/wan-chai-ziwei">工作室</a> · 更多<a href="/academy/geju">格局文章</a>。</p>`;
}

function main() {
  const db = JSON.parse(fs.readFileSync(OUT, "utf8"));
  let added = 0;
  let updated = 0;

  const overrides = fs.existsSync(OVERRIDES)
    ? JSON.parse(fs.readFileSync(OVERRIDES, "utf8"))
    : {};

  GEJU_PATTERNS.forEach((p, i) => {
    const slug = p.slug;
    const badge = p.type === "吉" ? "吉格" : "凶格";
    const title = `【${badge}】${p.slug} — 紫微斗數格局解析`;
    const publishedAt = addDays(START_DATE, i);
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

    const date = addDays(START_DATE, i);
    overrides[date] = {
      headline: `【${badge}】${p.slug}`,
      masterTip: plainTip(p),
      quote: `${p.type === "吉" ? "好格局要配合全盤先發揮" : "知格先可以趨吉避凶"} — ${p.slug}`,
      articleUrl: `/academy/${CATEGORY}/${encodeURIComponent(slug)}`,
    };
  });

  fs.writeFileSync(OUT, JSON.stringify(db, null, 2) + "\n", "utf8");

  const sortedOverrides = Object.fromEntries(
    Object.entries(overrides).sort(([a], [b]) => a.localeCompare(b)),
  );
  fs.writeFileSync(OVERRIDES, JSON.stringify(sortedOverrides, null, 2) + "\n", "utf8");

  console.log(
    `完成：新增 ${added} 篇、更新 ${updated} 篇格局文 · 共 ${GEJU_PATTERNS.length} 篇`,
  );
  console.log(
    `daily-overrides：${START_DATE} 起 ${GEJU_PATTERNS.length} 日 · 分類 /academy/${CATEGORY}`,
  );
}

main();
