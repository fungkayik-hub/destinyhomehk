import Link from "next/link";
import Image from "next/image";
import {
  LIUNIAN_2027_HUB_PATH,
  liunian2027,
  liunian2027ZodiacPath,
} from "@/lib/liunian-2027";

type Props = {
  compact?: boolean;
  showHeading?: boolean;
};

export default function Liunian2027ZodiacGrid({
  compact = false,
  showHeading = true,
}: Props) {
  const { zodiacs } = liunian2027;

  return (
    <div>
      {showHeading ? (
        <h2 className="font-display text-lg sm:text-xl font-bold text-destiny-purple mb-4 text-center">
          揀你嘅生肖睇流年
        </h2>
      ) : null}
      <ul
        className={
          compact
            ? "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3 list-none p-0 m-0"
            : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 list-none p-0 m-0"
        }
      >
        {zodiacs.map((z) => (
          <li key={z.slug}>
            <Link
              href={liunian2027ZodiacPath(z.slug)}
              className="group block rounded-xl overflow-hidden border border-destiny-purple/15 bg-white shadow-sm hover:shadow-md hover:border-destiny-gold/50 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destiny-gold"
            >
              <div className="relative aspect-square bg-destiny-cream overflow-hidden">
                <Image
                  src={z.coverSquare}
                  alt={z.title}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  sizes={compact ? "(max-width: 640px) 33vw, 120px" : "(max-width: 640px) 50vw, 160px"}
                />
              </div>
              <p
                className={
                  compact
                    ? "text-center text-sm font-semibold text-destiny-purple py-2 group-hover:text-destiny-gold"
                    : "text-center text-base font-bold text-destiny-purple py-2.5 group-hover:text-destiny-gold"
                }
              >
                屬{z.slug}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-center mt-4">
        <Link
          href={LIUNIAN_2027_HUB_PATH}
          className="text-sm font-medium text-destiny-purple hover:text-destiny-gold underline underline-offset-2"
        >
          睇總覽同太歲關係表 →
        </Link>
      </p>
    </div>
  );
}
