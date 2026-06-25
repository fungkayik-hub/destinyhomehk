import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/academy/ArticleCard";
import StarsHub from "@/components/academy/StarsHub";
import GejuHub from "@/components/academy/GejuHub";
import ArticleContent, { ArticleHero, ArticleCta } from "@/components/academy/ArticleContent";
import {
  getArticlesByCategory,
  getCategoryMeta,
  getCategoryPageArticle,
} from "@/lib/articles";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: "name-numerology" },
    { slug: "history" },
    { slug: "feng-shui" },
    { slug: "stories" },
    { slug: "ding-pan" },
    { slug: "theory" },
    { slug: "2026-zodiac" },
    { slug: "stars" },
    { slug: "instagram" },
    { slug: "geju" },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = getCategoryMeta(slug);
  if (!meta) return { title: "學堂" };
  return buildPageMetadata({
    title: meta.title,
    description: meta.description,
    path: `/academy/${slug}`,
    keywords: [meta.title, "紫微斗數", "香港"],
  });
}

export default async function AcademyCategoryPage({ params }: Props) {
  const { slug } = await params;
  const meta = getCategoryMeta(slug);
  if (!meta) notFound();

  const pageArticle = getCategoryPageArticle(slug);
  const listArticles = getArticlesByCategory(slug);

  return (
    <div className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/academy" className="text-sm text-destiny-purple/50 hover:text-destiny-gold mb-4 inline-block">
          ← 返回學堂
        </Link>
        <h1 className="section-title mb-3 text-left">{meta.title}</h1>
        <p className="text-destiny-purple/70 mb-10">{meta.description}</p>

        {slug === "instagram" && listArticles.length === 0 && (
          <div className="card mb-8 text-sm text-destiny-purple/70">
            <p className="mb-2">IG 帖子匯入緊 — 請用 Meta「下載你的資訊」匯出後執行 <code className="text-xs bg-destiny-cream px-1 rounded">npm run import-instagram</code>。</p>
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-destiny-gold hover:underline"
            >
              追蹤 @destiny_home_ ↗
            </a>
          </div>
        )}

        {slug === "stars" && <StarsHub />}

        {slug === "geju" && <GejuHub />}

        {pageArticle && pageArticle.content.length > 50 && (
          <div className="mb-12">
            <ArticleHero image={pageArticle.image} title={pageArticle.title} />
            <ArticleContent html={pageArticle.content} />
            <ArticleCta />
          </div>
        )}

        {listArticles.length > 0 && slug !== "geju" && (
          <div>
            {pageArticle?.content && (
              <h2 className="font-display text-xl font-bold mb-6 pt-6 border-t border-destiny-purple/10">
                文章列表
              </h2>
            )}
            <div className="space-y-4">
              {listArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} categorySlug={slug} />
              ))}
            </div>
          </div>
        )}

        {listArticles.length === 0 && !pageArticle?.content && (
          <div className="card text-center text-destiny-purple/60">
            內容整理中，敬請期待。
          </div>
        )}
      </div>
    </div>
  );
}
