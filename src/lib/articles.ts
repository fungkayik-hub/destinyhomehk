import articlesData from "@/data/articles.json";
import { getHongKongTodayISO } from "./hong-kong-time";
import { isEstateDailySlug } from "./estate-of-the-day";
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

/**
 * 唔喺 module init 清洗全部 HTML——sitemap／列表只需要 slug／日期。
 * 首次讀 content 先 clean，避免 serverless cold start 超時變 500。
 */
const articles: Article[] = articlesData.articles.map((a) => {
  const rawContent = a.content ?? "";
  let cleaned: string | null = null;
  return {
    slug: a.slug,
    category: a.category,
    title: a.title,
    image: a.image,
    publishedAt: a.publishedAt,
    sourceUrl: a.sourceUrl,
    type: a.type as Article["type"],
    get content() {
      if (cleaned === null) cleaned = cleanContent(rawContent);
      return cleaned;
    },
  };
});

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

/** 學堂首頁「最新文章」— 按發佈日期，未到期格局文唔計 */
export function getLatestVisibleArticles(limit = 5): Article[] {
  return articles
    .filter((a) => a.slug !== a.category && isArticlePublished(a))
    .sort((a, b) => {
      const da = a.publishedAt?.slice(0, 10) ?? "";
      const db = b.publishedAt?.slice(0, 10) ?? "";
      return db.localeCompare(da);
    })
    .slice(0, limit);
}

/** 格局文、每日屋苑風水用 publishedAt（香港日期）排期；其他分類一律可見 */
export function isArticlePublished(
  article: Article,
  today = getHongKongTodayISO(),
): boolean {
  const drip =
    article.category === "geju" ||
    (article.category === "feng-shui" && isEstateDailySlug(article.slug));
  if (!drip) return true;
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

export function getArticleSitemapEntries(): {
  slug: string;
  articleSlug: string;
  publishedAt: string | null;
}[] {
  const entries: { slug: string; articleSlug: string; publishedAt: string | null }[] = [];
  for (const cat of academyCategories) {
    for (const a of getVisibleArticlesByCategory(cat.slug)) {
      entries.push({
        slug: cat.slug,
        articleSlug: a.slug,
        publishedAt: a.publishedAt,
      });
    }
  }
  return entries;
}

export function getAllArticleParams(): { slug: string; articleSlug: string }[] {
  return getArticleSitemapEntries().map(({ slug, articleSlug }) => ({
    slug,
    articleSlug,
  }));
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
