import Link from "next/link";
import { siteConfig, whatsappUrl } from "@/lib/site-config";

export default function AnnouncementBar() {
  return (
    <div className="bg-destiny-purple text-destiny-gold text-center py-2 px-4 text-xs sm:text-sm border-b border-destiny-gold/20">
      <p className="sm:hidden font-medium">
        {siteConfig.announcementShort}
        {" · "}
        <Link href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="underline">
          IG 好評
        </Link>
      </p>
      <p className="hidden sm:block">
        <Link
          href={siteConfig.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-medium"
        >
          {siteConfig.announcement}
        </Link>
      </p>
    </div>
  );
}
