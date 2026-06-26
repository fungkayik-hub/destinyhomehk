import articlesData from "@/data/articles.json";
import { getHongKongTodayISO } from "./hong-kong-time";
import { academyCategories } from "./site-config";

export interface Article {
  slug: string;
  category: string;
  title: string;
  content: string;
  image: string | null;
  publishedAt: string | null;
  sourceUrl: string;
  type: "blog" | "page";
}

const articles: Article[] = articlesData.articles.map((a) => ({
  ...a,
  type: a.type as Article["type"],
  content: cleanContent(a.content),
}));

/** 優化匯入 HTML 供前端顯示 */
export function prepareArticleHtml(html: string): string {
  return html
    .replace(/_\d+x\d+\./g, ".")
    .replace(/src="(\/images\/site\/[^"?]+)(\?[^"]*)?"/g, 'src="$1"')
    .replace(/<img([^>]*)>/gi, (_match, attrs: string) => {
      let a = attrs;
      if (!/\bloading=/i.test(a)) a += ' loading="lazy"';
      if (!/\bwidth=/i.test(a)) a += ' width="800"';
      if (!/\bheight=/i.test(a)) a += ' height="533"';
      if (!/\bdecoding=/i.test(a)) a += ' decoding="async"';
      return `<img${a}>`;
    });
}

/** 移除 Shopify 模板殘留 HTML */
export function cleanContent(html: string): string {
  if (!html) return "";

  let cleaned = html;

  // 學堂「頁面」類型：抽出主內容 rte 區塊，去掉佈景主題殘留
  if (cleaned.includes("shopify-section")) {
    const rteMatch = cleaned.match(
      /<div class="page-width page-width--narrow[^"]*">[\s\S]*?<div class="rte">([\s\S]*?)<\/div>\s*<\/div>/,
    );
    if (rteMatch?.[1]) {
      cleaned = rteMatch[1].trim();
    } else {
      const simpleRte = cleaned.match(/<div class="rte">([\s\S]*?)<\/div>/);
      if (simpleRte?.[1]) cleaned = simpleRte[1].trim();
    }
  }

  const cutPoints = [
    '<div class="article-template__back',
    "<div class=\"article-template__back",
    '<a href="/blogs/',
  ];
  for (const point of cutPoints) {
    const idx = cleaned.indexOf(point);
    if (idx > 0) cleaned = cleaned.slice(0, idx);
  }

  return cleaned
    .replace(/<link[^>]*cdn\/shop[^>]*>/gi, "")
    .replace(/<noscript>[\s\S]*?<\/noscript>/gi, "")
    .replace(/<section[^>]*shopify-section[^>]*>[\s\S]*?<\/section>/gi, "")
    .replace(/href="\/products\//g, 'href="/booking')
    .replace(/href="\/pages\//g, 'href="/academy/')
    .trim();
}

export function getAllArticles(): Article[] {
  return articles;
}

/** 格局文用 publishedAt（香港日期）排期；其他分類一律可見 */
export function isArticlePublished(
  article: Article,
  today = getHongKongTodayISO(),
): boolean {
  if (article.category !== "geju") return true;
  if (!article.publishedAt) return false;
  return article.publishedAt.slice(0, 10) <= today;
}

export function getArticlesByCategory(category: string): Article[] {
  return articles.filter((a) => a.category === category && a.slug !== category);
}

/** 學堂列表／sitemap 用 — 未到期嘅格局文唔顯示 */
export function getVisibleArticlesByCategory(category: string): Article[] {
  return getArticlesByCategory(category)
    .filter((a) => isArticlePublished(a))
    .sort((a, b) => {
      const da = a.publishedAt?.slice(0, 10) ?? "";
      const db = b.publishedAt?.slice(0, 10) ?? "";
      return db.localeCompare(da);
    });
}

export function getCategoryPageArticle(category: string): Article | undefined {
  return articles.find((a) => a.slug === category || (a.category === category && a.type === "page"));
}

export function getArticle(category: string, articleSlug: string): Article | undefined {
  const article = articles.find(
    (a) => a.category === category && a.slug === articleSlug,
  );
  if (!article || !isArticlePublished(article)) return undefined;
  return article;
}

export function getCategoryMeta(slug: string) {
  return academyCategories.find((c) => c.slug === slug);
}

export function getAllArticleParams(): { slug: string; articleSlug: string }[] {
  const params: { slug: string; articleSlug: string }[] = [];
  for (const cat of academyCategories) {
    const catArticles = getVisibleArticlesByCategory(cat.slug);
    for (const a of catArticles) {
      params.push({ slug: cat.slug, articleSlug: a.slug });
    }
  }
  return params;
}

export function getCategoryCoverImage(category: string): string | null {
  const page = getCategoryPageArticle(category);
  if (page?.image) return page.image;
  const list = getVisibleArticlesByCategory(category);
  return list[0]?.image ?? null;
}

export function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("zh-HK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
}
