import type { MetadataRoute } from "next";
import { academyCategories } from "@/lib/site-config";
import { getArticleSitemapEntries, getCategoryContentDate } from "@/lib/articles";
import { getLiunian2027SitemapEntries } from "@/lib/liunian-2027";
import { getHongKongTodayISO } from "@/lib/hong-kong-time";
import { getHomepageUrl, getSiteUrl } from "@/lib/site-url";

/** 每日 URL 要跟香港日期走。固定 revalidate，避免 sitemap 停在上一次 build。 */
export const revalidate = 3600;

function dateOnly(iso: string): Date {
  return new Date(`${iso.slice(0, 10)}T00:00:00.000Z`);
}

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
      lastModified: dateOnly(iso),
      changeFrequency: "daily",
      priority: i === 0 ? 0.88 : 0.75,
    });
  }
  return urls;
}

type StaticPage = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const STATIC_PAGES: StaticPage[] = [
  { path: "/chart", changeFrequency: "monthly", priority: 0.9 },
  { path: "/qiu-qian", changeFrequency: "monthly", priority: 0.88 },
  { path: "/compatibility", changeFrequency: "monthly", priority: 0.88 },
  { path: "/wedding-date", changeFrequency: "monthly", priority: 0.88 },
  { path: "/date-picker", changeFrequency: "monthly", priority: 0.88 },
  { path: "/wan-chai-ziwei", changeFrequency: "monthly", priority: 0.9 },
  { path: "/hong-kong-fortune-telling", changeFrequency: "monthly", priority: 0.9 },
  { path: "/ai-faq", changeFrequency: "monthly", priority: 0.86 },
  { path: "/ai-monitoring", changeFrequency: "monthly", priority: 0.8 },
  { path: "/booking", changeFrequency: "monthly", priority: 0.9 },
  { path: "/book", changeFrequency: "monthly", priority: 0.92 },
  { path: "/en", changeFrequency: "weekly", priority: 0.85 },
  { path: "/en/chart", changeFrequency: "monthly", priority: 0.88 },
  { path: "/en/booking", changeFrequency: "monthly", priority: 0.85 },
  { path: "/about", changeFrequency: "monthly", priority: 0.85 },
  { path: "/academy", changeFrequency: "weekly", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  const today = getHongKongTodayISO();

  // 不對靜態頁蓋同一個 build timestamp。Google 會忽略整份不準的 lastmod。
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: getHomepageUrl(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...STATIC_PAGES.map((page) => ({
      url: `${site}${page.path}`,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    {
      url: `${site}/daily`,
      lastModified: dateOnly(today),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ];

  const HIGH_PRIORITY_CATEGORIES = new Set(["name-numerology", "ding-pan"]);

  const categoryPages: MetadataRoute.Sitemap = academyCategories.map((cat) => {
    const published = getCategoryContentDate(cat.slug);
    return {
      url: `${site}/academy/${cat.slug}`,
      ...(published ? { lastModified: new Date(published) } : {}),
      changeFrequency: "weekly" as const,
      priority: HIGH_PRIORITY_CATEGORIES.has(cat.slug) ? 0.9 : 0.7,
    };
  });

  const articlePages: MetadataRoute.Sitemap = getArticleSitemapEntries().map(
    ({ slug, articleSlug, publishedAt }) => ({
      url: `${site}/academy/${slug}/${encodeURIComponent(articleSlug)}`,
      ...(publishedAt ? { lastModified: new Date(publishedAt) } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }),
  );

  const liunianPages: MetadataRoute.Sitemap = getLiunian2027SitemapEntries().map(
    ({ path, publishedAt }) => ({
      url: `${site}${path}`,
      lastModified: new Date(publishedAt),
      changeFrequency: "monthly" as const,
      priority: path === "/liunian/2027" ? 0.92 : 0.85,
    }),
  );

  return [
    ...staticPages,
    ...recentDailyUrls(site, 14),
    ...categoryPages,
    ...articlePages,
    ...liunianPages,
  ];
}
