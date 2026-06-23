import { siteConfig } from "@/lib/site-config";

interface Props {
  className?: string;
}

/** Google Maps 嵌入 — 灣仔工作室 */
export default function GoogleMapsEmbed({ className = "" }: Props) {
  const query = encodeURIComponent(`${siteConfig.address} Destiny Home`);
  const src = `https://maps.google.com/maps?q=${query}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={`rounded-xl overflow-hidden border border-destiny-purple/10 shadow-md ${className}`}>
      <iframe
        title="Destiny Home 灣仔工作室地圖"
        src={src}
        width="100%"
        height="320"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
