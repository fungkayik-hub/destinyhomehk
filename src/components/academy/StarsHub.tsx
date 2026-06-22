import Link from "next/link";
import { getArticlesByCategory } from "@/lib/articles";

/** 十四主星 SEO 導航 — 連結至學堂文章 */
export const MAJOR_STARS = [
  { name: "紫微星", keyword: "帝王星", slug: null },
  { name: "天機星", keyword: "謀略", slug: "談天機星-紫微斗數14主星" },
  { name: "太陽星", keyword: "博愛", slug: "談太陽星-紫微斗數14主星" },
  { name: "武曲星", keyword: "財星", slug: null },
  { name: "天同星", keyword: "福星", slug: "談天同星-紫微斗數14主星" },
  { name: "廉貞星", keyword: "桃花", slug: null },
  { name: "天府星", keyword: "財庫", slug: "談天府星紫微斗數14主星" },
  { name: "太陰星", keyword: "財富", slug: "談太陰星-紫微斗數14主星" },
  { name: "貪狼星", keyword: "欲望", slug: null },
  { name: "巨門星", keyword: "口才", slug: "談巨門星-紫微斗數14主星" },
  { name: "天相星", keyword: "印星", slug: "談天相星紫微斗數14主星" },
  { name: "天梁星", keyword: "蔭星", slug: "談天梁星-紫微斗數14主星" },
  { name: "七殺星", keyword: "將軍", slug: "談七殺星" },
  { name: "破軍星", keyword: "先破後立", slug: null },
] as const;

export default function StarsHub() {
  const articles = getArticlesByCategory("stars");
  const articleSlugs = new Set(articles.map((a) => a.slug));

  return (
    <div className="mb-10">
      <h2 className="font-display text-xl font-bold mb-2">十四主星專題</h2>
      <p className="text-sm text-destiny-purple/70 mb-6">
        紫微斗數十四主星逐一解析 — 了解主星特質，更懂自己命盤。
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {MAJOR_STARS.map((star) => {
          const hasArticle =
            star.slug &&
            (articleSlugs.has(star.slug) ||
              articles.some((a) => a.slug.includes(star.name.replace("星", ""))));

          const article = articles.find(
            (a) => a.slug === star.slug || a.title.includes(star.name.replace("星", "")),
          );

          const href = article
            ? `/academy/stars/${encodeURIComponent(article.slug)}`
            : "/chart";

          return (
            <Link
              key={star.name}
              href={href}
              className="card p-4 hover:border-destiny-gold/40 hover:shadow-md transition-all text-center"
            >
              <p className="font-display font-bold text-destiny-purple">{star.name}</p>
              <p className="text-xs text-destiny-gold mt-1">{star.keyword}</p>
              {!article && (
                <p className="text-[10px] text-destiny-purple/40 mt-2">排盤睇你嘅主星</p>
              )}
            </Link>
          );
        })}
      </div>
      <p className="text-xs text-destiny-purple/50 mt-4">
        想知自己命宮坐咩星？
        <Link href="/chart" className="text-destiny-gold hover:underline ml-1">
          免費即時排盤
        </Link>
      </p>
    </div>
  );
}
