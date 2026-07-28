export const USAGE_TOOLS = [
  "chart",
  "chart-en",
  "compatibility",
  "date-picker",
  "fortune-stick",
  "nameology",
] as const;

export type UsageTool = (typeof USAGE_TOOLS)[number];

export interface UsageEvent {
  id: string;
  tool: UsageTool;
  visitorHash: string;
  createdAt: string;
  locale?: string;
}

export interface ToolUsageRow {
  tool: UsageTool;
  label: string;
  total: number;
  uniqueVisitors: number;
}

export interface DailyUsageRow {
  date: string;
  total: number;
  uniqueVisitors: number;
}

export interface UsageStats {
  generatedAt: string;
  excludeConfigured: boolean;
  tools: ToolUsageRow[];
  last7Days: DailyUsageRow[];
  fortuneStick: {
    totalDraws: number;
    paidInterpretations: number;
  };
  totals: {
    events: number;
    uniqueVisitors: number;
  };
}
