import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    languages: {
      "zh-HK": "/",
      en: "/en",
    },
  },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
