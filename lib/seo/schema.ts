/**
 * Reusable schema.org (JSON-LD) builders. All data flows from the business
 * config so structured data and on-page content can never drift apart.
 */

import { businessConfig, type Service } from "@/lib/config/business";
import { absoluteUrl, getOpeningHoursSpecification, formatPrice, getServicePricing } from "@/lib/config/site";
import type { Faq } from "@/lib/data/content";

const { name, legalName, address, contact, seo, serviceAreas } = businessConfig;

export function getLocalBusinessSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ["AutoDetailing", "LocalBusiness"],
    "@id": absoluteUrl("/#business"),
    name,
    legalName,
    description: businessConfig.longDescription,
    url: seo.siteUrl,
    telephone: contact.phone,
    email: contact.email,
    image: absoluteUrl(seo.ogImage),
    priceRange: "$$",
    currenciesAccepted: "CAD",
    paymentAccepted: "Credit Card, Debit, Cash",
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.provinceCode,
      postalCode: address.postalCode,
      addressCountry: address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: address.coordinates.lat,
      longitude: address.coordinates.lng,
    },
    areaServed: serviceAreas.map((a) => ({ "@type": "City", name: a.name })),
    openingHoursSpecification: getOpeningHoursSpecification(),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Detailing services",
      // Promotional price when one is running, so structured data states what
      // the service actually costs today rather than a price nobody is paying.
      itemListElement: businessConfig.services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name },
        priceCurrency: s.currency,
        price: getServicePricing(s).current,
      })),
    },
  };
}

export function getServiceSchema(service: Service): Record<string, unknown> {
  const pricing = getServicePricing(service);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": absoluteUrl(`/services/${service.slug}#service`),
    name: service.name,
    serviceType: service.name,
    description: service.longDescription,
    provider: { "@id": absoluteUrl("/#business"), name },
    areaServed: serviceAreas.map((a) => ({ "@type": "City", name: a.name })),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/services/${service.slug}`),
      priceCurrency: service.currency,
      price: pricing.current,
      priceSpecification: {
        "@type": "PriceSpecification",
        price: pricing.current,
        priceCurrency: service.currency,
        valueAddedTaxIncluded: false,
        description: `Starting price. Final quote depends on vehicle size and condition. From ${formatPrice(
          pricing.current,
          service.currency,
        )}.${
          pricing.isPromo
            ? ` Limited-time offer, normally ${formatPrice(pricing.regular, service.currency)}.`
            : ""
        }`,
      },
      availability: "https://schema.org/InStock",
    },
  };
}

export function getBreadcrumbSchema(
  items: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function getFaqSchema(faqs: Faq[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
