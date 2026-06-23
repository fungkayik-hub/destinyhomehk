import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/schema-extra";

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: Props) {
  return (
    <nav aria-label="麵包屑" className="text-sm text-destiny-purple/55 mb-6">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1">
            {i > 0 && <span className="text-destiny-purple/30">/</span>}
            {i === items.length - 1 ? (
              <span className="text-destiny-purple/80">{item.name}</span>
            ) : (
              <Link href={item.href} className="hover:text-destiny-gold">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
