import type { Metadata, Viewport } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import JsonLd from "@/components/JsonLd";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const SITE = "https://www.destinyhomehk.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F1A33",
};
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Destiny Home | 香港紫微斗數 | 風水擇日 | Master Sunny",
    template: "%s | Destiny Home",
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
    "灣仔",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: "Destiny Home",
    locale: "zh_HK",
    type: "website",
    url: SITE,
    title: "Destiny Home | 香港紫微斗數 | Master Sunny",
    description: siteConfig.description,
    images: [{ url: siteConfig.heroImage, width: 1200, height: 630, alt: "Master Sunny" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Destiny Home | 香港紫微斗數",
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
    <html lang="zh-HK">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-destiny-cream text-destiny-ink min-h-screen flex flex-col">        <JsonLd />
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
