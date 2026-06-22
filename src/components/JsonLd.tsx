import { siteConfig } from "@/lib/site-config";
import { getSiteUrl } from "@/lib/site-url";

function sameAsLinks(): string[] {
  return [
    siteConfig.instagram,
    siteConfig.googleBusinessUrl,
    siteConfig.youtubeChannel,
  ].filter(Boolean);
}

/** 全站 LocalBusiness + WebSite — 符合 Google Rich Results 格式 */
export default function JsonLd() {
  const site = getSiteUrl();
  const businessId = `${site}/#business`;
  const websiteId = `${site}/#website`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": businessId,
        name: siteConfig.name,
        alternateName: "Destiny Home 紫微斗數",
        description: siteConfig.description,
        url: site,
        image: [siteConfig.heroImage, siteConfig.logo],
        logo: siteConfig.logo,
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
        publisher: { "@id": businessId },
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

/** 學堂文章 — Article/BlogPosting 結構化資料 */
export function articleJsonLd(options: {
  title: string;
  description: string;
  url: string;
  image?: string | null;
  datePublished?: string | null;
}) {
  const site = getSiteUrl();
  const businessId = `${site}/#business`;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: options.title,
    description: options.description,
    image: options.image ?? siteConfig.heroImage,
    author: { "@type": "Person", name: "Sunny 師傅" },
    publisher: { "@id": businessId },
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
