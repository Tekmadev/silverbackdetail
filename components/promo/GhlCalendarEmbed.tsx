"use client";

import { cn } from "@/lib/utils";
import { useGhlEmbedHeight } from "./useGhlEmbedHeight";

/**
 * GoHighLevel booking calendar embed, sized to its content.
 *
 * Height comes from useGhlEmbedHeight, the same handshake the form embed uses.
 * It matters more here than it does there: the widget grows as someone picks a
 * date and then a time, so no fixed height can be right for the whole flow.
 *
 * Unlike the form, this widget paints nothing of its own. Its document and
 * every wrapper inside it are transparent, so what shows through is the
 * browser's opaque white canvas, and the calendar is a light-themed white panel
 * with blue accents regardless. There is no dark variant to reach for: the
 * document is cross-origin, so its styling can only be changed in GHL's
 * calendar settings. Rather than fight it, the frame is presented as a
 * deliberate white card, which reads as intentional against the dark page in a
 * way that a stray white rectangle does not.
 */

/**
 * Pre-JS height. 772px is the measured content height of the date-and-time step
 * at 526px wide. The later steps are taller, which is what the live sizing is
 * for. Too short scrolls internally, which is recoverable; too tall shows white
 * canvas, which is not, so this leans short on purpose.
 */
const FALLBACK_HEIGHT = "h-[772px]";

export function GhlCalendarEmbed({
  calendarId,
  calendarName,
  origin,
  className,
}: {
  calendarId: string;
  calendarName: string;
  origin: string;
  className?: string;
}) {
  const embedId = `booking-${calendarId}`;
  // The booking form step runs taller than the form embed's ceiling.
  const { frameRef, height } = useGhlEmbedHeight({ embedId, origin, maxHeight: 2400 });

  return (
    <div className={cn("overflow-hidden rounded-xl bg-white", className)}>
      <iframe
        ref={frameRef}
        src={`${origin}/widget/booking/${calendarId}`}
        id={embedId}
        title={calendarName}
        allow="payment"
        scrolling="no"
        className={cn("block w-full border-none", FALLBACK_HEIGHT)}
        style={height ? { height } : undefined}
      />
    </div>
  );
}
