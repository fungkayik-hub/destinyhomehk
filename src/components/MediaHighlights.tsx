import Link from "next/link";
import SiteImage from "@/components/SiteImage";
import { mediaHighlights } from "@/lib/media-highlights";

interface Props {
  /** 首頁用較精簡版面 */
  variant?: "full" | "compact";
}

export default function MediaHighlights({ variant = "full" }: Props) {
  return (
    <section className={variant === "full" ? "py-12 px-4" : "py-14 px-4 bg-white"}>
      <div className="max-w-5xl mx-auto">
        <h2 className={variant === "full" ? "font-display text-2xl font-bold text-destiny-purple mb-2" : "section-title mb-3"}>
          媒體及企業合作
        </h2>
        <p className={`text-destiny-purple/70 mb-8 ${variant === "full" ? "text-sm" : "text-center max-w-xl mx-auto mb-10"}`}>
          電視媒體、跨國企業風水同公司講座 — Sunny 師傅以專業同貼地方式，將中洲派紫微帶到更多場合。
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {mediaHighlights.map((item) => (
            <article
              key={item.id}
              className="card p-0 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[4/3] bg-destiny-cream overflow-hidden">
                <SiteImage
                  src={item.image}
                  alt={item.title}
                  width={800}
                  className="w-full h-full object-cover object-center"
                />
                <span className="absolute top-3 left-3 text-xs font-medium bg-destiny-purple/90 text-white px-2.5 py-1 rounded-full">
                  {item.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-destiny-purple mb-2">{item.title}</h3>
                <p className="text-sm text-destiny-purple/70 leading-relaxed mb-3">
                  {item.description}
                </p>
                <p className="text-xs text-destiny-gold">{item.caption}</p>
              </div>
            </article>
          ))}
        </div>

        {variant === "compact" && (
          <div className="text-center mt-8">
            <Link href="/about" className="btn-secondary text-sm">
              了解更多關於師傅
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
