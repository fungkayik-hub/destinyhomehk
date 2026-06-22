import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleContent, { ArticleHero, ArticleCta } from "@/components/academy/ArticleContent";
import {
  getAllArticleParams,
  getArticle,
  getCategoryMeta,
  formatDate,
} from "@/lib/articles";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; articleSlug: string }>;
}

export async function generateStaticParams() {
  return getAllArticleParams().map(({ slug, articleSlug }) => ({
    slug,
    articleSlug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, articleSlug } = await params;
  const article = getArticle(slug, decodeURIComponent(articleSlug));
  return { title: article?.title ?? "文章" };
}

export default async function ArticlePage({ params }: Props) {
  const { slug, articleSlug } = await params;
  const decodedSlug = decodeURIComponent(articleSlug);
  const article = getArticle(slug, decodedSlug);
  const category = getCategoryMeta(slug);

  if (!article) notFound();

  const date = formatDate(article.publishedAt);

  return (
    <div className="py-12 px-4">
      <article className="max-w-3xl mx-auto">
        <Link
          href={`/academy/${slug}`}
          className="text-sm text-destiny-purple/50 hover:text-destiny-gold mb-4 inline-block"
        >
          ← 返回{category?.title ?? "學堂"}
        </Link>

        <header className="mb-8">
          <p className="text-sm text-destiny-gold mb-2">{category?.title}</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-destiny-purple leading-tight">
            {article.title}
          </h1>
          {date && <p className="text-sm text-destiny-purple/50 mt-3">{date}</p>}
        </header>

        <ArticleHero image={article.image} title={article.title} />
        <ArticleContent html={article.content} />
        <ArticleCta />
      </article>
    </div>
  );
}
