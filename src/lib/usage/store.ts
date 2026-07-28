import { sql } from "@vercel/postgres";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type {
  DailyUsageRow,
  ToolUsageRow,
  UsageEvent,
  UsageStats,
  UsageTool,
} from "@/lib/usage/types";
import {
  getExcludedIps,
  hashVisitor,
  ipFromHeaders,
  shouldExcludeIp,
} from "@/lib/usage/visitor";

const DATA_FILE = path.join(process.cwd(), "data", "usage-events.json");

const TOOL_LABELS: Record<UsageTool, string> = {
  chart: "紫微排盤",
  "chart-en": "紫微排盤（英文）",
  compatibility: "姻緣探測器",
  "date-picker": "結婚吉日篩選",
  "fortune-stick": "觀音求籤",
  nameology: "姓名學五格",
};

interface JsonStore {
  events: UsageEvent[];
}

const EMPTY_JSON_STORE: JsonStore = { events: [] };

function hasPostgres(): boolean {
  return Boolean(process.env.POSTGRES_URL?.trim());
}

async function ensureJsonStore(): Promise<JsonStore> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<JsonStore>;
    return { events: parsed.events ?? [] };
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(EMPTY_JSON_STORE, null, 2), "utf-8");
    return { ...EMPTY_JSON_STORE };
  }
}

async function writeJsonStore(store: JsonStore): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
}

