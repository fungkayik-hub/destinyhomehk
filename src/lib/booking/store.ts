import { sql } from "@vercel/postgres";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { BookingRecord, CreateBookingInput } from "@/lib/booking/types";
import { BOOKING_CONFIG } from "@/lib/booking/config";

const DATA_FILE = path.join(process.cwd(), "data", "bookings.json");

function hasPostgres(): boolean {
  return Boolean(process.env.POSTGRES_URL?.trim());
}

async function ensureJsonStore(): Promise<BookingRecord[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as BookingRecord[];
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
    return [];
  }
}

async function writeJsonStore(bookings: BookingRecord[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(bookings, null, 2), "utf-8");
}

async function ensurePostgresTable(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      service_id TEXT NOT NULL,
      service_title TEXT NOT NULL,
      booking_date DATE NOT NULL,
      booking_time TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (booking_date, booking_time)
    )
  `;
  await sql`
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_email TEXT
  `;
  await sql`
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status TEXT
  `;
  await sql`
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS stripe_session_id TEXT
  `;
  await sql`
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS amount_paid_cents INTEGER
  `;
  await sql`
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS currency TEXT
  `;
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS bookings_stripe_session_id_idx
    ON bookings (stripe_session_id)
    WHERE stripe_session_id IS NOT NULL
  `;
}

function rowToBooking(row: {
  id: string;
  service_id: string;
  service_title: string;
  booking_date: string | Date;
  booking_time: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  created_at: string | Date;
  payment_status: string | null;
  stripe_session_id: string | null;
  amount_paid_cents: number | null;
  currency: string | null;
}): BookingRecord {
  const bookingDate =
    row.booking_date instanceof Date
      ? row.booking_date.toISOString().slice(0, 10)
      : String(row.booking_date).slice(0, 10);

  return {
    id: row.id,
    serviceId: row.service_id,
    serviceTitle: row.service_title,
    bookingDate,
    bookingTime: row.booking_time as BookingRecord["bookingTime"],
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email ?? undefined,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at),
    paymentStatus: (row.payment_status as BookingRecord["paymentStatus"]) ?? undefined,
    stripeSessionId: row.stripe_session_id ?? undefined,
    amountPaidCents: row.amount_paid_cents ?? undefined,
    currency: row.currency ?? undefined,
  };
}

export async function getBookedTimesForDate(date: string): Promise<string[]> {
  if (hasPostgres()) {
    await ensurePostgresTable();
    const { rows } = await sql<{ booking_time: string }>`
      SELECT booking_time FROM bookings WHERE booking_date = ${date}::date
    `;
    return rows.map((r) => r.booking_time);
  }

  const bookings = await ensureJsonStore();
  return bookings
    .filter((b) => b.bookingDate === date)
    .map((b) => b.bookingTime);
}

export async function getBookingCountForDate(date: string): Promise<number> {
  if (hasPostgres()) {
    await ensurePostgresTable();
    const { rows } = await sql<{ count: string }>`
      SELECT COUNT(*)::text AS count FROM bookings WHERE booking_date = ${date}::date
    `;
    return Number(rows[0]?.count ?? 0);
  }

  const bookings = await ensureJsonStore();
  return bookings.filter((b) => b.bookingDate === date).length;
}

export async function getBookingByStripeSessionId(
  sessionId: string,
): Promise<BookingRecord | null> {
  if (hasPostgres()) {
    await ensurePostgresTable();
    const { rows } = await sql`
      SELECT * FROM bookings WHERE stripe_session_id = ${sessionId} LIMIT 1
    `;
    if (!rows[0]) return null;
    return rowToBooking(rows[0] as Parameters<typeof rowToBooking>[0]);
  }

  const bookings = await ensureJsonStore();
  return bookings.find((b) => b.stripeSessionId === sessionId) ?? null;
}

export type CreateBookingResult =
  | { ok: true; booking: BookingRecord }
  | { ok: false; error: "slot_taken" | "day_full" | "storage_error" | "duplicate_payment" };

export async function createBooking(
  input: CreateBookingInput,
): Promise<CreateBookingResult> {
  if (input.stripeSessionId) {
    const existing = await getBookingByStripeSessionId(input.stripeSessionId);
    if (existing) {
      return { ok: true, booking: existing };
    }
  }

  const dayCount = await getBookingCountForDate(input.bookingDate);
  if (dayCount >= BOOKING_CONFIG.maxPerDay) {
    return { ok: false, error: "day_full" };
  }

  const booked = await getBookedTimesForDate(input.bookingDate);
  if (booked.includes(input.bookingTime)) {
    return { ok: false, error: "slot_taken" };
  }

  const booking: BookingRecord = {
    id: randomUUID(),
    serviceId: input.serviceId,
    serviceTitle: input.serviceTitle,
    bookingDate: input.bookingDate,
    bookingTime: input.bookingTime,
    customerName: input.customerName.trim(),
    customerPhone: input.customerPhone.trim(),
    customerEmail: input.customerEmail?.trim() || undefined,
    createdAt: new Date().toISOString(),
    paymentStatus: input.paymentStatus,
    stripeSessionId: input.stripeSessionId,
    amountPaidCents: input.amountPaidCents,
    currency: input.currency,
  };

  if (hasPostgres()) {
    try {
      await ensurePostgresTable();
      await sql`
        INSERT INTO bookings (
          id, service_id, service_title, booking_date, booking_time,
          customer_name, customer_phone, customer_email, created_at,
          payment_status, stripe_session_id, amount_paid_cents, currency
        ) VALUES (
          ${booking.id},
          ${booking.serviceId},
          ${booking.serviceTitle},
          ${booking.bookingDate}::date,
          ${booking.bookingTime},
          ${booking.customerName},
          ${booking.customerPhone},
          ${booking.customerEmail ?? null},
          ${booking.createdAt}::timestamptz,
          ${booking.paymentStatus ?? null},
          ${booking.stripeSessionId ?? null},
          ${booking.amountPaidCents ?? null},
          ${booking.currency ?? null}
        )
      `;
      return { ok: true, booking };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("bookings_stripe_session_id_idx") || message.includes("stripe_session_id")) {
        const existing = input.stripeSessionId
          ? await getBookingByStripeSessionId(input.stripeSessionId)
          : null;
        if (existing) return { ok: true, booking: existing };
        return { ok: false, error: "duplicate_payment" };
      }
      if (message.includes("unique") || message.includes("duplicate")) {
        return { ok: false, error: "slot_taken" };
      }
      console.error("Postgres booking insert failed:", err);
      return { ok: false, error: "storage_error" };
    }
  }

  try {
    const bookings = await ensureJsonStore();
    if (input.stripeSessionId && bookings.some((b) => b.stripeSessionId === input.stripeSessionId)) {
      const existing = bookings.find((b) => b.stripeSessionId === input.stripeSessionId)!;
      return { ok: true, booking: existing };
    }
    if (bookings.some((b) => b.bookingDate === booking.bookingDate && b.bookingTime === booking.bookingTime)) {
      return { ok: false, error: "slot_taken" };
    }
    if (bookings.filter((b) => b.bookingDate === booking.bookingDate).length >= BOOKING_CONFIG.maxPerDay) {
      return { ok: false, error: "day_full" };
    }
    bookings.push(booking);
    await writeJsonStore(bookings);
    return { ok: true, booking };
  } catch (err) {
    console.error("JSON booking store failed:", err);
    return { ok: false, error: "storage_error" };
  }
}
