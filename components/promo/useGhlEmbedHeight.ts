"use client";

import * as React from "react";

/**
 * Sizes a GoHighLevel widget iframe to its own content.
 *
 * GHL's copy-paste snippets load link.msgsndr.com/js/form_embed.js to do this.
 * Two measured problems with that script, which is why this exists instead:
 *
 * 1. It posts the resizer handshake before the frame has its final width, so
 *    the first height reported is taken at a nearly-zero width. Observed on the
 *    promo form: `10755:103`, a 10,755px height measured at 103px wide, against
 *    a frame that was actually 1280px wide and 638px tall. The script applies
 *    every reading it gets, so the frame briefly becomes a 10,000px hole.
 * 2. It sets the iframe to visibility:hidden, opacity:0, position:absolute and
 *    only reveals it later. In a clean test that reveal never fired.
 *
 * The widget documents themselves are fine. Each runs iframe-resizer 4.1.1 as a
 * child and reports its height accurately, but only once a parent completes the
 * handshake. So we do the handshake ourselves, after load, when the frame
 * already has its real width, and the first reading is correct.
 *
 * Every reading is then checked against the frame's current width before it is
 * applied, which is what makes the bogus reading above impossible rather than
 * merely unlikely: a height measured at 103px in a 526px frame is rejected on
 * the mismatch, not on a magic threshold.
 */

const MESSAGE_PREFIX = "[iFrameSizer]";

/**
 * iframe-resizer v3-format init string, matching the field order GHL's own
 * parent script sends, since that is what these widgets answer:
 * id:bodyMarginV1:sizeWidth:log:interval:enablePublicMethods:autoResize:
 * bodyMargin:heightCalculationMethod:bodyBackground:bodyPadding:tolerance
 *
 * "offset" means the child reports document.body.offsetHeight.
 */
const handshakeFor = (embedId: string) =>
  `${MESSAGE_PREFIX}${embedId}:8:false:false:32:true:true::offset:null:null:0`;

/**
 * Asks an already-initialised widget to measure itself again and report. A
 * second handshake will not do this: the child ignores `init` once it has run
 * one, so without this a resized frame keeps the height it was given for its
 * old width.
 */
const RESIZE_REQUEST = `${MESSAGE_PREFIX}resize`;

/** Readings can be a fraction out from the frame's own width. */
const WIDTH_TOLERANCE = 2;

export function useGhlEmbedHeight({
  embedId,
  origin,
  minHeight = 300,
  maxHeight = 2400,
}: {
  embedId: string;
  origin: string;
  /** Bounds on anything the embedded document asks for. It is third-party. */
  minHeight?: number;
  maxHeight?: number;
}) {
  const frameRef = React.useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = React.useState<number | null>(null);

  React.useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    let retry: ReturnType<typeof setInterval> | undefined;
    const stopRetrying = () => {
      if (retry !== undefined) {
        clearInterval(retry);
        retry = undefined;
      }
    };

    const shakeHands = () => {
      // Silently does nothing until the widget document is the one loaded,
      // which is why this is retried rather than fired once on load.
      frame.contentWindow?.postMessage(handshakeFor(embedId), origin);
    };

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== origin || event.source !== frame.contentWindow) return;
      if (typeof event.data !== "string" || !event.data.startsWith(MESSAGE_PREFIX)) return;

      const [id, rawHeight, rawWidth] = event.data.slice(MESSAGE_PREFIX.length).split(":");
      if (id !== embedId) return;

      const reportedHeight = Number(rawHeight);
      const reportedWidth = Number(rawWidth);
      if (!Number.isFinite(reportedHeight) || !Number.isFinite(reportedWidth)) return;

      // The reading only means anything if it was taken at the width the frame
      // is actually rendering at. This is the guard against the bogus
      // measured-at-103px reading described above.
      if (Math.abs(reportedWidth - frame.offsetWidth) > WIDTH_TOLERANCE) return;
      if (reportedHeight < minHeight || reportedHeight > maxHeight) return;

      stopRetrying();
      setHeight(reportedHeight);
    };

    window.addEventListener("message", onMessage);
    frame.addEventListener("load", shakeHands);
    // The frame may already have loaded before this effect ran, and the child
    // script is loaded async, so neither side's readiness can be assumed.
    shakeHands();
    retry = setInterval(shakeHands, 500);
    const giveUp = setTimeout(stopRetrying, 15000);

    // Content height depends on width, so a new width needs a new reading. The
    // widget only watches its own markup for changes and a reflow changes none,
    // so a rotated phone would otherwise keep its portrait height. Width only:
    // applying a height resizes the frame, and reacting to that would loop.
    let lastWidth = frame.offsetWidth;
    const observer = new ResizeObserver(() => {
      if (frame.offsetWidth === lastWidth) return;
      lastWidth = frame.offsetWidth;
      frame.contentWindow?.postMessage(RESIZE_REQUEST, origin);
    });
    observer.observe(frame);

    return () => {
      window.removeEventListener("message", onMessage);
      frame.removeEventListener("load", shakeHands);
      observer.disconnect();
      stopRetrying();
      clearTimeout(giveUp);
    };
  }, [embedId, origin, minHeight, maxHeight]);

  return { frameRef, height };
}
