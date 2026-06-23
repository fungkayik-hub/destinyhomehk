import type { MetadataRoute } from "next";
import { academyCategories } from "@/lib/site-config";
import { getAllArticleParams } from "@/lib/articles";
import { getHongKongTodayISO } from "@/lib/hong-kong-time";
import { getSiteUrl } from "@/lib/site-url";

function recentDailyUrls(site: string, days: number): MetadataRoute.Sitemap {
  const today = getHongKongTodayISO();
  const [y, m, d] = today.split("-").map(Number);
  const base = new Date(Date.UTC(y, m - 1, d));
  const urls: MetadataRoute.Sitemap = [];

  for (let i = 0; i < days; i++) {
    const dt = new Date(base);
    dt.setUTCDate(dt.getUTCDate() - i);
    const iso = dt.toISOString().slice(0, 10);
    urls.push({
      url: `${site}/daily/${iso}`,
      lastModified: dt,
      changeFrequency: "daily",
      priority: i === 0 ? 0.88 : 0.75,
    });
  }
  return urls;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: site, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/chart`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site}/compatibility`, lastModified: now, changeFrequency: "monthly", priority: 0.88 },
    { url: `${site}/daily`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${site}/wedding-date`, lastModified: now, changeFrequency: "monthly", priority: 0.88 },
    { url: `${site}/wan-chai-ziwei`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site}/hong-kong-fortune-telling`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site}/booking`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site}/en`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${site}/en/chart`, lastModified: now, changeFrequency: "monthly", priority: 0.88 },
    { url: `${site}/en/booking`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
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

  return [...staticPages, ...recentDailyUrls(site, 14), ...categoryPages, ...articlePages];
}
