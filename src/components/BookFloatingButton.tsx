"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/ga";

export default function BookFloatingButton() {
  const pathname = usePathname();
  if (pathname === "/book" || pathname?.startsWith("/book/")) {
    return null;
  }

  const onChart = pathname === "/chart" || pathname?.startsWith("/en/chart");
  const label = onChart ? "預約全批" : "網上預約";

  return (
    <Link
      href="/book"
      onClick={() =>
        trackEvent("booking_click", {
          location: onChart ? "floating_button_chart" : "floating_button",
        })
      }
      className="fixed bottom-[4.75rem] right-4 sm:bottom-[5.25rem] sm:right-6 z-50 flex items-center gap-2 bg-destiny-purple text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:scale-105 transition-transform mb-[env(safe-area-inset-bottom)]"
      aria-label={label}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span className="font-medium text-sm hidden sm:inline">{label}</span>
      {onChart && <span className="font-medium text-sm sm:hidden">全批</span>}
    </Link>
  );
}
