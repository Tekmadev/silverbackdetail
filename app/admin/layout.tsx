import type { Metadata, Viewport } from "next";

/**
 * Root of the admin area.
 *
 * Deliberately outside the (marketing) group, so it inherits none of the public
 * chrome: no header, no footer, no promo banner, and no Lenis smooth scrolling.
 * Lenis in particular is wrong here. It hijacks the scroll wheel for a slow
 * eased glide that reads as luxury on a landing page and as lag on a screen
 * someone is scanning for a phone number between jobs.
 */
export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Silverback Admin" },
  // Customer names, phone numbers, and home addresses live behind here. Even
  // gated, it must never appear in an index or a search cache.
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // The dashboard is used one-handed in a workshop. Letting the browser paint
  // the notch and home-indicator areas in the app's own black stops the phone
  // framing it in white.
  viewportFit: "cover",
  themeColor: "#0a0a0b",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-ink">{children}</div>;
}
