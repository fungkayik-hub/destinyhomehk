"use client";

import { trackEvent } from "@/lib/ga";

type Props = React.ComponentProps<"a"> & {
  /** GA4 `whatsapp_click` location param for Ads attribution */
  location: string;
};

export default function TrackedWhatsAppLink({
  location,
  onClick,
  children,
  ...props
}: Props) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackEvent("whatsapp_click", { location });
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
