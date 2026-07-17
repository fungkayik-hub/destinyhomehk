/**
 * Batch-import 玄空飛星斷事系列 from content/inbox/_drafts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const drafts = path.join(root, "content/inbox/_drafts");
const inboxArticle = path.join(root, "content/inbox/article.json");

const series = [
  {
    file: "01-斷事入門.html",
    title: "玄空飛星斷事入門 — 飛星唔止佈局，仲可以斷屋企出咩事",
    slug: "玄空飛星斷事入門",
    image: "/images/site/xuan-kong-flying-stars-period-9.png",
  },
  {
    file: "02-九星斷事象意.html",
    title: "九星斷事象意速查 — 一白到九紫點樣斷事？",
    slug: "九星斷事象意速查",
    image: "/images/site/xuan-kong-nine-stars-chart.png",
  },
  {
    file: "03-山星向星斷財斷丁.html",
    title: "山星向星斷財斷丁 — 玄空飛星點樣由雙星睇人事同財運",
    slug: "山星向星斷財斷丁",
    image: "/images/site/xuan-kong-flying-stars-period-9.png",
  },
  {
    file: "04-常見飛星組合斷事.html",
    title: "常見飛星組合斷事 — 合十、三七鬥牛、二五交加點睇",
    slug: "常見飛星組合斷事",
    image: "/images/site/xuan-kong-nine-stars-chart.png",
  },
  {
    file: "05-流年飛星斷事.html",
    title: "流年飛星斷事 — 每年九宮點樣斷今年屋企易出咩事",
    slug: "流年飛星斷事",
    image: "/images/site/xuan-kong-flying-stars-period-9.png",
  },
];

for (const item of series) {
  const html = fs.readFileSync(path.join(drafts, item.file), "utf8");
  const article = {
    title: item.title,
    category: "feng-shui",
    slug: item.slug,
    publishedAt: "2026-07-18",
    image: item.image,
    contentHtml: html,
  };
  fs.writeFileSync(inboxArticle, JSON.stringify(article, null, 2), "utf8");
  execSync("npm run import-article", { cwd: root, stdio: "inherit" });
}

console.log("Done: imported", series.length, "articles");
