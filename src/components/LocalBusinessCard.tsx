import Link from "next/link";
import { siteConfig, whatsappUrl } from "@/lib/site-config";

/** 關於頁／本地 SEO：NAP + Google Maps / GBP 連結 */
export default function LocalBusinessCard() {
  return (
    <section
      className="card mt-8 border-destiny-gold/25 bg-gradient-to-br from-white to-destiny-cream/40"
      aria-label="店舖資料"
    >
      <h2 className="font-display text-lg font-bold text-destiny-purple mb-4">
        灣仔工作室 · 預約面談
      </h2>
      <dl className="grid sm:grid-cols-2 gap-4 text-sm text-destiny-purple/80">
        <div>
          <dt className="text-destiny-purple/50 text-xs mb-1">地址</dt>
          <dd className="font-medium">{siteConfig.address}</dd>
        </div>
        <div>
          <dt className="text-destiny-purple/50 text-xs mb-1">營業時間</dt>
          <dd className="font-medium">{siteConfig.hours}</dd>
        </div>
        <div>
          <dt className="text-destiny-purple/50 text-xs mb-1">電話 / WhatsApp</dt>
          <dd>
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="font-medium hover:text-destiny-gold"
            >
              {siteConfig.phone}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-destiny-purple/50 text-xs mb-1">服務地區</dt>
          <dd className="font-medium">香港（面談 / 風水到府 / 網上問事）</dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-3 mt-6">
        <a
          href={siteConfig.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-sm"
        >
          Google Maps 導航
        </a>
        {siteConfig.googleBusinessUrl ? (
          <a
            href={siteConfig.googleBusinessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm"
          >
            Google 商家 · 睇評價
          </a>
        ) : null}
        <Link href="/booking" className="btn-primary text-sm">
          收費及預約
        </Link>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-sm"
        >
          WhatsApp 預約
        </a>
      </div>
      <p className="text-xs text-destiny-purple/45 mt-4 leading-relaxed">
        搜尋「灣仔紫微斗數」「香港算命師傅」可找到 Destiny Home。
        建議在 Google 地圖為本店留下評價，幫助更多有緣人。
      </p>
    </section>
  );
}
