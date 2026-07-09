import { getArticle, isArticlePublished } from "@/lib/articles";
import { MAJOR_STARS } from "@/components/academy/StarsHub";

/** 十四主星學堂文章連結（有文先 link） */
export function getStarArticleHref(starName: string): string | undefined {
  const entry = MAJOR_STARS.find((s) => s.name === `${starName}星` || s.name === starName);
  if (!entry?.slug) return undefined;
  const article = getArticle("stars", entry.slug);
  return article ? `/academy/stars/${encodeURIComponent(entry.slug)}` : undefined;
}

/** 格局學堂文章連結（已發佈先有） */
export function getGejuArticleHref(slug: string): string | undefined {
  const article = getArticle("geju", slug);
  if (article && isArticlePublished(article)) {
    return `/academy/geju/${encodeURIComponent(slug)}`;
  }
  return undefined;
}
