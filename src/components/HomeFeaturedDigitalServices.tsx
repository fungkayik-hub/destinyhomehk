import Link from "next/link";
import SiteImage from "@/components/SiteImage";
import {
  homepageServicesSection,
  type HomepageDigitalService,
} from "@/lib/site-config";
import { siteImages } from "@/lib/site-images";

type Props = {
  items: readonly HomepageDigitalService[];
  panelTitle?: string;
};

export default function HomeFeaturedDigitalServices({
  items,
  panelTitle = homepageServicesSection.digitalPanelTitle,
}: Props) {
  return (
    <div
      className="rounded-2xl bg-destiny-cream/70 border border-destiny-purple/10 p-5 sm:p-8 shadow-sm"
      aria-labelledby="homepage-digital-services-heading"
    >
      <h3
        id="homepage-digital-services-heading"
        className="text-center font-display text-lg sm:text-xl font-bold text-destiny-purple mb-6 sm:mb-8 tracking-wide"
      >
        <span className="text-destiny-gold text-[0.65rem] align-middle mx-1.5 sm:mx-2" aria-hidden>
          ◆
        </span>
        {panelTitle}
        <span className="text-destiny-gold text-[0.65rem] align-middle mx-1.5 sm:mx-2" aria-hidden>
          ◆
        </span>
      </h3>
      <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
        {items.map((item) => (
          <article
            key={item.title}
            className="card p-0 overflow-hidden flex flex-col hover:shadow-xl transition-shadow group bg-white"
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
              {item.ribbon ? (
                <span
                  className="absolute top-0 left-0 bg-destiny-gold text-destiny-purple text-xs font-bold px-3 py-1.5 rounded-br-xl shadow-md"
                >
                  {item.ribbon}
                </span>
              ) : null}
              <span
                className="absolute top-3 right-3 min-w-[4.5rem] text-center text-sm font-bold bg-destiny-gold text-destiny-purple px-3 py-1.5 rounded-full shadow-md tabular-nums"
                aria-label={`價格 ${item.price}`}
              >
                {item.price}
              </span>
            </div>
            <div className="p-5 sm:p-6 flex flex-col flex-1">
              <h4 className="font-display text-xl sm:text-2xl font-bold text-destiny-purple">
                {item.title}
              </h4>
              {item.tag ? (
                <p className="text-sm text-destiny-gold font-medium mt-1.5 mb-3">{item.tag}</p>
              ) : (
                <div className="mb-4" />
              )}
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
    </div>
  );
}
