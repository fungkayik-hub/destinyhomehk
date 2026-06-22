import fs from "fs";

const HEADERS = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0" };
const pages = [
  { url: "https://www.destinyhomehk.com/pages/%E7%8E%84%E5%AD%B8%E8%88%87%E7%B5%B1%E8%A8%88%E5%AD%B8%E9%A1%8F%E8%89%B2%E8%AB%96", category: "theory", slug: "theory" },
  { url: "https://www.destinyhomehk.com/pages/2026-sunny%E5%8D%81%E4%BA%8C%E7%94%9F%E8%82%96%E6%B5%81%E5%B9%B4", category: "2026-zodiac", slug: "2026-zodiac" },
];

const data = JSON.parse(fs.readFileSync("src/data/articles.json", "utf8"));

for (const p of pages) {
  if (data.articles.some((a) => a.slug === p.slug)) {
    console.log(`${p.slug} already exists`);
    continue;
  }
  const res = await fetch(p.url, { headers: HEADERS });
  const html = await res.text();
  const titleMatch = html.match(/<h1[^>]*class="[^"]*main-page-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i);
  const title = titleMatch?.[1]?.replace(/<[^>]+>/g, "").trim() ?? p.slug;
  const contentMatch = html.match(/<main[^>]*id="MainContent"[^>]*>([\s\S]*?)<\/main/i);
  let content = contentMatch?.[1]?.replace(/<script[\s\S]*?<\/script>/gi, "").trim() ?? "";
  data.articles.push({ slug: p.slug, category: p.category, title, content, image: null, publishedAt: null, sourceUrl: p.url, type: "page" });
  console.log(`${p.slug}: ${content.length} chars`);
}

data.importedAt = new Date().toISOString();
fs.writeFileSync("src/data/articles.json", JSON.stringify(data, null, 2));
