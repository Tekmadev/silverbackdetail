import Script from "next/script";
import { cn } from "@/lib/utils";

/**
 * GoHighLevel inline form embed.
 *
 * Two pieces are required. The iframe renders the form, and form_embed.js
 * listens for postMessage from inside it and resizes the frame to fit its
 * content as fields expand or validation errors appear.
 *
 * GHL's copy-paste snippet sets `height:100%`, which collapses to nothing
 * inside a parent that has no fixed height. We set `minHeight` to the form's
 * designed height instead, so the form is usable during the moment before the
 * script runs, and still usable if the script never loads at all.
 *
 * No "use client" needed: next/script only requires a client boundary for the
 * onLoad / onReady / onError callbacks, which this does not use.
 */
export function GhlFormEmbed({
  formId,
  formName,
  origin,
  height,
  className,
}: {
  formId: string;
  formName: string;
  origin: string;
  height: number;
  className?: string;
}) {
  const embedId = `inline-${formId}`;

  return (
    <div className={cn("w-full", className)}>
      <iframe
        src={`${origin}/widget/form/${formId}`}
        id={embedId}
        title={formName}
        style={{ width: "100%", minHeight: height, border: "none", borderRadius: 4 }}
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name={formName}
        data-height={height}
        data-layout-iframe-id={embedId}
        data-form-id={formId}
      />
      {/*
        afterInteractive (the default) rather than lazyOnload: this form is the
        conversion point of the page, so the resize behaviour should be live as
        soon as the page is interactive, not deferred to browser idle.
      */}
      <Script src={`${origin}/js/form_embed.js`} strategy="afterInteractive" />
    </div>
  );
}
