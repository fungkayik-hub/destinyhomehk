"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export default function SiteAnalytics() {
  return (
    <>
      <GoogleAnalytics />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
