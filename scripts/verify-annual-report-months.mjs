/**
 * Verify 12 distinct monthly 宜/忌 for chart-aware annual fallback.
 * Usage: node scripts/verify-annual-report-months.mjs
 */
import { generateChart } from "../src/lib/ziwei/iztro-adapter.ts";
import { analyzeAnnualReport } from "../src/lib/ai/analyze-annual-report.ts";
import {
  hasDistinctMonthlyYiJi,
  isKnownGenericMonthlyTemplate,
  parseMonthlyLinesFromReport,
} from "../src/lib/ai/annual-report-monthly.ts";

const birth = {
  year: 2000,
  month: 1,
  day: 1,
  hour: 12,
  minute: 0,
  gender: "male",
  calendarType: "solar",
  birthPlaceId: "hong-kong",
};

const chart = generateChart(birth);
const { text, provider } = await analyzeAnnualReport(chart, "standard");

const months = parseMonthlyLinesFromReport(text);
const distinct = hasDistinctMonthlyYiJi(text, 12);
const generic = isKnownGenericMonthlyTemplate(text);

console.log("provider:", provider);
console.log("month lines parsed:", months.length);
console.log("distinct monthly 宜/忌:", distinct);
console.log("generic template:", generic);

if (!distinct || generic || months.length < 12) {
  console.error("FAIL: annual report monthly blocks are not unique enough");
  process.exit(1);
}

const yiJi = new Set(months.map((m) => `${m.yi}|${m.ji}`));
console.log("unique yi|ji signatures:", yiJi.size);
console.log("OK");
process.exit(0);
