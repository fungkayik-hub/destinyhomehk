import { siteConfig } from "@/lib/site-config";
import testimonialsData from "@/data/testimonials.json";
import GbpCta from "@/components/GbpCta";

interface Testimonial {
  author: string;
  text: string;
  rating: number;
}

const testimonials = testimonialsData as Testimonial[];

export default function ReviewShowcase() {
  return (
    <section className="card border-destiny-gold/25 bg-gradient-to-br from-white to-destiny-cream/30">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="font-display text-lg font-bold text-destiny-purple">客人好評</h2>
          <p className="text-sm text-destiny-purple/60">
            ⭐ {siteConfig.rating.score} · 過千真實好評
          </p>
        </div>
        <GbpCta source="reviews" compact />
      </div>
      <ul className="space-y-4">
        {testimonials.map((t) => (
          <li key={t.author} className="text-sm border-l-2 border-destiny-gold/40 pl-4">
            <p className="text-destiny-purple/80 leading-relaxed">「{t.text}」</p>
            <p className="text-xs text-destiny-purple/45 mt-1">
              — {t.author} · {"★".repeat(t.rating)}
            </p>
          </li>
        ))}
      </ul>
      <p className="text-xs text-destiny-purple/40 mt-4">
        可將真實評價文字放入 src/data/testimonials.json 更新展示。
      </p>
    </section>
  );
}
