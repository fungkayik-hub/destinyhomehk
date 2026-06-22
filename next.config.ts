import type { NextConfig } from "next";
import { shopifyRedirects } from "./src/lib/shopify-redirects";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["iztro", "lunar-lite"],
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      {
        source: "/date-picker",
        destination: "/booking?service=date",
        permanent: true,
      },
      ...shopifyRedirects(),
    ];
  },
};

export default nextConfig;
