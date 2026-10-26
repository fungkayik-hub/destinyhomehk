import Link from "next/link";
import SiteImage from "@/components/SiteImage";
import type { HomepageDigitalService } from "@/lib/site-config";
import { siteImages } from "@/lib/site-images";

type Props = {
  items: readonly HomepageDigitalService[];
};

export default function HomeFeaturedDigitalServices({ items }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-10">
      {items.map((item) => (
        <article
          key={item.title}
          className="card p-0 overflow-hidden flex flex-col hover:shadow-xl transition-shadow group"
        >
          <div className="relative h-44 sm:h-52 overflow-hidden bg-destiny-cream">
            <SiteImage
              src={siteImages.services[item.imageKey]}
              alt={item.title}
              width={800}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <span
              className="absolute top-3 right-3 min-w-[4.5rem] text-center text-sm font-bold bg-destiny-gold text-destiny-purple px-3 py-1.5 rounded-full shadow-md tabular-nums"
              aria-label={`價格 ${item.price}`}
            >
              {item.price}
            </span>
          </div>
          <div className="p-6 flex flex-col flex-1">
            <h3 className="font-display text-2xl font-bold text-destiny-purple mb-4">
              {item.title}
            </h3>
            <ul className="text-sm text-destiny-purple/80 space-y-2.5 mb-6 flex-1 list-none">
              {item.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2.5 items-start">
                  <span className="text-destiny-gold shrink-0 mt-0.5" aria-hidden>
                    ✓
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <Link
              href={item.href}
              className="w-full text-center rounded-full bg-destiny-purple text-white font-medium py-3 px-4 hover:bg-destiny-purple/90 transition-colors shadow-sm"
            >
              {item.cta} →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
