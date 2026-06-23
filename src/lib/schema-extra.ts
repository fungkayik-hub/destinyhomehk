import { pricingPlans, siteConfig } from "@/lib/site-config";
import { getSiteUrl } from "@/lib/site-url";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.href.startsWith("http") ? item.href : `${site}${item.href}`,
    })),
  };
}

/** 預約頁服務項目 — Local SEO */
export function servicesJsonLd() {
  const site = getSiteUrl();
  const businessId = `${site}/#business`;

  return {
    "@context": "https://schema.org",
    "@graph": pricingPlans.map((plan) => ({
      "@type": "Service",
      name: plan.title,
      description: plan.description,
      provider: { "@id": businessId },
      areaServed: { "@type": "Country", name: "Hong Kong" },
      offers: {
        "@type": "Offer",
        price: plan.price.replace(/[^0-9.]/g, "") || undefined,
        priceCurrency: "HKD",
        url: `${site}/booking#${plan.id}`,
      },
    })),
  };
}

export function reviewJsonLd() {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site}/#business`,
    name: siteConfig.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(siteConfig.rating.score),
      reviewCount: String(siteConfig.rating.count),
      bestRating: "5",
    },
  };
}
