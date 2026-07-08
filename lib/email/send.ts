import "server-only";
import { Resend, type CreateEmailResponse } from "resend";
import { businessConfig } from "@/lib/config/business";
import type { BookingRecord } from "@/lib/booking/types";
import type { ContactInput } from "@/lib/booking/schema";
import { BookingConfirmation } from "@/lib/email/templates/BookingConfirmation";
import { OwnerNotification } from "@/lib/email/templates/OwnerNotification";
import { RefundConfirmation } from "@/lib/email/templates/RefundConfirmation";

let cached: Resend | null | undefined;

function getResend(): Resend | null {
  if (cached !== undefined) return cached;
  const key = process.env.RESEND_API_KEY;
  cached = key ? new Resend(key) : null;
  return cached;
}

// Resend only sends from a domain you have verified in your Resend account. Free
// inbox providers (gmail.com, outlook.com, …) can never be verified, so every send
// from such an address is rejected with a 403. Detect it and log loudly, because
// the failure is otherwise invisible (see `succeeded` below).
const FREE_MAIL =
  /@(gmail|googlemail|outlook|hotmail|live|msn|yahoo|ymail|icloud|me|mac|aol|proton|protonmail|gmx|zoho)\./i;

const FROM =
  process.env.EMAIL_FROM || `${businessConfig.name} <book@silverbackdetail.com>`;

function fromIsUnsendable(): boolean {
  if (FREE_MAIL.test(FROM)) {
    console.error(
      `[email] EMAIL_FROM (${FROM}) uses a free-mail domain — Resend will REJECT every send ` +
        `because that domain cannot be verified. Set EMAIL_FROM to an address on a domain you have ` +
        `verified at https://resend.com/domains (e.g. book@silverbackdetail.com).`,
    );
    return true;
  }
  return false;
}

/**
 * The Resend SDK resolves with an { data, error } envelope — it does NOT throw on
 * API errors (unverified domain, invalid recipient, rate limit). Callers that only
 * `await` the promise therefore never learn a send failed. This inspects the
 * envelope, logs the real reason, and returns whether it actually sent.
 */
function succeeded(label: string, res: CreateEmailResponse): boolean {
  if (res.error) {
    console.error(`[email] ${label} was rejected by Resend: ${res.error.name} — ${res.error.message}`);
    return false;
  }
  return true;
}

/**
 * Sends the customer confirmation + owner notification. Never throws.
 * Returns which messages Resend actually accepted so the caller can be honest
 * with the customer (and so a silent all-failed send can't masquerade as success).
 */
export async function sendBookingEmails(
  record: BookingRecord,
): Promise<{ customer: boolean; owner: boolean }> {
  const resend = getResend();
  if (!resend) {
    console.info(
      `[email:dev] Booking ${record.id} (${record.serviceName}) for ${record.customer.email}. ` +
        `Set RESEND_API_KEY to send real emails.`,
    );
    return { customer: false, owner: false };
  }
  if (fromIsUnsendable()) return { customer: false, owner: false };
  try {
    const [customer, owner] = await Promise.all([
      resend.emails.send({
        from: FROM,
        to: record.customer.email,
        subject: `Booking confirmed — ${record.serviceName} (${record.id})`,
        react: BookingConfirmation({ record }),
      }),
      resend.emails.send({
        from: FROM,
        to: businessConfig.contact.bookingEmail,
        subject: `New booking · ${record.id} · ${record.serviceName}`,
        react: OwnerNotification({ record }),
      }),
    ]);
    return {
      customer: succeeded("customer confirmation", customer),
      owner: succeeded("owner notification", owner),
    };
  } catch (err) {
    console.error("[email] Failed to send booking emails:", err);
    return { customer: false, owner: false };
  }
}

export async function sendRefundEmail(record: BookingRecord): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.info(`[email:dev] Refund for booking ${record.id} → ${record.customer.email}`);
    return false;
  }
  if (fromIsUnsendable()) return false;
  try {
    const res = await resend.emails.send({
      from: FROM,
      to: record.customer.email,
      subject: `Deposit refunded — ${record.id}`,
      react: RefundConfirmation({ record }),
    });
    return succeeded("refund confirmation", res);
  } catch (err) {
    console.error("[email] Failed to send refund email:", err);
    return false;
  }
}

export async function sendContactEmail(input: ContactInput): Promise<boolean> {
  const resend = getResend();
  const summary = `Contact from ${input.name} <${input.email}>${input.phone ? ` (${input.phone})` : ""}${
    input.service ? ` about ${input.service}` : ""
  }: ${input.message}`;
  if (!resend) {
    console.info(`[email:dev] ${summary}`);
    return false;
  }
  if (fromIsUnsendable()) return false;
  try {
    const res = await resend.emails.send({
      from: FROM,
      to: businessConfig.contact.email,
      replyTo: input.email,
      subject: `Website enquiry from ${input.name}`,
      text: summary,
    });
    return succeeded("contact enquiry", res);
  } catch (err) {
    console.error("[email] Failed to send contact email:", err);
    return false;
  }
}
