import type { NextConfig } from "next";
import { shopifyRedirects } from "./src/lib/shopify-redirects";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["iztro", "lunar-lite"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.destinyhomehk.com",
        pathname: "/cdn/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
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
