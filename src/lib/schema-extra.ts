import { pricingPlans } from "@/lib/site-config";
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
  const orgId = `${site}/#organization`;

  return {
    "@context": "https://schema.org",
    "@graph": pricingPlans.map((plan) => {
      const priceDigits = plan.price.replace(/[^0-9.]/g, "");
      const offer: Record<string, unknown> = {
        "@type": "Offer",
        priceCurrency: "HKD",
        url: `${site}/booking#${plan.id}`,
      };
      if (priceDigits) offer.price = priceDigits;

      return {
        "@type": "Service",
        name: plan.title,
        description: plan.description,
        provider: { "@id": orgId },
        areaServed: { "@type": "Country", name: "Hong Kong" },
        offers: offer,
      };
    }),
  };
}
