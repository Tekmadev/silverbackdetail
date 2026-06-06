import type { Metadata, Viewport } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { businessConfig } from "@/lib/config/business";
import { absoluteUrl } from "@/lib/config/site";
import { JsonLd } from "@/components/seo/JsonLd";

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
