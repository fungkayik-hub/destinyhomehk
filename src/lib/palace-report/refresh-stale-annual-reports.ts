import {
  getCachedAnnualReport,
  shouldRegenerateStoredAnnualReport,
  type AnnualGenerationTier,
} from "@/lib/ai/analyze-annual-report";
import {
  LEGACY_ANNUAL_SLOTS,
  storageSlotForTier,
  type PalaceReportTier,
} from "@/lib/palace-report/config";
import {
  getAnnualReportAccess,
  getAnnualReportContentsForChart,
  saveReportContent,
} from "@/lib/palace-report/store";
import type { ZiWeiChart } from "@/lib/ziwei/types";

function contentRowForTier(
  contents: Awaited<ReturnType<typeof getAnnualReportContentsForChart>>,
  tier: PalaceReportTier,
) {
  const slot = storageSlotForTier(tier);
  const direct = contents.find((c) => c.palace === slot);
  if (direct) return { row: direct, saveSlot: slot };
  if (tier === "standard") {
    const legacy = contents.find((c) => c.palace === LEGACY_ANNUAL_SLOTS.detailed);
    if (legacy) {
      return { row: legacy, saveSlot: slot };
    }
  }
  return null;
}

/** Regenerate annual reports that still use the old duplicate 流月 template. */
export async function refreshStaleAnnualReportsIfNeeded(
  chartKey: string,
  chart: ZiWeiChart,
): Promise<void> {
  const access = await getAnnualReportAccess(chartKey);
  const contents = await getAnnualReportContentsForChart(chartKey);
  const tiers: PalaceReportTier[] = [];
  if (access.standard) tiers.push("standard");
  if (access.full) tiers.push("full");

  for (const tier of tiers) {
    const located = contentRowForTier(contents, tier);
    if (!located) continue;
    const generationTier: AnnualGenerationTier = tier;
    if (!shouldRegenerateStoredAnnualReport(located.row.text, generationTier)) {
      continue;
    }
    const { text, provider } = await getCachedAnnualReport(
      chartKey,
      chart,
      generationTier,
    );
    await saveReportContent({
      chartKey,
      palace: located.saveSlot,
      text,
      provider,
      tier,
    });
  }
}
