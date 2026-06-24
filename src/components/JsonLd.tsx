import { siteConfig } from "@/lib/site-config";
import { getSiteUrl } from "@/lib/site-url";

function sameAsLinks(): string[] {
  return [
    siteConfig.instagram,
    siteConfig.googleBusinessUrl,
    siteConfig.youtubeChannel,
  ].filter(Boolean);
}

function absoluteUrl(site: string, path: string): string {
  if (path.startsWith("http")) return path;
  return `${site}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Article / WebSite publisher — Google 要求 Organization + ImageObject logo */
export function organizationJsonLd(site: string) {
  return {
    "@type": "Organization",
    "@id": `${site}/#organization`,
    name: siteConfig.name,
    url: site,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(site, siteConfig.logo),
    },
  };
}

/** 全站 LocalBusiness + WebSite — 符合 Google Rich Results 格式 */
export default function JsonLd() {
  const site = getSiteUrl();
  const businessId = `${site}/#business`;
  const websiteId = `${site}/#website`;
  const organization = organizationJsonLd(site);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "LocalBusiness",
        "@id": businessId,
        name: siteConfig.name,
        alternateName: "Destiny Home 紫微斗數",
        description: siteConfig.description,
        url: site,
        image: [absoluteUrl(site, siteConfig.heroImage), absoluteUrl(site, siteConfig.logo)],
        logo: absoluteUrl(site, siteConfig.logo),
        telephone: siteConfig.phone.replace(/\s/g, ""),
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "駱克道382號1807室",
          addressLocality: "灣仔",
          addressRegion: "Hong Kong",
          addressCountry: "HK",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: siteConfig.geo.latitude,
          longitude: siteConfig.geo.longitude,
        },
        hasMap: siteConfig.googleMapsUrl,
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "12:00",
            closes: "20:00",
          },
        ],
        sameAs: sameAsLinks(),
        areaServed: {
          "@type": "Country",
          name: "Hong Kong",
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "Destiny Home | Master Sunny",
        url: site,
        inLanguage: "zh-HK",
        publisher: { "@id": organization["@id"] },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

/** 學堂文章 — BlogPosting（publisher 用 Organization，唔引用 LocalBusiness） */
export function articleJsonLd(options: {
  title: string;
  description: string;
  url: string;
  image?: string | null;
  datePublished?: string | null;
}) {
  const site = getSiteUrl();
  const imageUrl = options.image
    ? absoluteUrl(site, options.image)
    : absoluteUrl(site, siteConfig.heroImage);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: options.title,
    description: options.description,
    image: imageUrl,
    author: { "@type": "Person", name: "Sunny 師傅" },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: site,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(site, siteConfig.logo),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": options.url,
    },
    inLanguage: "zh-HK",
  };

  if (options.datePublished) {
    data.datePublished = options.datePublished;
  }

  return data;
}

/** FAQ 頁面結構化資料 — Google Rich Results */
export function faqJsonLd(items: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
