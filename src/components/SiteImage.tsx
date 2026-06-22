import { imageUrl } from "@/lib/site-images";

interface Props {
  src: string;
  alt: string;
  width?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

/** 原站 CDN 圖片 — 避免 Next Image 域名限制 */
export default function SiteImage({
  src,
  alt,
  width = 1200,
  className = "",
  priority = false,
  fill = false,
}: Props) {
  const url = imageUrl(src, width);

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
    />
  );
}

interface BannerProps {
  src: string;
  title: string;
  subtitle?: string;
  /** default = 紫色遮罩；subtle = 保留封面細節（星盤圖） */
  overlay?: "default" | "subtle";
  dark?: boolean;
}

export function PageBanner({
  src,
  title,
  subtitle,
  overlay = "default",
  dark = true,
}: BannerProps) {
  const overlayClass =
    overlay === "subtle"
      ? "bg-gradient-to-t from-destiny-purple/85 via-destiny-purple/35 to-destiny-purple/10"
      : dark
        ? "bg-gradient-to-r from-destiny-purple/90 via-destiny-purple/70 to-destiny-purple/40"
        : "bg-destiny-purple/30";

  return (
    <section className="relative h-52 md:h-72 overflow-hidden">
      <SiteImage
        src={src}
        alt={title}
        width={1920}
        fill
        priority
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className={`absolute inset-0 ${overlayClass}`} />
      <div className="relative z-10 h-full max-w-6xl mx-auto px-4 flex flex-col justify-end pb-8 md:pb-10">
        <h1 className="font-display text-2xl md:text-4xl font-bold text-white drop-shadow-md">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/90 mt-2 text-sm md:text-base max-w-xl drop-shadow">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
