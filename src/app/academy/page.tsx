import type { Metadata } from "next";
import Link from "next/link";
import SiteImage, { PageBanner } from "@/components/SiteImage";
import { getArticlesByCategory, getCategoryCoverImage, getCategoryPageArticle } from "@/lib/articles";
import { academyCategories } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "紫微斗數學堂",
  description:
    "Destiny Home 學堂 — 風水、流年、十四主星、姓名學、Sunny 講故事，香港紫微斗數知識庫。",
  path: "/academy",
  keywords: ["紫微斗數文章", "風水知識", "流年運勢"],
});

export default function AcademyPage() {
  return (
    <>
      <PageBanner
        src="/images/site/6662222.webp"
        title="紫微斗數學堂"
        subtitle="命理知識、風水心得、流年運勢 — 持續更新"
      />
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-5">
          {academyCategories.map((cat) => {
            const count = getArticlesByCategory(cat.slug).length;
            const hasPage = Boolean(getCategoryPageArticle(cat.slug)?.content);
            const total = count + (hasPage ? 1 : 0);
            const cover = getCategoryCoverImage(cat.slug);

            return (
              <Link
                key={cat.slug}
                href={`/academy/${cat.slug}`}
                className="card hover:shadow-lg transition-shadow group p-0 overflow-hidden"
              >
                {cover ? (
                  <div className="relative h-36 overflow-hidden bg-destiny-cream">
                    <SiteImage
                      src={cover}
                      alt={cat.title}
                      width={600}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-destiny-purple/70 via-transparent to-transparent" />
                    {total > 0 && (
                      <span className="absolute bottom-2 left-3 text-xs text-white/90 font-medium">
                        {total} 篇
                      </span>
                    )}
                  </div>
                ) : null}
                <div className="p-5">
                  <h3 className="font-display font-bold mb-2 group-hover:text-destiny-gold transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-destiny-purple/70">{cat.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
