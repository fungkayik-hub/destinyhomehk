import type { Metadata, Viewport } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookFloatingButton from "@/components/BookFloatingButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import SiteAnalytics from "@/components/SiteAnalytics";
import JsonLd from "@/components/JsonLd";
import { GA_ID } from "@/lib/ga";
import { lxgwWenkaiTC, notoSansTC, notoSerifTC } from "@/lib/fonts";
import { siteConfig } from "@/lib/site-config";
import { LOCAL_SEO_KEYWORDS } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F1A33",
};
export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "馮命居 | 香港紫微斗數 | 風水擇日 | Sunny 師傅",
    template: "%s | 馮命居",
  },
  description: siteConfig.description,
  keywords: [
    "紫微斗數",
    "中洲派",
    "香港算命",
    "風水",
    "結婚擇日",
    "Master Sunny",
    "紫微排盤",
    "姓名學",
    "姓名學總格",
    "天地人盤",
    "灣仔",
    ...LOCAL_SEO_KEYWORDS,
  ],
  alternates: {
    canonical: "/",
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
  openGraph: {
    siteName: siteConfig.name,
    locale: "zh_HK",
    type: "website",
    url: getSiteUrl(),
    title: "馮命居 | 香港紫微斗數 | Sunny 師傅",
    description: siteConfig.description,
    images: [{ url: siteConfig.heroImage, width: 1200, height: 630, alt: "Master Sunny" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "馮命居 | 香港紫微斗數",
    description: siteConfig.description,
    images: [siteConfig.heroImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-HK"
      className={`${lxgwWenkaiTC.variable} ${notoSansTC.variable} ${notoSerifTC.variable}`}
    >
      <head>
        {GA_ID ? (
          <>
            {/* Google tag (gtag.js) — native scripts so hits fire before React hydrates */}
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `,
              }}
            />
          </>
        ) : null}
      </head>
      <body className={`${lxgwWenkaiTC.className} antialiased bg-destiny-cream text-destiny-ink min-h-screen flex flex-col`}>
        <JsonLd />
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <BookFloatingButton />
        <WhatsAppButton />
        <SiteAnalytics />
      </body>
    </html>
  );
}
