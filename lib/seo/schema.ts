/**
 * Reusable schema.org (JSON-LD) builders. All data flows from the business
 * config so structured data and on-page content can never drift apart.
 */

import { businessConfig, type Service } from "@/lib/config/business";
import { absoluteUrl, getOpeningHoursSpecification, formatPrice } from "@/lib/config/site";
import type { Faq, ProcessStep, Testimonial } from "@/lib/data/content";

const { name, legalName, address, contact, trust, seo, serviceAreas } = businessConfig;

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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: trust.googleRating,
      reviewCount: trust.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Detailing services",
      itemListElement: businessConfig.services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name },
        priceCurrency: s.currency,
        price: s.priceFrom,
      })),
    },
  };
}

export function getServiceSchema(service: Service): Record<string, unknown> {
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
      price: service.priceFrom,
      priceSpecification: {
        "@type": "PriceSpecification",
        price: service.priceFrom,
        priceCurrency: service.currency,
        valueAddedTaxIncluded: false,
        description: `Starting price. Final quote depends on vehicle size and condition. From ${formatPrice(
          service.priceFrom,
          service.currency,
        )}.`,
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

export function getHowToSchema(steps: ProcessStep[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": absoluteUrl("/#how-we-work"),
    name: `How ${name} works`,
    description: `Our proven ${steps.length}-step detailing process for showroom-grade results in ${businessConfig.address.city}.`,
    totalTime: "PT4H",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.description,
    })),
  };
}

export function getVideoObjectSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": absoluteUrl("/#hero-video"),
    name: `${name} — Professional Car Detailing in ${address.city}, Ontario`,
    description: businessConfig.longDescription,
    thumbnailUrl: absoluteUrl(seo.ogImage),
    contentUrl: absoluteUrl(businessConfig.media.heroVideo),
    uploadDate: `${businessConfig.foundedYear}-01-01`,
    publisher: { "@id": absoluteUrl("/#organization"), name },
  };
}

export function getReviewsSchema(testimonials: Testimonial[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": absoluteUrl("/#reviews"),
    name: `Customer reviews — ${name}`,
    itemListElement: testimonials.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Review",
        reviewBody: t.quote,
        reviewRating: {
          "@type": "Rating",
          ratingValue: t.rating,
          bestRating: 5,
          worstRating: 1,
        },
        author: { "@type": "Person", name: t.name },
        itemReviewed: { "@id": absoluteUrl("/#business"), name },
      },
    })),
  };
}

export function getServiceHowToSchema(service: Service, steps: ProcessStep[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": absoluteUrl(`/services/${service.slug}#how-it-works`),
    name: `How ${service.name} works at ${name}`,
    description: service.longDescription,
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: service.currency,
      value: service.priceFrom,
    },
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.description,
    })),
  };
}
