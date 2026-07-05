import Image from "next/image";
import { imageUrl } from "@/lib/site-images";

interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

export default function SiteImage({
  src,
  alt,
  width = 1200,
  height,
  className = "",
  priority = false,
  fill = false,
  sizes,
}: Props) {
  const url = imageUrl(src, width);
  const h = height ?? width;

  if (fill) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "100vw"}
        className={className}
      />
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={width}
      height={h}
      priority={priority}
      sizes={sizes ?? `(max-width: 768px) 100vw, ${width}px`}
      className={className}
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
        className="object-cover object-center"
        sizes="100vw"
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
