import { siteConfig } from "@/lib/site-config";
import { getSiteUrl } from "@/lib/site-url";

function sameAsLinks(): string[] {
  return [
    siteConfig.instagram,
    siteConfig.googleBusinessUrl,
    siteConfig.youtubeChannel,
  ].filter(Boolean);
}

export default function JsonLd() {
  const site = getSiteUrl();

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${site}/#business`,
    name: siteConfig.name,
    alternateName: "Destiny Home 紫微斗數",
    description: siteConfig.description,
    url: site,
    image: siteConfig.heroImage,
    logo: siteConfig.logo,
    telephone: siteConfig.phone,
    priceRange: "$$",
    currenciesAccepted: "HKD",
    paymentAccepted: "Cash, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: "駱克道382號1807室",
      addressLocality: "灣仔",
      addressRegion: "Hong Kong",
      postalCode: "",
      addressCountry: "HK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    hasMap: siteConfig.googleMapsUrl,
    openingHoursSpecification: {
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: siteConfig.rating.score,
      reviewCount: siteConfig.rating.count,
      bestRating: 5,
    },
    sameAs: sameAsLinks(),
    areaServed: {
      "@type": "City",
      name: "Hong Kong",
    },
    knowsAbout: [
      "紫微斗數",
      "中洲派",
      "風水",
      "結婚擇日",
      "姓名學",
      "流年運程",
    ],
    founder: {
      "@type": "Person",
      name: "Sunny 師傅",
      jobTitle: "紫微斗數師傅",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site}/#website`,
    name: "Destiny Home | Master Sunny",
    url: site,
    inLanguage: "zh-HK",
    publisher: { "@id": `${site}/#business` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
