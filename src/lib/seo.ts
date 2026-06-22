import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { getSiteUrl } from "@/lib/site-url";

export const LOCAL_SEO_KEYWORDS = [
  "灣仔紫微斗數",
  "香港算命師傅",
  "香港風水師傅",
  "結婚擇日香港",
  "紫微斗數全批",
  "中洲派紫微",
  "駱克道",
  "Master Sunny",
  "Destiny Home",
] as const;

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function excerpt(text: string, maxLen = 155): string {
  const plain = stripHtml(text);
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen - 1)}…`;
}

interface PageMetaOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
}

/** 統一頁面 SEO / Open Graph / canonical */
export function buildPageMetadata({
  title,
  description,
  path,
  image,
  keywords = [],
  type = "website",
  publishedTime,
}: PageMetaOptions): Metadata {
  const site = getSiteUrl();
  const url = path.startsWith("http") ? path : `${site}${path.startsWith("/") ? path : `/${path}`}`;
  const ogImage = image ?? siteConfig.heroImage;

  return {
    title,
    description,
    keywords: [...LOCAL_SEO_KEYWORDS, ...keywords],
    alternates: { canonical: url },
    openGraph: {
      type,
      locale: "zh_HK",
      siteName: siteConfig.name,
      title,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime && type === "article"
        ? { publishedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
