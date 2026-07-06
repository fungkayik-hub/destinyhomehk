import type { SlotTime } from "@/lib/booking/config";

export type PaymentStatus = "paid" | "unpaid";

export interface BookingRecord {
  id: string;
  serviceId: string;
  serviceTitle: string;
  bookingDate: string;
  bookingTime: SlotTime;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  createdAt: string;
  paymentStatus?: PaymentStatus;
  stripeSessionId?: string;
  amountPaidCents?: number;
  currency?: string;
}

export interface SlotAvailability {
  time: SlotTime;
  available: boolean;
}

export interface CreateBookingInput {
  serviceId: string;
  serviceTitle: string;
  bookingDate: string;
  bookingTime: SlotTime;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  paymentStatus?: PaymentStatus;
  stripeSessionId?: string;
  amountPaidCents?: number;
  currency?: string;
}
