import { Phone, MessageSquare, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Call, text, and email as native handoffs.
 *
 * This is the single most used control in the dashboard, because the job it
 * supports is "I am standing in the shop and I need to reach this person now".
 * `tel:` and `sms:` hand straight off to the phone's own dialer and messages
 * app, so there is no number to memorise, read aloud, or mistype.
 *
 * Targets are 44px minimum per the design system, and spaced, because the
 * person tapping them is often wearing gloves.
 */
export function ContactActions({
  phone,
  email,
  name,
  className,
  size = "default",
}: {
  phone?: string;
  email?: string;
  name?: string;
  className?: string;
  size?: "default" | "compact";
}) {
  const telHref = phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null;
  const smsHref = phone ? `sms:${phone.replace(/[^\d+]/g, "")}` : null;
  const mailHref = email
    ? `mailto:${email}?subject=${encodeURIComponent("Silverback Detailing")}`
    : null;

  if (!telHref && !mailHref) return null;

  const base = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-ink-3 font-medium text-bone transition-colors hover:border-line-strong active:bg-ink-2",
    size === "compact" ? "min-h-11 px-3 text-xs" : "min-h-11 flex-1 px-4 text-sm",
  );

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {telHref && (
        <a href={telHref} className={base} aria-label={name ? `Call ${name}` : "Call"}>
          <Phone className="size-4" strokeWidth={1.75} />
          Call
        </a>
      )}
      {smsHref && (
        <a href={smsHref} className={base} aria-label={name ? `Text ${name}` : "Text"}>
          <MessageSquare className="size-4" strokeWidth={1.75} />
          Text
        </a>
      )}
      {mailHref && (
        <a href={mailHref} className={base} aria-label={name ? `Email ${name}` : "Email"}>
          <Mail className="size-4" strokeWidth={1.75} />
          Email
        </a>
      )}
    </div>
  );
}
