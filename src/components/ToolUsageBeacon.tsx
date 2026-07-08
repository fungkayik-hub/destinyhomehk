"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/ga";

interface Props {
  event: string;
  params?: Record<string, string | number | boolean>;
}

/** Fire a GA4 event once when a tool result is shown. */
export default function ToolUsageBeacon({ event, params }: Props) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent(event, params);
  }, [event, params]);

  return null;
}
