import "server-only";
import { Resend } from "resend";
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

const FROM = process.env.EMAIL_FROM || `${businessConfig.name} <${businessConfig.contact.bookingEmail}>`;

/** Sends customer confirmation + owner notification. Never throws. */
export async function sendBookingEmails(record: BookingRecord): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.info(
      `[email:dev] Booking ${record.id} (${record.serviceName}) for ${record.customer.email}. ` +
        `Set RESEND_API_KEY to send real emails.`,
    );
    return;
  }
  try {
    await Promise.all([
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
  } catch (err) {
    console.error("[email] Failed to send booking emails:", err);
  }
}

export async function sendRefundEmail(record: BookingRecord): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.info(`[email:dev] Refund for booking ${record.id} → ${record.customer.email}`);
    return;
  }
  try {
    await resend.emails.send({
      from: FROM,
      to: record.customer.email,
      subject: `Deposit refunded — ${record.id}`,
      react: RefundConfirmation({ record }),
    });
  } catch (err) {
    console.error("[email] Failed to send refund email:", err);
  }
}

export async function sendContactEmail(input: ContactInput): Promise<void> {
  const resend = getResend();
  const summary = `Contact from ${input.name} <${input.email}>${input.phone ? ` (${input.phone})` : ""}${
    input.service ? ` about ${input.service}` : ""
  }: ${input.message}`;
  if (!resend) {
    console.info(`[email:dev] ${summary}`);
    return;
  }
  try {
    await resend.emails.send({
      from: FROM,
      to: businessConfig.contact.email,
      replyTo: input.email,
      subject: `Website enquiry from ${input.name}`,
      text: summary,
    });
  } catch (err) {
    console.error("[email] Failed to send contact email:", err);
  }
}