async function ensurePostgresTables(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS tool_usage_events (
      id TEXT PRIMARY KEY,
      tool TEXT NOT NULL,
      visitor_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      locale TEXT
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS tool_usage_events_tool_created_idx
    ON tool_usage_events (tool, created_at DESC)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS tool_usage_events_visitor_idx
    ON tool_usage_events (visitor_hash)
  `;
}

export async function recordUsageEvent(input: {
  tool: UsageTool;
  visitorHash: string;
  locale?: string;
}): Promise<void> {
  const event: UsageEvent = {
    id: randomUUID(),
    tool: input.tool,
    visitorHash: input.visitorHash,
    createdAt: new Date().toISOString(),
    locale: input.locale,
  };

  if (hasPostgres()) {
    await ensurePostgresTables();
    await sql`
      INSERT INTO tool_usage_events (id, tool, visitor_hash, created_at, locale)
      VALUES (
        ${event.id},
        ${event.tool},
        ${event.visitorHash},
        ${event.createdAt}::timestamptz,
        ${event.locale ?? null}
      )
    `;
    return;
  }

  const store = await ensureJsonStore();
  store.events.push(event);
  await writeJsonStore(store);
}

async function getFortuneStickCounts(): Promise<{
  totalDraws: number;
  paidInterpretations: number;
}> {
  if (hasPostgres()) {
    try {
      const { rows } = await sql`
        SELECT
          COUNT(*)::int AS total_draws,
          COUNT(*) FILTER (WHERE paid_at IS NOT NULL)::int AS paid_count
        FROM fortune_stick_draws
      `;
      const row = rows[0] as { total_draws: number; paid_count: number } | undefined;
      return {
        totalDraws: row?.total_draws ?? 0,
        paidInterpretations: row?.paid_count ?? 0,
      };
    } catch {
      return { totalDraws: 0, paidInterpretations: 0 };
    }
  }

  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "data", "fortune-stick-draws.json"),
      "utf-8",
    );
    const parsed = JSON.parse(raw) as { draws?: { paidAt?: string }[] };
    const draws = parsed.draws ?? [];
    return {
      totalDraws: draws.length,
      paidInterpretations: draws.filter((d) => d.paidAt).length,
    };
  } catch {
    return { totalDraws: 0, paidInterpretations: 0 };
  }
}

function buildToolRows(
  rows: { tool: string; total: number; unique_visitors: number }[],
): ToolUsageRow[] {
  const byTool = new Map(rows.map((r) => [r.tool, r]));
  return (Object.keys(TOOL_LABELS) as UsageTool[]).map((tool) => {
    const row = byTool.get(tool);
    return {
      tool,
      label: TOOL_LABELS[tool],
      total: row?.total ?? 0,
      uniqueVisitors: row?.unique_visitors ?? 0,
    };
  });
}

function buildDailyRows(
  rows: { day: string; total: number; unique_visitors: number }[],
): DailyUsageRow[] {
  return rows.map((r) => ({
    date: String(r.day).slice(0, 10),
    total: r.total,
    uniqueVisitors: r.unique_visitors,
  }));
}

async function getStatsFromPostgres(excludeHashes: string[]): Promise<UsageStats> {
  await ensurePostgresTables();

  const excludeJson = JSON.stringify(excludeHashes);
  const hasExclude = excludeHashes.length > 0;

  const { rows: toolRows } = hasExclude
    ? await sql`
        SELECT
          tool,
          COUNT(*)::int AS total,
          COUNT(DISTINCT visitor_hash)::int AS unique_visitors
        FROM tool_usage_events
        WHERE visitor_hash NOT IN (
          SELECT json_array_elements_text(${excludeJson}::json)
        )
        GROUP BY tool
        ORDER BY total DESC
      `
    : await sql`
        SELECT
          tool,
          COUNT(*)::int AS total,
          COUNT(DISTINCT visitor_hash)::int AS unique_visitors
        FROM tool_usage_events
        GROUP BY tool
        ORDER BY total DESC
      `;

  const { rows: dailyRows } = hasExclude
    ? await sql`
        SELECT
          DATE(created_at AT TIME ZONE 'Asia/Hong_Kong')::text AS day,
          COUNT(*)::int AS total,
          COUNT(DISTINCT visitor_hash)::int AS unique_visitors
        FROM tool_usage_events
        WHERE created_at >= NOW() - INTERVAL '7 days'
          AND visitor_hash NOT IN (
            SELECT json_array_elements_text(${excludeJson}::json)
          )
        GROUP BY day
        ORDER BY day DESC
      `
    : await sql`
        SELECT
          DATE(created_at AT TIME ZONE 'Asia/Hong_Kong')::text AS day,
          COUNT(*)::int AS total,
          COUNT(DISTINCT visitor_hash)::int AS unique_visitors
        FROM tool_usage_events
        WHERE created_at >= NOW() - INTERVAL '7 days'
        GROUP BY day
        ORDER BY day DESC
      `;

  const { rows: totalRows } = hasExclude
    ? await sql`
        SELECT
          COUNT(*)::int AS total,
          COUNT(DISTINCT visitor_hash)::int AS unique_visitors
        FROM tool_usage_events
        WHERE visitor_hash NOT IN (
          SELECT json_array_elements_text(${excludeJson}::json)
        )
      `
    : await sql`
        SELECT
          COUNT(*)::int AS total,
          COUNT(DISTINCT visitor_hash)::int AS unique_visitors
        FROM tool_usage_events
      `;

  const fortuneStick = await getFortuneStickCounts();
  const totals = totalRows[0] as { total: number; unique_visitors: number } | undefined;

  return {
    generatedAt: new Date().toISOString(),
    excludeConfigured: getExcludedIps().size > 0,
    tools: buildToolRows(
      toolRows as { tool: string; total: number; unique_visitors: number }[],
    ),
    last7Days: buildDailyRows(
      dailyRows as { day: string; total: number; unique_visitors: number }[],
    ),
    fortuneStick,
    totals: {
      events: totals?.total ?? 0,
      uniqueVisitors: totals?.unique_visitors ?? 0,
    },
  };
}

async function getStatsFromJson(excludeHashes: string[]): Promise<UsageStats> {
  const store = await ensureJsonStore();
  const excluded = new Set(excludeHashes);
  const events = store.events.filter((e) => !excluded.has(e.visitorHash));

  const toolMap = new Map<UsageTool, { total: number; visitors: Set<string> }>();
  for (const event of events) {
    const current = toolMap.get(event.tool) ?? { total: 0, visitors: new Set<string>() };
    current.total += 1;
    current.visitors.add(event.visitorHash);
    toolMap.set(event.tool, current);
  }

  const toolRows = (Object.keys(TOOL_LABELS) as UsageTool[]).map((tool) => {
    const row = toolMap.get(tool);
    return {
      tool,
      label: TOOL_LABELS[tool],
      total: row?.total ?? 0,
      uniqueVisitors: row?.visitors.size ?? 0,
    };
  });

  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const dailyMap = new Map<string, { total: number; visitors: Set<string> }>();
  for (const event of events) {
    if (Date.parse(event.createdAt) < cutoff) continue;
    const day = event.createdAt.slice(0, 10);
    const current = dailyMap.get(day) ?? { total: 0, visitors: new Set<string>() };
    current.total += 1;
    current.visitors.add(event.visitorHash);
    dailyMap.set(day, current);
  }

  const last7Days = [...dailyMap.entries()]
    .map(([date, row]) => ({
      date,
      total: row.total,
      uniqueVisitors: row.visitors.size,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));

  const allVisitors = new Set(events.map((e) => e.visitorHash));
  const fortuneStick = await getFortuneStickCounts();

  return {
    generatedAt: new Date().toISOString(),
    excludeConfigured: getExcludedIps().size > 0,
    tools: toolRows,
    last7Days,
    fortuneStick,
    totals: {
      events: events.length,
      uniqueVisitors: allVisitors.size,
    },
  };
}

export async function getUsageStats(): Promise<UsageStats> {
  const excludeHashes = [...getExcludedIps()].map(hashVisitor);
  if (hasPostgres()) {
    return getStatsFromPostgres(excludeHashes);
  }
  return getStatsFromJson(excludeHashes);
}

export async function recordUsageFromHeaders(
  tool: UsageTool,
  headers: Headers,
  locale?: string,
): Promise<void> {
  const ip = ipFromHeaders(headers);
  if (shouldExcludeIp(ip)) return;
  await recordUsageEvent({
    tool,
    visitorHash: hashVisitor(ip),
    locale,
  });
}
