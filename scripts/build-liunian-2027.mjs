/**
 * Compile 2027-liunian-zodiac markdown into src/data/liunian-2027.json
 * Run: node scripts/build-liunian-2027.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcDir = path.join(root, "2027-liunian-zodiac");
const outFile = path.join(root, "src/data/liunian-2027.json");

const IMAGE_BASE = "/images/liunian/2027";
const PUBLISHED = "2026-10-27";

const ZODIAC_FILES = [
  { file: "01-鼠.md", slug: "鼠", order: 1 },
  { file: "02-牛.md", slug: "牛", order: 2 },
  { file: "03-虎.md", slug: "虎", order: 3 },
  { file: "04-兔.md", slug: "兔", order: 4 },
  { file: "05-龍.md", slug: "龍", order: 5 },
  { file: "06-蛇.md", slug: "蛇", order: 6 },
  { file: "07-馬.md", slug: "馬", order: 7 },
  { file: "08-羊.md", slug: "羊", order: 8 },
  { file: "09-猴.md", slug: "猴", order: 9 },
  { file: "10-雞.md", slug: "雞", order: 10 },
  { file: "11-狗.md", slug: "狗", order: 11 },
  { file: "12-豬.md", slug: "豬", order: 12 },
];

marked.setOptions({ gfm: true, breaks: false });

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function postProcessHtml(html) {
  let out = html
    .replace(/src="covers\//g, `src="${IMAGE_BASE}/`)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /<h1[^>]*>[\s\S]*?<\/h1>\s*/i,
      "",
    );

  out = out.replace(
    /<a href="(https:\/\/destinyhomehk\.com[^"]*)"><a href="(https:\/\/destinyhomehk\.com[^"]*)" rel="noopener noreferrer">([^<]*)<\/a><\/a>/g,
    '<a href="$2" rel="noopener noreferrer">$3</a>',
  );

  return out.trim();
}

function parseArticle(md, slug, order) {
  const titleMatch = md.match(/^#\s+(.+)$/m);
  const title = titleMatch?.[1]?.trim() ?? `2027丁未年｜屬${slug}流年運程`;
  const byline = "Destiny Home／馮命居";

  const coverFile = slug === "總覽" ? "cover-總覽-square.png" : `cover-${slug}.png`;
  const ogFile = slug === "總覽" ? "cover-總覽-og.png" : `cover-${slug}.png`;

  const html = postProcessHtml(marked.parse(md));

  const plain = stripHtml(html);
  const description =
    plain.length > 155 ? `${plain.slice(0, 154)}…` : plain;

  return {
    slug,
    order,
    title,
    byline,
    description,
    html,
    coverSquare: `${IMAGE_BASE}/${coverFile}`,
    coverOg: `${IMAGE_BASE}/${ogFile}`,
    publishedAt: PUBLISHED,
  };
}

function parseHub(md) {
  return parseArticle(md, "總覽", 0);
}

const hubMd = fs.readFileSync(path.join(srcDir, "00-總覽.md"), "utf8");
const hub = parseHub(hubMd);

const zodiacs = ZODIAC_FILES.map(({ file, slug, order }) => {
  const md = fs.readFileSync(path.join(srcDir, file), "utf8");
  return parseArticle(md, slug, order);
});

const data = {
  year: 2027,
  stemBranch: "丁未",
  hub,
  zodiacs,
};

fs.writeFileSync(outFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`Wrote ${outFile} (${zodiacs.length} zodiac articles + hub)`);
