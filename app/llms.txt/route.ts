import { businessConfig } from "@/lib/config/business";
import { absoluteUrl } from "@/lib/config/site";

// Regenerate occasionally; content is derived from the business config.
export const revalidate = 86400;

export async function GET() {
  const { name, shortDescription, services, serviceAreas, contact, seo } = businessConfig;

  const lines = [
    `# ${name}`,
    "",
    `> ${shortDescription} ${businessConfig.longDescription}`,
    "",
    "## Key pages",
    `- [Home](${seo.siteUrl}): Overview of premium detailing services in ${businessConfig.address.city}, Ontario.`,
    `- [Services](${absoluteUrl("/services")}): All detailing services with starting prices and what each includes.`,
    ...services.map(
      (s) =>
        `- [${s.name}](${absoluteUrl(`/services/${s.slug}`)}): ${s.shortDescription} From ${s.priceFrom} ${s.currency}.`,
    ),
    `- [Mobile Detailing](${absoluteUrl("/mobile-detailing")}): Mobile car detailing brought to your home or workplace.`,
    `- [Gallery](${absoluteUrl("/gallery")}): Before and after detailing and correction work.`,
    `- [About](${absoluteUrl("/about")}): Brand story, philosophy, and process.`,
    `- [FAQ](${absoluteUrl("/faq")}): Answers about pricing, deposits, coatings, and process.`,
    `- [Contact](${absoluteUrl("/contact")}): Phone, email, hours, and location.`,
    `- [Book](${absoluteUrl("/book")}): Online booking for all services.`,
    "",
    "## Service areas",
    ...serviceAreas.map((a) => `- [${a.name}](${absoluteUrl(`/service-areas/${a.slug}`)})`),
    "",
    "## Contact",
    `- Phone: ${contact.phoneDisplay}`,
    `- Email: ${contact.email}`,
    "",
    "## Notes",
    "- Premium services (paint correction, ceramic coating) require a refundable deposit.",
    "- In-shop and mobile service available across Hamilton and surrounding cities.",
    `- Full details: ${absoluteUrl("/llms-full.txt")}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
