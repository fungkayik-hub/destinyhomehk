import { siteConfig } from "@/lib/site-config";

const SITE = "https://www.destinyhomehk.com";

export default function JsonLd() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    description: siteConfig.description,
    url: SITE,
    image: siteConfig.heroImage,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: "灣仔",
      addressRegion: "香港",
      addressCountry: "HK",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "12:00",
      closes: "20:00",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: siteConfig.rating.score,
      reviewCount: siteConfig.rating.count,
      bestRating: 5,
    },
    sameAs: [siteConfig.instagram],
    areaServed: "HK",
    knowsAbout: ["紫微斗數", "風水", "擇日", "姓名學"],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Destiny Home | Master Sunny",
    url: SITE,
    inLanguage: "zh-HK",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE}/academy?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
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
