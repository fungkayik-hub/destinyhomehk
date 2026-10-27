import type { Metadata } from "next";
import { articleJsonLd } from "@/components/JsonLd";
import Liunian2027ArticleLayout from "@/components/liunian/Liunian2027ArticleLayout";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";
import { LIUNIAN_2027_HUB_PATH, liunian2027 } from "@/lib/liunian-2027";

export const revalidate = 86400;

const { hub } = liunian2027;

export const metadata: Metadata = buildPageMetadata({
  title: hub.title,
  description: hub.description,
  path: LIUNIAN_2027_HUB_PATH,
  image: hub.coverOg,
  keywords: [
    "2027流年",
    "丁未年",
    "十二生肖流年",
    "犯太歲",
    "生肖運程",
    "香港算命",
  ],
  type: "article",
  publishedTime: hub.publishedAt,
});

export default function Liunian2027HubPage() {
  const site = getSiteUrl();
  const url = `${site}${LIUNIAN_2027_HUB_PATH}`;
  const jsonLd = articleJsonLd({
    title: hub.title,
    description: hub.description,
    url,
    image: hub.coverOg,
    datePublished: hub.publishedAt,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Liunian2027ArticleLayout article={hub} showCoverInBody />
    </>
  );
}
