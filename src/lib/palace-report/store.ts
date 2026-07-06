import { sql } from "@vercel/postgres";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type Stripe from "stripe";
import { findPalaceReportProduct } from "@/lib/palace-report/config";
import type {
  CreatePurchaseResult,
  PalaceReportContent,
  PalaceReportPurchase,
  SaveReportContentInput,
} from "@/lib/palace-report/types";
import { PALACES, type PalaceName } from "@/lib/ziwei/types";

const DATA_FILE = path.join(process.cwd(), "data", "palace-reports.json");

interface JsonStore {
  purchases: PalaceReportPurchase[];
  contents: PalaceReportContent[];
}

const EMPTY_JSON_STORE: JsonStore = { purchases: [], contents: [] };

function hasPostgres(): boolean {
  return Boolean(process.env.POSTGRES_URL?.trim());
}

function isPalaceName(value: string): value is PalaceName {
  return (PALACES as readonly string[]).includes(value);
}

function parsePalaces(raw: string): PalaceName[] | null {
  const names = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (names.length === 0) return null;
  if (!names.every(isPalaceName)) return null;
  return names;
}

function rowToPurchase(row: {
  id: string;
  chart_key: string;
  stripe_session_id: string;
  product_id: string;
  palaces: string[] | string;
  amount_paid_cents: number;
  customer_email: string | null;
  created_at: string | Date;
}): PalaceReportPurchase {
  const palaces = Array.isArray(row.palaces)
    ? row.palaces.filter(isPalaceName)
    : (parsePalaces(row.palaces) ?? []);

  return {
    id: row.id,
    chartKey: row.chart_key,
    stripeSessionId: row.stripe_session_id,
    productId: row.product_id,
    palaces,
    amountPaidCents: row.amount_paid_cents,
    customerEmail: row.customer_email ?? undefined,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at),
  };
}

function rowToContent(row: {
  chart_key: string;
  palace: string;
  text: string;
  provider: string;
  generated_at: string | Date;
}): PalaceReportContent {
  return {
    chartKey: row.chart_key,
    palace: row.palace as PalaceName,
    text: row.text,
    provider: row.provider,
    generatedAt:
      row.generated_at instanceof Date
        ? row.generated_at.toISOString()
        : String(row.generated_at),
  };
}

