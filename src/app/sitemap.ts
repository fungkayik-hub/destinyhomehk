import type { MetadataRoute } from "next";
import { academyCategories } from "@/lib/site-config";
import { getAllArticleParams } from "@/lib/articles";

const SITE = "https://www.destinyhomehk.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/chart`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/booking`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/academy`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const categoryPages: MetadataRoute.Sitemap = academyCategories.map((cat) => ({
    url: `${SITE}/academy/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = getAllArticleParams().map(
    ({ slug, articleSlug }) => ({
      url: `${SITE}/academy/${slug}/${encodeURIComponent(articleSlug)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }),
  );

  return [...staticPages, ...categoryPages, ...articlePages];
}
