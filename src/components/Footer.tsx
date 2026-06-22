import Link from "next/link";
import { navItems, siteConfig, whatsappUrl } from "@/lib/site-config";

export default function Footer() {
  const academyLinks = navItems.find((n) => n.children)?.children ?? [];

  return (
    <footer className="bg-destiny-purple text-white/80 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <h3 className="font-display text-lg font-bold text-white mb-3">Destiny Home</h3>
          <p className="text-sm leading-relaxed mb-3 line-clamp-4 sm:line-clamp-none">{siteConfig.description}</p>
          <p className="text-sm">
            ⭐ {siteConfig.rating.score} / 5 · 過千好評
          </p>
        </div>

        <div>
          <h4 className="font-medium text-white mb-3">服務</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/chart" className="hover:text-destiny-gold">紫微即時排盤</Link></li>
            <li><Link href="/booking" className="hover:text-destiny-gold">結婚擇日（預約）</Link></li>
            <li><Link href="/booking" className="hover:text-destiny-gold">收費及預約</Link></li>
            <li><Link href="/about" className="hover:text-destiny-gold">關於師傅</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-white mb-3">學堂</h4>
          <ul className="space-y-2 text-sm">
            {academyLinks.slice(0, 5).map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-destiny-gold">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-white mb-3">聯絡我們</h4>
          <ul className="space-y-2 text-sm">
            <li>{siteConfig.address}</li>
            <li>{siteConfig.hours}</li>
            <li>
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="hover:text-destiny-gold">
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-destiny-gold">
                Instagram
              </a>
            </li>
            <li>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-destiny-gold">
                WhatsApp 預約
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50 px-4">
        © {new Date().getFullYear()} destinyhomehk · {siteConfig.school}
      </div>
    </footer>
  );
}
