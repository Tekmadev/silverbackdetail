import { cn } from "@/lib/utils";

/**
 * GoHighLevel inline form embed.
 *
 * Two deliberate departures from GHL's copy-paste snippet, both measured
 * against this specific form:
 *
 * 1. No form_embed.js resizer. It reported a content height of 10520px for a
 *    form document that is 576px tall, leaving roughly 9900px of empty frame
 *    below the fields. The frame is sized by hand instead.
 *
 * 2. The frame is capped at the form's own max-width rather than filling its
 *    container. The form document paints no background, so any width beyond
 *    that renders as the browser's default white canvas in gutters either side.
 *
 * Measured document heights, since sizing by hand means the numbers have to be
 * real. The consent paragraphs wrap heavily as the frame narrows:
 *
 *   frame width   document height
 *   263px         916px            (320px viewport)
 *   293px         856px            (375px viewport)
 *   528px         596px            (640px viewport and up)
 *
 * Hence 940px below `sm` and 640px from `sm` up, each with headroom for inline
 * validation errors. Tailwind only emits classes it can see as literals, so
 * these cannot be interpolated from config.
 *
 * If fields are added or removed in GHL, re-measure and update both numbers,
 * and `width` in promos.ts if the form's width setting changes. Too short
 * clips the submit button; too tall returns the empty space this fixes.
 */
const FRAME_HEIGHT = "h-[940px] sm:h-[640px]";

export function GhlFormEmbed({
  formId,
  formName,
  origin,
  width,
  className,
}: {
  formId: string;
  formName: string;
  origin: string;
  width: number;
  className?: string;
}) {
  const embedId = `inline-${formId}`;

  return (
    <div className={cn("w-full", className)}>
      <iframe
        src={`${origin}/widget/form/${formId}`}
        id={embedId}
        title={formName}
        className={cn("block w-full", FRAME_HEIGHT)}
        style={{ maxWidth: width, marginInline: "auto", border: "none", background: "transparent" }}
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name={formName}
        data-layout-iframe-id={embedId}
        data-form-id={formId}
      />
    </div>
  );
}
