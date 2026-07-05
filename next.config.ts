import type { NextConfig } from "next";
import { shopifyRedirects } from "./src/lib/shopify-redirects";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["iztro", "lunar-lite", "lunar-typescript"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/date-picker",
        destination: "/wedding-date",
        permanent: true,
      },
      ...shopifyRedirects(),
    ];
  },
};

export default nextConfig;