async function ensureJsonStore(): Promise<JsonStore> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<JsonStore>;
    return {
      purchases: parsed.purchases ?? [],
      contents: parsed.contents ?? [],
    };
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
    CREATE TABLE IF NOT EXISTS palace_report_purchases (
      id TEXT PRIMARY KEY,
      chart_key TEXT NOT NULL,
      stripe_session_id TEXT NOT NULL UNIQUE,
      product_id TEXT NOT NULL,
      palaces TEXT NOT NULL,
      amount_paid_cents INTEGER NOT NULL,
      customer_email TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS palace_report_purchases_chart_key_idx
    ON palace_report_purchases (chart_key)
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS palace_report_contents (
      chart_key TEXT NOT NULL,
      palace TEXT NOT NULL,
      text TEXT NOT NULL,
      provider TEXT NOT NULL,
      generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (chart_key, palace)
    )
  `;
}

export async function getPurchaseByStripeSessionId(
  sessionId: string,
): Promise<PalaceReportPurchase | null> {
  if (hasPostgres()) {
    await ensurePostgresTables();
    const { rows } = await sql`
      SELECT * FROM palace_report_purchases
      WHERE stripe_session_id = ${sessionId}
      LIMIT 1
    `;
    if (!rows[0]) return null;
    return rowToPurchase(rows[0] as Parameters<typeof rowToPurchase>[0]);
  }

  const store = await ensureJsonStore();
  return store.purchases.find((p) => p.stripeSessionId === sessionId) ?? null;
}

export async function createPurchaseFromSession(
  session: Stripe.Checkout.Session,
): Promise<CreatePurchaseResult> {
  const existing = await getPurchaseByStripeSessionId(session.id);
  if (existing) {
    return { ok: true, purchase: existing };
  }

  const metadata = session.metadata ?? {};
  const chartKey = metadata.chartKey?.trim();
  const productId = metadata.productId?.trim();
  const palacesRaw = metadata.palaces?.trim();

  if (!chartKey || !productId || !palacesRaw) {
    return { ok: false, error: "missing_metadata" };
  }

  const product = findPalaceReportProduct(productId);
  if (!product) {
    return { ok: false, error: "invalid_product" };
  }

  const palaces = parsePalaces(palacesRaw);
  if (!palaces || palaces.length === 0 || palaces.length > product.maxPalaces) {
    return { ok: false, error: "invalid_palaces" };
  }

  const purchase: PalaceReportPurchase = {
    id: randomUUID(),
    chartKey,
    stripeSessionId: session.id,
    productId,
    palaces,
    amountPaidCents: session.amount_total ?? product.priceCents,
    customerEmail:
      session.customer_details?.email?.trim() ||
      metadata.customerEmail?.trim() ||
      undefined,
    createdAt: new Date().toISOString(),
  };

  if (hasPostgres()) {
    try {
      await ensurePostgresTables();
      await sql`
        INSERT INTO palace_report_purchases (
          id, chart_key, stripe_session_id, product_id, palaces,
          amount_paid_cents, customer_email, created_at
        ) VALUES (
          ${purchase.id},
          ${purchase.chartKey},
          ${purchase.stripeSessionId},
          ${purchase.productId},
          ${purchase.palaces.join(",")},
          ${purchase.amountPaidCents},
          ${purchase.customerEmail ?? null},
          ${purchase.createdAt}::timestamptz
        )
      `;
      return { ok: true, purchase };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("stripe_session_id") || message.includes("unique")) {
        const duplicate = await getPurchaseByStripeSessionId(session.id);
        if (duplicate) return { ok: true, purchase: duplicate };
      }
      console.error("Postgres palace-report purchase insert failed:", err);
      return { ok: false, error: "storage_error" };
    }
  }

  try {
    const store = await ensureJsonStore();
    if (store.purchases.some((p) => p.stripeSessionId === session.id)) {
      const duplicate = store.purchases.find((p) => p.stripeSessionId === session.id)!;
      return { ok: true, purchase: duplicate };
    }
    store.purchases.push(purchase);
    await writeJsonStore(store);
    return { ok: true, purchase };
  } catch (err) {
    console.error("JSON palace-report purchase store failed:", err);
    return { ok: false, error: "storage_error" };
  }
}

export async function getUnlockedPalaces(chartKey: string): Promise<PalaceName[]> {
  if (hasPostgres()) {
    await ensurePostgresTables();
    const { rows } = await sql<{ palaces: string }>`
      SELECT palaces FROM palace_report_purchases
      WHERE chart_key = ${chartKey}
    `;
    const unlocked = new Set<PalaceName>();
    for (const row of rows) {
      const parsed = parsePalaces(row.palaces);
      if (!parsed) continue;
      for (const palace of parsed) unlocked.add(palace);
    }
    return [...unlocked];
  }

  const store = await ensureJsonStore();
  const unlocked = new Set<PalaceName>();
  for (const purchase of store.purchases) {
    if (purchase.chartKey !== chartKey) continue;
    for (const palace of purchase.palaces) {
      unlocked.add(palace);
    }
  }
  return [...unlocked];
}

export async function getReportContent(
  chartKey: string,
  palace: PalaceName,
): Promise<PalaceReportContent | null> {
  if (hasPostgres()) {
    await ensurePostgresTables();
    const { rows } = await sql`
      SELECT * FROM palace_report_contents
      WHERE chart_key = ${chartKey} AND palace = ${palace}
      LIMIT 1
    `;
    if (!rows[0]) return null;
    return rowToContent(rows[0] as Parameters<typeof rowToContent>[0]);
  }

  const store = await ensureJsonStore();
  return (
    store.contents.find((c) => c.chartKey === chartKey && c.palace === palace) ?? null
  );
}

export async function getReportContentsForChart(
  chartKey: string,
): Promise<PalaceReportContent[]> {
  if (hasPostgres()) {
    await ensurePostgresTables();
    const { rows } = await sql`
      SELECT * FROM palace_report_contents
      WHERE chart_key = ${chartKey}
      ORDER BY generated_at ASC
    `;
    return rows.map((row) =>
      rowToContent(row as Parameters<typeof rowToContent>[0]),
    );
  }

  const store = await ensureJsonStore();
  return store.contents.filter((c) => c.chartKey === chartKey);
}

export async function saveReportContent(
  input: SaveReportContentInput,
): Promise<PalaceReportContent> {
  const content: PalaceReportContent = {
    chartKey: input.chartKey,
    palace: input.palace,
    text: input.text,
    provider: input.provider,
    generatedAt: new Date().toISOString(),
  };

  if (hasPostgres()) {
    await ensurePostgresTables();
    await sql`
      INSERT INTO palace_report_contents (
        chart_key, palace, text, provider, generated_at
      ) VALUES (
        ${content.chartKey},
        ${content.palace},
        ${content.text},
        ${content.provider},
        ${content.generatedAt}::timestamptz
      )
      ON CONFLICT (chart_key, palace) DO UPDATE SET
        text = EXCLUDED.text,
        provider = EXCLUDED.provider,
        generated_at = EXCLUDED.generated_at
    `;
    return content;
  }

  const store = await ensureJsonStore();
  const index = store.contents.findIndex(
    (c) => c.chartKey === content.chartKey && c.palace === content.palace,
  );
  if (index >= 0) {
    store.contents[index] = content;
  } else {
    store.contents.push(content);
  }
  await writeJsonStore(store);
  return content;
}
