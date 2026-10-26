import type { AnnualReportViewId } from "@/lib/palace-report-copy";
import {
  LEGACY_ANNUAL_SLOTS,
  tierFromStorageSlot,
} from "@/lib/palace-report/config";
import type { AnnualReportAccess } from "@/lib/palace-report/types";
import {
  getAnnualReportAccess,
  getAnnualReportContentsForChart,
} from "@/lib/palace-report/store";

export interface AnnualReportView {
  id: AnnualReportViewId;
  text: string;
}

function slotToViewId(slot: string): AnnualReportViewId | null {
  const tier = tierFromStorageSlot(slot);
  if (tier) return tier;
  if (slot === LEGACY_ANNUAL_SLOTS.brief) return "legacyBrief";
  if (slot === LEGACY_ANNUAL_SLOTS.detailed) return "legacyDetailed";
  return null;
}

export async function loadAnnualReportViews(chartKey: string): Promise<{
  access: AnnualReportAccess;
  views: AnnualReportView[];
}> {
  const access = await getAnnualReportAccess(chartKey);
  const contents = await getAnnualReportContentsForChart(chartKey);
  const views: AnnualReportView[] = [];
  for (const row of contents) {
    const id = slotToViewId(row.palace);
    if (id) views.push({ id, text: row.text });
  }
  return { access, views };
}
