import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

const description =
  "Free Zi Wei Dou Shu charts with true solar time. Master Sunny reads in person in Wanchai, Hong Kong.";

export const metadata: Metadata = {
  openGraph: {
    locale: "en_HK",
    images: [
      {
        url: siteConfig.heroImage,
        width: 1200,
        height: 630,
        alt: "Destiny Home Master Sunny",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Destiny Home | Zi Wei Dou Shu Hong Kong",
    description,
    images: [siteConfig.heroImage],
  },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
