export const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() ?? "";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fire GA4 conversion events when measurement ID is configured. */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (!GA_ID || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}
