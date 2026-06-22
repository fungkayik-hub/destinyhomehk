import type { Metadata } from "next";
import Link from "next/link";
import SiteImage, { PageBanner } from "@/components/SiteImage";
import { getArticlesByCategory, getCategoryCoverImage, getCategoryPageArticle } from "@/lib/articles";
import { academyCategories } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "紫微斗數學堂",
};

export default function AcademyPage() {
  return (
    <>
      <PageBanner
        src="https://www.destinyhomehk.com/cdn/shop/files/6662222.webp?v=1761017321"
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
