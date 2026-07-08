import { headers } from "next/headers";
import { clientIp } from "@/lib/rate-limit";
import { recordUsageEvent, recordUsageFromHeaders } from "@/lib/usage/store";
import type { UsageTool } from "@/lib/usage/types";
import { hashVisitor, shouldExcludeIp } from "@/lib/usage/visitor";

/** Log a successful tool use from a server component page. */
export async function logToolUsage(tool: UsageTool, locale?: string): Promise<void> {
  const h = await headers();
  await recordUsageFromHeaders(tool, h, locale);
}

/** Log from an API route that has the raw Request. */
export async function logToolUsageFromRequest(
  tool: UsageTool,
  request: Request,
  locale?: string,
): Promise<void> {
  const ip = clientIp(request);
  if (shouldExcludeIp(ip)) return;
  await recordUsageEvent({
    tool,
    visitorHash: hashVisitor(ip),
    locale,
  });
}
