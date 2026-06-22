import { readFileSync } from "fs";
import { join } from "path";
import type { Redirect } from "next/dist/lib/load-custom-routes";

type ArticleRow = {
  slug: string;
  category: string;
  sourceUrl: string;
  type: "blog" | "page";
};

const articlesData = JSON.parse(
  readFileSync(join(process.cwd(), "src/data/articles.json"), "utf-8"),
) as { articles: ArticleRow[] };

/** 旧 Shopify 博客分类 → 新学堂分类 */
const BLOG_CATEGORY_REDIRECTS: Record<string, string> = {
  "/blogs/sunny%E8%AC%9B%E6%95%85%E4%BA%8B": "/academy/stories",
  "/blogs/sunny%E8%AB%87%E9%A2%A8%E6%B0%B4": "/academy/feng-shui",
  "/blogs/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8%E5%AD%B8%E5%A0%82": "/academy/stars",
  "/blogs/sunny": "/academy/stories",
  "/blogs/refund-policy": "/booking",
  "/blogs/refund-policy/refund-policy": "/booking",
};

/** 旧 Shopify 固定页面 */
const STATIC_PAGE_REDIRECTS: Record<string, string> = {
  "/pages/about-us": "/about",
  "/pages/%E6%94%B6%E8%B2%BB%E8%A9%B3%E6%83%85%E5%8F%8A%E9%A0%90%E7%B4%84%E5%B8%AB%E5%82%85": "/booking",
  "/pages/%E6%9C%8D%E5%8B%99%E6%94%B6%E8%B2%BB": "/booking",
  "/pages/%E7%AE%97%E5%91%BD%E5%89%8D%E5%BF%85%E7%9C%8B": "/about",
  "/pages/%E7%B4%AB%E5%BE%AE%E5%8D%B3%E6%99%82%E6%8E%92%E7%9B%A4%E5%8F%8A%E5%88%86%E6%9E%90": "/chart",
  "/pages/%E7%82%BA%E4%BB%80%E9%BA%BC%E6%88%91%E7%9A%84ai%E7%AE%97%E5%91%BD-%E6%AF%94%E5%82%B3%E7%B5%B1ai%E6%9B%B4%E5%8F%AF%E4%BF%A1-%E4%B8%80%E6%8E%A2%E7%B2%BE%E6%BA%96%E5%91%BD%E7%90%86%E7%9A%84%E7%A7%98%E5%AF%86":
    "/chart",
  "/products/%E7%AB%8B%E5%8D%B3%E7%B6%B2%E4%B8%8A%E9%A0%90%E7%B4%84": "/booking",
};

function articleDestination(article: ArticleRow): string {
  if (article.type === "page" && article.slug === article.category) {
    return `/academy/${article.category}`;
  }
  return `/academy/${article.category}/${encodeURIComponent(article.slug)}`;
}

function pathnameFromUrl(url: string): string {
  return new URL(url).pathname;
}

function register(map: Map<string, string>, source: string, destination: string) {
  if (!source || source === destination) return;
  map.set(source, destination);
  try {
    const decoded = decodeURIComponent(source);
    if (decoded !== source) map.set(decoded, destination);
  } catch {
    // ignore invalid escape sequences
  }
}

/** 由 articles.json sourceUrl 及已知 Shopify 路径生成 301 表 */
export function shopifyRedirects(): Redirect[] {
  const map = new Map<string, string>();

  for (const [source, destination] of Object.entries(BLOG_CATEGORY_REDIRECTS)) {
    register(map, source, destination);
  }
  for (const [source, destination] of Object.entries(STATIC_PAGE_REDIRECTS)) {
    register(map, source, destination);
  }

  for (const article of articlesData.articles as ArticleRow[]) {
    if (!article.sourceUrl) continue;
    register(map, pathnameFromUrl(article.sourceUrl), articleDestination(article));
  }

  // Shopify 购物相关兜底
  const wildcards: Redirect[] = [
    { source: "/pages/:path*", destination: "/academy", permanent: true },
    { source: "/products/:path*", destination: "/booking", permanent: true },
    { source: "/collections/:path*", destination: "/academy", permanent: true },
    { source: "/cart", destination: "/booking", permanent: true },
    { source: "/cart/:path*", destination: "/booking", permanent: true },
    { source: "/checkout", destination: "/booking", permanent: true },
    { source: "/checkouts/:path*", destination: "/booking", permanent: true },
    { source: "/account", destination: "/booking", permanent: true },
    { source: "/account/:path*", destination: "/booking", permanent: true },
  ];

  const exact = Array.from(map.entries()).map(([source, destination]) => ({
    source,
    destination,
    permanent: true as const,
  }));

  return [...exact, ...wildcards];
}
