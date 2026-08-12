"use client";

import { cn } from "@/lib/utils";
import { useGhlEmbedHeight } from "./useGhlEmbedHeight";

/**
 * GoHighLevel inline form embed, sized to its content.
 *
 * The height comes from useGhlEmbedHeight, which documents why GHL's own
 * form_embed.js is not used.
 *
 * Why the height has to be exact rather than generous: the form document paints
 * no background of its own, so everything outside `.form-builder--wrap` is the
 * browser's default white canvas, and it is genuinely opaque. color-scheme:dark
 * on the frame and allowtransparency were both tried and leave it white. So a
 * frame taller than its content shows a white block, and a frame shorter than
 * its content scrolls internally and hides the submit button. The content
 * height is also a step function of width, 1139px at 238px wide against 718px
 * at 526px, because the two consent paragraphs rewrap, so it cannot be pinned
 * with a handful of breakpoints either.
 */

/**
 * Pre-JS floor, not a prediction. The form reports 912px at 526px wide when
 * embedded cross-origin, and over 1100px on a narrow phone, so this is
 * deliberately short of every real case: the live sizing takes over within a
 * moment of load, and until it does an internal scrollbar is the cheaper
 * failure. Raising it toward the real height would trade that scrollbar for a
 * block of white canvas whenever the form comes in shorter, which is the one
 * outcome there is no recovering from.
 *
 * Do not treat this as the form's height. Nothing reads it after the first
 * measurement lands, and it needs no updating when the form changes in GHL.
 */
const FALLBACK_HEIGHT = "h-[718px]";

export function GhlFormEmbed({
  formId,
  formName,
  origin,
  maxWidth,
  className,
}: {
  formId: string;
  formName: string;
  origin: string;
  maxWidth: number;
  className?: string;
}) {
  const embedId = `inline-${formId}`;
  const { frameRef, height } = useGhlEmbedHeight({ embedId, origin, maxHeight: 2000 });

  return (
    // The form draws a 1px white border and an 8px radius on its wrapper, both
    // set in the GHL builder and both unreachable from here because the
    // document is cross-origin. The frame is inset by 1px on every side inside
    // this clip instead, which trims the border off and takes the white canvas
    // in the rounded corners with it. If that border is later set to something
    // dark in GHL, this trims 1px of the form's own padding and nothing looks
    // different.
    <div className={cn("mx-auto overflow-hidden rounded-[7px]", className)} style={{ maxWidth }}>
      <iframe
        ref={frameRef}
        src={`${origin}/widget/form/${formId}`}
        id={embedId}
        title={formName}
        className={cn("-m-px block w-[calc(100%_+_2px)] border-none", FALLBACK_HEIGHT)}
        style={height ? { height } : undefined}
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
