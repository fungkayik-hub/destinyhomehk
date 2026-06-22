import articlesData from "@/data/articles.json";
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
    .replace(/<img(?![^>]*loading=)/gi, '<img loading="lazy"');
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

export function getArticlesByCategory(category: string): Article[] {
  return articles.filter((a) => a.category === category && a.slug !== category);
}

export function getCategoryPageArticle(category: string): Article | undefined {
  return articles.find((a) => a.slug === category || (a.category === category && a.type === "page"));
}

export function getArticle(category: string, articleSlug: string): Article | undefined {
  return articles.find((a) => a.category === category && a.slug === articleSlug);
}

export function getCategoryMeta(slug: string) {
  return academyCategories.find((c) => c.slug === slug);
}

export function getAllArticleParams(): { slug: string; articleSlug: string }[] {
  const params: { slug: string; articleSlug: string }[] = [];
  for (const cat of academyCategories) {
    const catArticles = getArticlesByCategory(cat.slug);
    for (const a of catArticles) {
      params.push({ slug: cat.slug, articleSlug: a.slug });
    }
  }
  return params;
}

export function getCategoryCoverImage(category: string): string | null {
  const page = getCategoryPageArticle(category);
  if (page?.image) return page.image;
  const list = getArticlesByCategory(category);
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
