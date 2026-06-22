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
    .replace(/<img(?![^>]*loading=)/gi, '<img loading="lazy"');
}

/** 移除 Shopify 模板殘留 HTML */
export function cleanContent(html: string): string {
  if (!html) return "";
  let cleaned = html;
  const cutPoints = [
    '<div class="article-template__back',
    "<div class=\"article-template__back",
    '<a href="/blogs/',
  ];
  for (const point of cutPoints) {
    const idx = cleaned.indexOf(point);
    if (idx > 0) cleaned = cleaned.slice(0, idx);
  }
  return cleaned.trim();
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
