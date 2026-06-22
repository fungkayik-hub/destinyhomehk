"use client";

import Link from "next/link";
import SiteImage from "@/components/SiteImage";
import { useState } from "react";
import { navItems, siteConfig, whatsappUrl } from "@/lib/site-config";
import { siteImages } from "@/lib/site-images";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [academyOpen, setAcademyOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-destiny-cream/95 backdrop-blur-md text-destiny-ink shadow-sm border-b border-destiny-purple/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 min-w-0">
          <SiteImage
            src={siteImages.logo}
            alt="Destiny Home"
            width={100}
            priority
            className="w-11 h-11 rounded-full object-cover ring-2 ring-destiny-gold/30"
          />
          <span className="font-display text-base sm:text-lg md:text-xl font-bold truncate">
            Destiny Home
          </span>
        </Link>

        <nav className="hidden xl:flex items-center gap-5 text-sm">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.label} className="relative group">
                <button className="hover:text-destiny-gold transition-colors flex items-center gap-1">
                  {item.label}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white shadow-xl rounded-xl border border-destiny-purple/10 py-2 min-w-[240px]">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 hover:bg-destiny-cream hover:text-destiny-gold text-sm"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href!} className="hover:text-destiny-gold transition-colors whitespace-nowrap">
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden xl:flex items-center gap-3 shrink-0">
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:text-destiny-gold transition-colors"
          >
            Instagram
          </a>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-2 px-4">
            立即預約
          </a>
        </div>

        <div className="flex items-center gap-2 xl:hidden shrink-0">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs py-2 px-3.5 min-h-[44px]"
          >
            預約
          </a>
          <button
            type="button"
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-destiny-purple/5"
            onClick={() => setOpen(!open)}
            aria-label="開啟選單"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="xl:hidden border-t border-destiny-purple/10 px-4 py-4 flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.label}>
                <button
                  className="w-full text-left py-3 font-medium flex justify-between items-center min-h-[44px]"
                  onClick={() => setAcademyOpen(!academyOpen)}
                >
                  {item.label}
                  <span>{academyOpen ? "−" : "+"}</span>
                </button>
                {academyOpen && (
                  <div className="pl-4 pb-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block py-2.5 text-sm text-destiny-purple/70 hover:text-destiny-gold min-h-[44px]"
                        onClick={() => setOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                className="py-3 hover:text-destiny-gold transition-colors min-h-[44px] flex items-center"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ),
          )}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-center mt-3"
            onClick={() => setOpen(false)}
          >
            WhatsApp 預約
          </a>
        </nav>
      )}
    </header>
  );
}
