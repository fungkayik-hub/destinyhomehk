import type { CompatibilityLabel } from "@/lib/compatibility/types";

export const COMPAT_LABEL_TEXT: Record<CompatibilityLabel, string> = {
  超夾: "text-destiny-gold",
  幾夾: "text-destiny-gold-light",
  尚可: "text-destiny-muted",
  要多溝通: "text-destiny-amber",
  要用心經營: "text-destiny-red",
};

export const COMPAT_LABEL_BG: Record<CompatibilityLabel, string> = {
  超夾: "bg-destiny-gold/25 text-destiny-gold",
  幾夾: "bg-destiny-gold/15 text-destiny-purple",
  尚可: "bg-destiny-muted/15 text-destiny-muted",
  要多溝通: "bg-destiny-amber/15 text-destiny-amber",
  要用心經營: "bg-destiny-red/10 text-destiny-red",
};
