import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/articles";
import { formatDate } from "@/lib/articles";

interface Props {
  article: Article;
  categorySlug: string;
}

export default function ArticleCard({ article, categorySlug }: Props) {
  const date = formatDate(article.publishedAt);
  const excerpt = article.content
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);

  return (
    <Link
      href={`/academy/${categorySlug}/${encodeURIComponent(article.slug)}`}
      className="card hover:shadow-lg transition-shadow group flex gap-4 overflow-hidden"
    >
      {article.image && (
        <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-lg overflow-hidden bg-destiny-cream">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-bold mb-1 group-hover:text-destiny-gold transition-colors line-clamp-2">
          {article.title}
        </h3>
        {date && <p className="text-xs text-destiny-purple/40 mb-2">{date}</p>}
        {excerpt && (
          <p className="text-sm text-destiny-purple/60 line-clamp-2">{excerpt}…</p>
        )}
      </div>
    </Link>
  );
}
