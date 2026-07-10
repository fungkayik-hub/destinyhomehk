"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalyticsRouteTracker from "@/components/GoogleAnalytics";

export default function SiteAnalytics() {
  return (
    <>
      <GoogleAnalyticsRouteTracker />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
