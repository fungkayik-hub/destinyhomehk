import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articleJsonLd } from "@/components/JsonLd";
import Liunian2027ArticleLayout from "@/components/liunian/Liunian2027ArticleLayout";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";
import {
  getAllLiunian2027ZodiacSlugs,
  getLiunian2027Zodiac,
  liunian2027ZodiacPath,
} from "@/lib/liunian-2027";

interface Props {
  params: Promise<{ zodiac: string }>;
}

export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllLiunian2027ZodiacSlugs().map((slug) => ({
    zodiac: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { zodiac } = await params;
  const article = getLiunian2027Zodiac(zodiac);
  if (!article) return { title: "2027 生肖流年" };

  return buildPageMetadata({
    title: article.title,
    description: article.description,
    path: liunian2027ZodiacPath(article.slug),
    image: article.coverOg,
    keywords: [
      `2027${article.slug}流年`,
      "丁未年",
      `屬${article.slug}`,
      "生肖運程",
      "香港算命",
    ],
    type: "article",
    publishedTime: article.publishedAt,
  });
}

export default async function Liunian2027ZodiacPage({ params }: Props) {
  const { zodiac } = await params;
  const article = getLiunian2027Zodiac(zodiac);
  if (!article) notFound();

  const site = getSiteUrl();
  const url = `${site}${liunian2027ZodiacPath(article.slug)}`;
  const jsonLd = articleJsonLd({
    title: article.title,
    description: article.description,
    url,
    image: article.coverOg,
    datePublished: article.publishedAt,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Liunian2027ArticleLayout article={article} showCoverInBody={false} />
    </>
  );
}
