interface Props {
  className?: string;
  title?: string;
}

/** 內嵌 SVG — 避免 next/image 載入 SVG 失敗 */
export default function LogoMark({ className = "w-11 h-11", title = "馮命居" }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      fill="none"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id="dh-gold" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E8C55A" />
          <stop offset="1" stopColor="#C9A96E" />
        </linearGradient>
        <radialGradient id="dh-glow" cx="100" cy="92" r="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C9A96E" stopOpacity="0.18" />
          <stop offset="1" stopColor="#C9A96E" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="#0F1A33" />
      <circle cx="100" cy="100" r="96" fill="url(#dh-glow)" />
      <circle cx="100" cy="100" r="94" stroke="url(#dh-gold)" strokeWidth="2.5" opacity="0.95" />
      <path
        d="M58 128 C72 142, 128 142, 142 128"
        stroke="#C9A96E"
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity="0.45"
      />
      <circle cx="62" cy="118" r="2.2" fill="#E8C55A" opacity="0.85" />
      <circle cx="82" cy="132" r="1.8" fill="#C9A96E" opacity="0.7" />
      <circle cx="118" cy="132" r="1.8" fill="#C9A96E" opacity="0.7" />
      <circle cx="138" cy="118" r="2.2" fill="#E8C55A" opacity="0.85" />
      <path
        d="M54 118 L100 68 L146 118"
        stroke="url(#dh-gold)"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M88 118 V138 C88 141, 112 141, 112 138 V118"
        stroke="#C9A96E"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
      />
      <path
        d="M100 86 L103.2 96.8 L114.5 96.8 L105.6 103.4 L108.8 114.2 L100 107.6 L91.2 114.2 L94.4 103.4 L85.5 96.8 L96.8 96.8 Z"
        fill="url(#dh-gold)"
      />
      <circle cx="100" cy="100.5" r="3.2" fill="#0F1A33" />
      <circle cx="100" cy="100.5" r="1.6" fill="#E8C55A" />
    </svg>
  );
}
