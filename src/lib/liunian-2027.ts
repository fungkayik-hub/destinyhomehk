import liunianData from "@/data/liunian-2027.json";

export interface LiunianArticle {
  slug: string;
  order: number;
  title: string;
  byline: string;
  description: string;
  html: string;
  coverSquare: string;
  coverOg: string;
  publishedAt: string;
}

export interface Liunian2027Data {
  year: number;
  stemBranch: string;
  hub: LiunianArticle;
  zodiacs: LiunianArticle[];
}

const data = liunianData as Liunian2027Data;

export const liunian2027 = data;

export const LIUNIAN_2027_HUB_PATH = "/liunian/2027";

export function liunian2027ZodiacPath(slug: string): string {
  return `${LIUNIAN_2027_HUB_PATH}/${encodeURIComponent(slug)}`;
}

export function getLiunian2027Zodiac(slug: string): LiunianArticle | undefined {
  const decoded = decodeURIComponent(slug);
  return data.zodiacs.find((z) => z.slug === decoded);
}

export function getAllLiunian2027ZodiacSlugs(): string[] {
  return data.zodiacs.map((z) => z.slug);
}

export function getLiunian2027SitemapEntries(): { path: string; publishedAt: string }[] {
  return [
    { path: LIUNIAN_2027_HUB_PATH, publishedAt: data.hub.publishedAt },
    ...data.zodiacs.map((z) => ({
      path: liunian2027ZodiacPath(z.slug),
      publishedAt: z.publishedAt,
    })),
  ];
}
