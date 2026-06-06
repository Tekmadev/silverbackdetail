import type { BookingInput } from "@/lib/booking/schema";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "refunded";

export type BookingRecord = BookingInput & {
  id: string;
  status: BookingStatus;
  createdAt: string;
  serviceName: string;
  priceFrom: number;
  currency: string;
  requiresDeposit: boolean;
  depositAmount: number;
  depositPaid: boolean;
  stripeSessionId?: string | null;
};

export type CreateBookingResult = {
  ok: boolean;
  id?: string;
  requiresDeposit?: boolean;
  /** Present when a Stripe Checkout session was created (live mode). */
  checkoutUrl?: string;
  /** Confirmation URL to navigate to when no payment step is needed. */
  confirmationUrl?: string;
  error?: string;
};
