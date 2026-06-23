"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isEnglishPath, switchLocalePath } from "@/lib/i18n-path";

export default function LangSwitch() {
  const pathname = usePathname() ?? "/";
  const isEn = isEnglishPath(pathname);
  const href = switchLocalePath(pathname, isEn ? "zh" : "en");

  return (
    <Link
      href={href}
      className="text-sm px-2.5 py-1 rounded-full border border-destiny-purple/15 hover:border-destiny-gold/50 hover:text-destiny-gold transition-colors whitespace-nowrap"
      hrefLang={isEn ? "zh-HK" : "en"}
    >
      {isEn ? "中文" : "EN"}
    </Link>
  );
}
