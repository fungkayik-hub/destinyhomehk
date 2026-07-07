"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim();

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function pagePath(pathname: string, searchParams: URLSearchParams | null): string {
  const query = searchParams?.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function whenGtagReady(run: () => void): () => void {
  if (typeof window.gtag === "function") {
    run();
    return () => {};
  }

  const interval = window.setInterval(() => {
    if (typeof window.gtag === "function") {
      window.clearInterval(interval);
      run();
    }
  }, 50);

  const timeout = window.setTimeout(() => window.clearInterval(interval), 10_000);

  return () => {
    window.clearInterval(interval);
    window.clearTimeout(timeout);
  };
}

/** Fire GA4 page_view (initial load + client-side route changes). */
export function trackPageView(path: string): void {
  if (!GA_ID || typeof window.gtag !== "function") return;
  window.gtag("config", GA_ID, {
    page_path: path,
    page_location: window.location.href,
  });
}

/** Fire GA4 conversion events when measurement ID is configured. */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (!GA_ID || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

function GoogleAnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const path = pagePath(pathname, searchParams);
    return whenGtagReady(() => trackPageView(path));
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
      <Suspense fallback={null}>
        <GoogleAnalyticsPageView />
      </Suspense>
    </>
  );
}
