"use server";

import { bookingSchema, type BookingInput } from "@/lib/booking/schema";
import { contactSchema, type ContactInput } from "@/lib/booking/schema";
import { isSlotAvailable } from "@/lib/booking/availability";
import { generateBookingId, encodeBooking, decodeBooking } from "@/lib/booking/token";
import type { BookingRecord, CreateBookingResult } from "@/lib/booking/types";
import { getServiceBySlug, absoluteUrl } from "@/lib/config/site";
import { saveBooking, getBookingById, updateBooking } from "@/lib/storage/bookings";
import { sendBookingEmails, sendRefundEmail, sendContactEmail } from "@/lib/email/send";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";

/** Create a booking. Orchestrates persistence, email, and (if needed) Stripe. */
export async function createBooking(input: BookingInput): Promise<CreateBookingResult> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }
  const data = parsed.data;

  // Honeypot
  if (data.company) return { ok: false, error: "Submission rejected." };

  if (!isSlotAvailable(data.date, data.time)) {
    return { ok: false, error: "That time is no longer available. Please pick another slot." };
  }

  const service = getServiceBySlug(data.serviceSlug);
  if (!service) return { ok: false, error: "Unknown service." };

  const id = generateBookingId();
  const record: BookingRecord = {
    ...data,
    id,
    status: "pending",
    createdAt: new Date().toISOString(),
    serviceName: service.name,
    priceFrom: service.priceFrom,
    currency: service.currency,
    requiresDeposit: service.requiresDeposit,
    depositAmount: service.depositAmount,
    depositPaid: false,
    stripeSessionId: null,
  };

  await saveBooking(record);
  const emailed = await sendBookingEmails(record);
  // When the customer confirmation didn't actually send, tell the confirmation
  // page so it doesn't promise an email that never arrived.
  const emailedFlag = emailed.customer ? "" : "&emailed=0";

  const token = encodeBooking(record);

  // Deposit service with Stripe configured → hosted Checkout.
  if (record.requiresDeposit && isStripeConfigured()) {
    const stripe = getStripe();
    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          customer_email: record.customer.email,
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency: record.currency.toLowerCase(),
                unit_amount: record.depositAmount * 100,
                product_data: {
                  name: `Refundable deposit — ${record.serviceName}`,
                  description: `Booking ${record.id}. Credited toward your final invoice.`,
                },
              },
            },
          ],
          metadata: { bookingId: record.id },
          payment_intent_data: { metadata: { bookingId: record.id } },
          success_url: absoluteUrl(`/booking/${record.id}/confirmation?t=${token}&paid=1${emailedFlag}`),
          cancel_url: absoluteUrl(`/book?service=${record.serviceSlug}&step=review`),
        });
        if (session.url) {
          await updateBooking(record.id, { stripeSessionId: session.id });
          return { ok: true, id: record.id, requiresDeposit: true, checkoutUrl: session.url };
        }
      } catch (err) {
        console.error("[stripe] checkout creation failed:", err);
        // Fall through to demo confirmation so the booking is never lost.
      }
    }
  }

  return {
    ok: true,
    id: record.id,
    requiresDeposit: record.requiresDeposit,
    confirmationUrl: `/booking/${record.id}/confirmation?t=${token}${emailedFlag}`,
  };
}

/** Submit the contact form. */
export async function submitContact(
  input: ContactInput,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please check the form and try again." };
  if (parsed.data.company) return { ok: false, error: "Submission rejected." };
  await sendContactEmail(parsed.data);
  return { ok: true };
}

/**
 * Cancel a booking and refund the deposit when within the policy window.
 * Authorized by possession of the booking token (the confirmation URL).
 */
export async function cancelBooking(
  id: string,
  token: string,
): Promise<{ ok: boolean; refunded: boolean; error?: string }> {
  const fromToken = decodeBooking(token);
  if (!fromToken || fromToken.id !== id) {
    return { ok: false, refunded: false, error: "Invalid cancellation link." };
  }

  // Prefer the persisted record (has the real payment reference) when available.
  const record = (await getBookingById(id)) ?? fromToken;

  // Within refund window? (date must be >= refund window hours away)
  const windowHours = 48;
  const apptMs = new Date(`${record.date}T${record.time}:00`).getTime();
  const withinWindow = apptMs - Date.now() >= windowHours * 60 * 60 * 1000;

  if (!withinWindow) {
    await updateBooking(id, { status: "cancelled" });
    return { ok: true, refunded: false, error: "Cancelled. Past the refund window, so the deposit is not refundable." };
  }

  let refunded = false;
  if (record.requiresDeposit && record.depositPaid && record.stripeSessionId && isStripeConfigured()) {
    const stripe = getStripe();
    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(record.stripeSessionId);
        const pi = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
        if (pi) {
          await stripe.refunds.create({ payment_intent: pi });
          refunded = true;
        }
      } catch (err) {
        console.error("[stripe] refund failed:", err);
      }
    }
  }

  await updateBooking(id, { status: refunded ? "refunded" : "cancelled" });
  if (refunded) await sendRefundEmail(record);

  return { ok: true, refunded };
}
