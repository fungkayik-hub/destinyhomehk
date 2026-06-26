import Link from "next/link";
import { prepareArticleHtml } from "@/lib/articles";
import { whatsappUrl } from "@/lib/site-config";

interface Props {
  html: string;
}

/** 渲染從 Shopify 匯入的文章 HTML */
export default function ArticleContent({ html }: Props) {
  return (
    <div
      className="article-prose max-w-none"
      dangerouslySetInnerHTML={{ __html: prepareArticleHtml(html) }}
    />
  );
}

export function ArticleHero({ image, title }: { image: string | null; title: string }) {
  if (!image) return null;
  const src = image.replace(/_\d+x\d+\./, ".");
  return (
    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-8 bg-destiny-cream shadow-md">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={title}
        width={1200}
        height={675}
        className="w-full h-full object-cover"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

export function ArticleCta() {
  return (
    <div className="mt-12 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-destiny-purple/5 to-destiny-gold/10 border border-destiny-gold/20 text-center">
      <p className="font-display font-bold text-lg mb-2">想深入了解你的命盤？</p>
      <p className="text-sm text-destiny-purple/70 mb-4">
        即時排盤供參考，深度解盤由 Sunny 師傅親自定盤。
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/chart" className="btn-primary text-sm">
          免費即時排盤
        </Link>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-sm"
        >
          WhatsApp 預約
        </a>
      </div>
    </div>
  );
}
