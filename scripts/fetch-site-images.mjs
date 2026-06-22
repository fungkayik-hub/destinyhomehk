const PAGES = [
  "/",
  "/pages/about-us",
  "/pages/%E6%94%B6%E8%B2%BB%E8%A9%B3%E6%83%85%E5%8F%8A%E9%A0%90%E7%B4%84%E5%B8%AB%E5%82%85",
  "/pages/%E7%B4%AB%E5%BE%AE%E5%8D%B3%E6%99%82%E6%8E%92%E7%9B%A4%E5%8F%8A%E5%88%86%E6%9E%90",
  "/pages/2026-sunny%E5%8D%81%E4%BA%8C%E7%94%9F%E8%82%96%E6%B5%81%E5%B9%B4",
];

const re = /(?:https?:)?\/\/[^"'\s>]+\.(webp|jpg|jpeg|png|gif)(\?[^"'\s>]*)?/gi;
const all = new Set();

for (const p of PAGES) {
  const res = await fetch(`https://www.destinyhomehk.com${p}`);
  const html = await res.text();
  for (const m of html.matchAll(re)) {
    let u = m[0];
    if (u.startsWith("//")) u = `https:${u}`;
    if (!u.includes("path-to-your-logo")) all.add(u);
  }
}

[...all].sort().forEach((u) => console.log(u));
console.error(`TOTAL: ${all.size}`);
