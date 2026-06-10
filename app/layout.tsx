import type { Metadata, Viewport } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { businessConfig } from "@/lib/config/business";
import { absoluteUrl } from "@/lib/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteLoader } from "@/components/SiteLoader";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const { seo, name, legalName, contact, social } = businessConfig;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || seo.siteUrl),
  title: {
    default: seo.defaultTitle,
    template: seo.titleTemplate,
  },
  description: seo.defaultDescription,
  keywords: [...seo.keywords],
  applicationName: name,
  authors: [{ name: legalName }],
  creator: legalName,
  publisher: legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: seo.locale,
    url: seo.siteUrl,
    siteName: name,
    title: seo.defaultTitle,
    description: seo.defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.defaultTitle,
    description: seo.defaultDescription,
    creator: seo.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "Automotive",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Organization + WebSite schema, present site-wide for SEO + GEO.
  const orgSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": absoluteUrl("/#organization"),
        name,
        legalName,
        url: seo.siteUrl,
        email: contact.email,
        telephone: contact.phone,
        sameAs: [social.instagram.url, social.facebook.url, social.tiktok.url, social.google.url],
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: seo.siteUrl,
        name,
        publisher: { "@id": absoluteUrl("/#organization") },
        inLanguage: "en-CA",
      },
    ],
  };

  return (
    <html lang="en-CA" className={`${fraunces.variable} ${interTight.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh bg-ink text-bone">
        {/*
          Site loader — static HTML painted before React hydrates.
          Inline styles are intentional: they must not depend on any stylesheet
          that might load after the HTML. The SiteLoader client component below
          drives the animated exit once window.load fires.
        */}
        <div
          id="sb-loader"
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "#0a0a0b",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          {/* Wordmark */}
          <div
            style={{
              textAlign: "center",
              animation: "sb-loader-wordmark 0.7s cubic-bezier(0.16,1,0.3,1) both",
              animationDelay: "0.1s",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-fraunces, Georgia, serif)",
                fontSize: "clamp(1.8rem, 5vw, 2.75rem)",
                fontWeight: 600,
                color: "#f5f1ec",
                letterSpacing: "-0.04em",
                margin: 0,
                lineHeight: 1,
              }}
            >
              Silverback
            </p>
            <p
              style={{
                fontFamily: "var(--font-inter-tight, system-ui, sans-serif)",
                fontSize: "0.7rem",
                color: "rgba(245,241,236,0.35)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                margin: "0.6rem 0 0",
              }}
            >
              Detail beyond the surface.
            </p>
          </div>

          {/* Progress track */}
          <div
            style={{
              width: "100px",
              height: "1px",
              backgroundColor: "rgba(245,241,236,0.12)",
              borderRadius: "1px",
              overflow: "hidden",
            }}
          >
            <div
              id="sb-loader-bar"
              style={{
                height: "100%",
                width: "0%",
                backgroundColor: "#d11a2a",
                borderRadius: "1px",
                animation: "sb-loader-fill 1.6s cubic-bezier(0.16,1,0.3,1) forwards",
                animationDelay: "0.15s",
              }}
            />
          </div>
        </div>

        <SiteLoader />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-bone"
        >
          Skip to content
        </a>
        <JsonLd id="org-schema" data={orgSchema} />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
