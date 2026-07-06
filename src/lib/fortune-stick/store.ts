import { sql } from "@vercel/postgres";
import { promises as fs } from "fs";
import path from "path";
import type Stripe from "stripe";
import { drawLotNumber } from "@/lib/fortune-stick/draw";
import { getLotByNumber } from "@/lib/fortune-stick/lots";
import type {
  CreatePurchaseResult,
  FortuneStickDraw,
} from "@/lib/fortune-stick/types";

const DATA_FILE = path.join(process.cwd(), "data", "fortune-stick-draws.json");

interface JsonStore {
  draws: FortuneStickDraw[];
}

const EMPTY_JSON_STORE: JsonStore = { draws: [] };

function hasPostgres(): boolean {
  return Boolean(process.env.POSTGRES_URL?.trim());
}

function rowToDraw(row: {
  id: string;
  question: string;
  lot_number: number;
  created_at: string | Date;
  stripe_session_id: string | null;
  paid_at: string | Date | null;
  interpretation_text: string | null;
  interpretation_provider: string | null;
}): FortuneStickDraw {
  return {
    id: row.id,
    question: row.question,
    lotNumber: row.lot_number,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at),
    stripeSessionId: row.stripe_session_id ?? undefined,
    paidAt: row.paid_at
      ? row.paid_at instanceof Date
        ? row.paid_at.toISOString()
        : String(row.paid_at)
      : undefined,
    interpretationText: row.interpretation_text ?? undefined,
    interpretationProvider: row.interpretation_provider ?? undefined,
  };
}

async function ensureJsonStore(): Promise<JsonStore> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<JsonStore>;
    return { draws: parsed.draws ?? [] };
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
    CREATE TABLE IF NOT EXISTS fortune_stick_draws (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      lot_number INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      stripe_session_id TEXT UNIQUE,
      paid_at TIMESTAMPTZ,
      interpretation_text TEXT,
      interpretation_provider TEXT
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS fortune_stick_draws_session_idx
    ON fortune_stick_draws (stripe_session_id)
  `;
}

export async function getDrawById(id: string): Promise<FortuneStickDraw | null> {
  if (hasPostgres()) {
    await ensurePostgresTables();
    const { rows } = await sql`
      SELECT * FROM fortune_stick_draws WHERE id = ${id} LIMIT 1
    `;
    if (!rows[0]) return null;
    return rowToDraw(rows[0] as Parameters<typeof rowToDraw>[0]);
  }

  const store = await ensureJsonStore();
  return store.draws.find((d) => d.id === id) ?? null;
}

export async function getDrawByStripeSessionId(
  sessionId: string,
): Promise<FortuneStickDraw | null> {
  if (hasPostgres()) {
    await ensurePostgresTables();
    const { rows } = await sql`
      SELECT * FROM fortune_stick_draws
      WHERE stripe_session_id = ${sessionId}
      LIMIT 1
    `;
    if (!rows[0]) return null;
    return rowToDraw(rows[0] as Parameters<typeof rowToDraw>[0]);
  }

  const store = await ensureJsonStore();
  return store.draws.find((d) => d.stripeSessionId === sessionId) ?? null;
}

export async function saveDraw(draw: FortuneStickDraw): Promise<void> {
  if (hasPostgres()) {
    await ensurePostgresTables();
    await sql`
      INSERT INTO fortune_stick_draws (
        id, question, lot_number, created_at,
        stripe_session_id, paid_at, interpretation_text, interpretation_provider
      ) VALUES (
        ${draw.id},
        ${draw.question},
        ${draw.lotNumber},
        ${draw.createdAt}::timestamptz,
        ${draw.stripeSessionId ?? null},
        ${draw.paidAt ?? null}::timestamptz,
        ${draw.interpretationText ?? null},
        ${draw.interpretationProvider ?? null}
      )
      ON CONFLICT (id) DO UPDATE SET
        stripe_session_id = COALESCE(EXCLUDED.stripe_session_id, fortune_stick_draws.stripe_session_id),
        paid_at = COALESCE(EXCLUDED.paid_at, fortune_stick_draws.paid_at),
        interpretation_text = COALESCE(EXCLUDED.interpretation_text, fortune_stick_draws.interpretation_text),
        interpretation_provider = COALESCE(EXCLUDED.interpretation_provider, fortune_stick_draws.interpretation_provider)
    `;
    return;
  }

  const store = await ensureJsonStore();
  const index = store.draws.findIndex((d) => d.id === draw.id);
  if (index >= 0) {
    store.draws[index] = { ...store.draws[index], ...draw };
  } else {
    store.draws.push(draw);
  }
  await writeJsonStore(store);
}

export async function upsertDrawFromQuestion(
  drawId: string,
  question: string,
): Promise<FortuneStickDraw> {
  const existing = await getDrawById(drawId);
  if (existing) {
    const expected = drawLotNumber(question, drawId);
    if (existing.lotNumber !== expected) {
      throw new Error("draw_mismatch");
    }
    return existing;
  }

  const lotNumber = drawLotNumber(question, drawId);
  const draw: FortuneStickDraw = {
    id: drawId,
    question: question.trim(),
    lotNumber,
    createdAt: new Date().toISOString(),
  };
  await saveDraw(draw);
  return draw;
}

export async function linkStripeSession(
  drawId: string,
  stripeSessionId: string,
): Promise<void> {
  const draw = await getDrawById(drawId);
  if (!draw) throw new Error("draw_not_found");
  await saveDraw({ ...draw, stripeSessionId });
}

export async function markPaidAndSaveInterpretation(
  drawId: string,
  interpretationText: string,
  provider: string,
): Promise<FortuneStickDraw> {
  const draw = await getDrawById(drawId);
  if (!draw) throw new Error("draw_not_found");

  const updated: FortuneStickDraw = {
    ...draw,
    paidAt: draw.paidAt ?? new Date().toISOString(),
    interpretationText,
    interpretationProvider: provider,
  };
  await saveDraw(updated);
  return updated;
}

export async function createPurchaseFromSession(
  session: Stripe.Checkout.Session,
): Promise<CreatePurchaseResult> {
  const drawId = session.metadata?.drawId?.trim();
  if (!drawId) {
    return { ok: false, error: "missing_draw_id" };
  }

  const existing = await getDrawByStripeSessionId(session.id);
  if (existing) {
    return { ok: true, draw: existing };
  }

  const draw = await getDrawById(drawId);
  if (!draw) {
    return { ok: false, error: "draw_not_found" };
  }

  const lot = getLotByNumber(draw.lotNumber);
  if (!lot) {
    return { ok: false, error: "invalid_lot" };
  }

  const updated: FortuneStickDraw = {
    ...draw,
    stripeSessionId: session.id,
    paidAt: new Date().toISOString(),
  };
  await saveDraw(updated);
  return { ok: true, draw: updated };
}
