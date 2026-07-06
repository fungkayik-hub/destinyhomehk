"use client";

import Link from "next/link";
import LogoMark from "@/components/LogoMark";
import LangSwitch from "@/components/LangSwitch";
import { useState } from "react";
import { navItems, siteConfig, whatsappUrl, type NavItem } from "@/lib/site-config";

function isNavLink(item: NavItem): item is { href: string; label: string } {
  return "href" in item;
}

function isNavDropdownWithChildren(
  item: NavItem,
): item is { label: string; children: { href: string; label: string }[] } {
  return "children" in item;
}

function isNavDropdownWithSections(
  item: NavItem,
): item is {
  label: string;
  sections: { label: string; items: { href: string; label: string }[] }[];
} {
  return "sections" in item;
}

function NavDropdownPanel({ item }: { item: NavItem }) {
  if (isNavDropdownWithChildren(item)) {
    return (
      <div className="bg-white shadow-xl rounded-xl border border-destiny-purple/10 py-2 min-w-[200px]">
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
    );
  }

  if (isNavDropdownWithSections(item)) {
    return (
      <div className="bg-white shadow-xl rounded-xl border border-destiny-purple/10 py-2 min-w-[260px] max-h-[70vh] overflow-y-auto">
        {item.sections.map((section) => (
          <div key={section.label}>
            <p className="px-4 pt-2.5 pb-1 text-[11px] font-medium uppercase tracking-wide text-destiny-purple/45">
              {section.label}
            </p>
            {section.items.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className="block px-4 py-2 hover:bg-destiny-cream hover:text-destiny-gold text-sm"
              >
                {child.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function MobileNavSection({
  item,
  open,
  onToggle,
  onNavigate,
}: {
  item: NavItem;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  if (isNavLink(item)) {
    return (
      <Link
        href={item.href}
        className="py-3 hover:text-destiny-gold transition-colors min-h-[44px] flex items-center"
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    );
  }

  const links = isNavDropdownWithChildren(item)
    ? item.children
    : item.sections.flatMap((section) => section.items);

  return (
    <div>
      <button
        type="button"
        className="w-full text-left py-3 font-medium flex justify-between items-center min-h-[44px] gap-3"
        onClick={onToggle}
      >
        <span className="text-sm">{item.label}</span>
        <span className="shrink-0">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="pl-4 pb-2 space-y-1">
          {isNavDropdownWithSections(item)
            ? item.sections.map((section) => (
                <div key={section.label} className="pt-1">
                  <p className="py-1 text-xs text-destiny-purple/45">{section.label}</p>
                  {section.items.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block py-2.5 text-sm text-destiny-purple/70 hover:text-destiny-gold min-h-[44px]"
                      onClick={onNavigate}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))
            : links.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block py-2.5 text-sm text-destiny-purple/70 hover:text-destiny-gold min-h-[44px]"
                  onClick={onNavigate}
                >
                  {child.label}
                </Link>
              ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mobileOpenMenu, setMobileOpenMenu] = useState<string | null>(null);

  const closeMobile = () => {
    setOpen(false);
    setMobileOpenMenu(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-destiny-cream/95 backdrop-blur-md text-destiny-ink shadow-sm border-b border-destiny-purple/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 min-w-0">
          <LogoMark
            className="w-11 h-11 shrink-0 rounded-full ring-2 ring-destiny-gold/30"
            title={siteConfig.name}
          />
          <span className="font-display text-lg sm:text-xl font-bold truncate">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-sm min-w-0">
          {navItems.map((item) =>
            isNavLink(item) ? (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-destiny-gold transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ) : (
              <div key={item.label} className="relative group shrink-0">
                <button
                  type="button"
                  className="hover:text-destiny-gold transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  {item.label}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <NavDropdownPanel item={item} />
                </div>
              </div>
            ),
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <LangSwitch />
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-destiny-purple/5 hover:text-destiny-gold transition-colors"
            aria-label="Instagram"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
          <Link href="/book" className="btn-primary text-sm py-2 px-4">
            網上預約
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden shrink-0">
          <LangSwitch />
          <Link href="/book" className="btn-primary text-xs py-2 px-3.5 min-h-[44px]">
            預約
          </Link>
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
        <nav className="lg:hidden border-t border-destiny-purple/10 px-4 py-4 flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
          {navItems.map((item) => (
            <MobileNavSection
              key={isNavLink(item) ? item.href : item.label}
              item={item}
              open={!isNavLink(item) && mobileOpenMenu === item.label}
              onToggle={() =>
                setMobileOpenMenu((current) =>
                  !isNavLink(item) && current === item.label ? null : !isNavLink(item) ? item.label : null,
                )
              }
              onNavigate={closeMobile}
            />
          ))}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-center mt-3"
            onClick={closeMobile}
          >
            WhatsApp 預約
          </a>
        </nav>
      )}
    </header>
  );
}
