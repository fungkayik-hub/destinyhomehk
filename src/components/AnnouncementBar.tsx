import Link from "next/link";
import { gbpBusinessUrl } from "@/lib/gbp-links";
import { siteConfig } from "@/lib/site-config";

export default function AnnouncementBar() {
  const googleHref = siteConfig.googleBusinessUrl
    ? gbpBusinessUrl("announcement")
    : null;

  return (
    <div className="bg-destiny-purple text-destiny-gold text-center py-2 px-4 text-xs sm:text-sm border-b border-destiny-gold/20">
      <p className="sm:hidden font-medium">
        {siteConfig.announcementShort}
        {" · "}
        <Link href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="underline">
          IG
        </Link>
        {googleHref ? (
          <>
            {" · "}
            <Link href={googleHref} target="_blank" rel="noopener noreferrer" className="underline">
              Google
            </Link>
          </>
        ) : null}
      </p>
      <p className="hidden sm:block">
        <span className="font-medium">{siteConfig.announcement}</span>
        {" · "}
        <Link
          href={siteConfig.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          IG 好評
        </Link>
        {googleHref ? (
          <>
            {" · "}
            <Link href={googleHref} target="_blank" rel="noopener noreferrer" className="hover:underline">
              Google 好評
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}
