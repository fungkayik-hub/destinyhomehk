import type { Metadata } from "next";
import { Suspense } from "react";
import { PageBanner } from "@/components/SiteImage";
import FaqSection from "@/components/FaqSection";
import FortuneStickExperience from "@/components/fortune-stick/FortuneStickExperience";
import { faqJsonLd } from "@/components/JsonLd";
import { fortuneStickCopy } from "@/lib/fortune-stick-copy";
import { FAQ_BY_PAGE } from "@/lib/faq-content";
import { buildPageMetadata } from "@/lib/seo";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = buildPageMetadata({
  title: "線上求籤 · 一事一問 — 觀音靈籤",
  description:
    "免費線上求籤 — 輸入問題、搖籤得籤詩，HK$38 解鎖小徒弟 AI 完整解讀。Destiny Home 觀音靈籤，深入問事請預約 Sunny 師傅。",
  path: "/qiu-qian",
  image: siteImages.services.daily,
  keywords: [
    "線上求籤",
    "觀音靈籤",
    "一事一問",
    "免費求籤",
    "解籤",
    "香港求籤",
  ],
});

function LoadingFallback() {
  return (
    <div className="max-w-2xl mx-auto card text-center py-12 text-destiny-purple/60">
      載入中…
    </div>
  );
}

export default function QiuQianPage() {
  const copy = fortuneStickCopy;

  return (
    <>
      <PageBanner
        src={siteImages.services.daily}
        title={copy.title}
        subtitle={copy.subtitle}
        overlay="subtle"
      />
      <div className="py-10 px-4">
        <Suspense fallback={<LoadingFallback />}>
          <FortuneStickExperience />
        </Suspense>
      </div>
      <div className="px-4 pb-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd(FAQ_BY_PAGE.qiuQian)),
          }}
        />
        <FaqSection items={FAQ_BY_PAGE.qiuQian} />
      </div>
    </>
  );
}
