import Link from "next/link";
import ArticleContent from "@/components/academy/ArticleContent";
import { prepareArticleHtml } from "@/lib/articles";
import Liunian2027ZodiacGrid from "@/components/liunian/Liunian2027ZodiacGrid";
import { LIUNIAN_2027_HUB_PATH, type LiunianArticle } from "@/lib/liunian-2027";
import { whatsappUrl } from "@/lib/site-config";
import Image from "next/image";

type Props = {
  article: LiunianArticle;
  showCoverInBody?: boolean;
};

export default function Liunian2027ArticleLayout({
  article,
  showCoverInBody = true,
}: Props) {
  let html = article.html;
  if (!showCoverInBody) {
    html = html.replace(/<p><img[^>]+><\/p>\s*/i, "");
  }
  html = html.replace(/<p>Destiny Home／馮命居<\/p>\s*/i, "");

  const isHub = article.slug === "總覽";

  return (
    <div className="py-12 px-4">
      <article className="max-w-3xl mx-auto">
        <Link
          href={isHub ? "/" : LIUNIAN_2027_HUB_PATH}
          className="text-sm text-destiny-purple/50 hover:text-destiny-gold mb-4 inline-block"
        >
          {isHub ? "← 返回首頁" : "← 返回 2027 流年總覽"}
        </Link>

        <header className="mb-8">
          <p className="text-sm text-destiny-gold mb-2">2027丁未年 · 十二生肖流年</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-destiny-purple leading-tight">
            {article.title}
          </h1>
          <p className="text-sm text-destiny-purple/60 mt-3">{article.byline}</p>
        </header>

        {!showCoverInBody && (
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-8 bg-destiny-cream shadow-md">
            <Image
              src={article.coverSquare}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
              priority
            />
          </div>
        )}

        <ArticleContent html={prepareArticleHtml(html)} />

        <div className="mt-12 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-destiny-purple/5 to-destiny-gold/10 border border-destiny-gold/20">
          <p className="font-display font-bold text-lg text-destiny-purple mb-2 text-center">
            想睇得更準？
          </p>
          <p className="text-sm text-destiny-purple/75 mb-5 text-center leading-relaxed">
            生肖流年只係粗線。Destiny Home 提供【流年詳批 HK$128】同【全批一生大運＋十年大運＋流年 HK$688】。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/chart#annual-report" className="btn-primary text-sm text-center">
              流年詳批 HK$128
            </Link>
            <Link href="/chart#annual-report" className="btn-secondary text-sm text-center">
              全批 HK$688
            </Link>
            <a
              href={whatsappUrl("你好，我想了解 2027 流年詳批或全批，請問點預約？")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm text-center"
            >
              WhatsApp 預約
            </a>
          </div>
        </div>

        <div className="mt-14 pt-10 border-t border-destiny-purple/10">
          <Liunian2027ZodiacGrid showHeading />
        </div>
      </article>
    </div>
  );
}
