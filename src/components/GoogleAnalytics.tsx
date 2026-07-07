"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GA_ID } from "@/lib/ga";

function pagePath(pathname: string, searchParams: URLSearchParams | null): string {
  const query = searchParams?.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function trackPageView(path: string): void {
  if (!GA_ID || typeof window.gtag !== "function") return;
  window.gtag("config", GA_ID, {
    page_path: path,
    page_location: window.location.href,
  });
}

/** Client navigations only — initial page_view comes from layout.tsx gtag config. */
function GoogleAnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirst = useRef(true);

  useEffect(() => {
    if (!pathname) return;
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    trackPageView(pagePath(pathname, searchParams));
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalyticsRouteTracker() {
  if (!GA_ID) return null;

  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsPageView />
    </Suspense>
  );
}
