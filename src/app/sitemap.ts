import type { MetadataRoute } from "next";
import { academyCategories } from "@/lib/site-config";
import { getAllArticleParams } from "@/lib/articles";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: site, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/chart`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site}/compatibility`, lastModified: now, changeFrequency: "monthly", priority: 0.88 },
    { url: `${site}/daily`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${site}/wedding-date`, lastModified: now, changeFrequency: "monthly", priority: 0.88 },
    { url: `${site}/booking`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${site}/academy`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const categoryPages: MetadataRoute.Sitemap = academyCategories.map((cat) => ({
    url: `${site}/academy/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = getAllArticleParams().map(
    ({ slug, articleSlug }) => ({
      url: `${site}/academy/${slug}/${encodeURIComponent(articleSlug)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }),
  );

  return [...staticPages, ...categoryPages, ...articlePages];
}
