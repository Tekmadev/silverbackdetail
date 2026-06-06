import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getLocalBusinessSchema } from "@/lib/seo/schema";
import { businessConfig } from "@/lib/config/business";
import {
  formatPhoneForLink,
  formatEmailForLink,
  getWeeklyHours,
  getOpenStatus,
} from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Silverback Detailing in Hamilton, Ontario. Call, email, or send a message. View our hours, location, and service area.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { contact, address } = businessConfig;
  const hours = getWeeklyHours();
  const status = getOpenStatus();
  const mapQuery = encodeURIComponent(
    `${address.street}, ${address.city}, ${address.provinceCode} ${address.postalCode}, ${address.country}`,
  );

  return (
    <>
      <JsonLd id="contact-business-schema" data={getLocalBusinessSchema()} />
      <JsonLd
        id="contact-breadcrumb"
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <PageHeader
        eyebrow="Get in touch"
        title="Let us talk about your vehicle"
        description="Questions about a service, a quote, or scheduling? Reach out and a detailer will get back to you."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            <div className="rounded-xl border border-line bg-ink-3 p-7 md:p-9">
              <h2 className="font-display text-2xl font-semibold text-bone">Send a message</h2>
              <p className="mt-1.5 text-bone-muted">We typically reply within one business day.</p>
              <div className="mt-7">
                <ContactForm />
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-xl border border-line bg-ink-3 p-6">
                <h2 className="eyebrow mb-4">Contact</h2>
                <ul className="space-y-4 text-sm">
                  <li>
                    <a href={formatPhoneForLink()} className="flex items-center gap-3 text-bone transition-colors hover:text-silver-bright">
                      <Phone className="size-4 text-silver" />
                      {contact.phoneDisplay}
                    </a>
                  </li>
                  <li>
                    <a href={formatEmailForLink(contact.email)} className="flex items-center gap-3 text-bone transition-colors hover:text-silver-bright">
                      <Mail className="size-4 text-silver" />
                      {contact.email}
                    </a>
                  </li>
                  <li className="flex items-start gap-3 text-bone">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-silver" />
                    <span>
                      {address.street}
                      <br />
                      {address.city}, {address.provinceCode} {address.postalCode}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-line bg-ink-3 p-6">
                <h2 className="eyebrow mb-4 flex items-center gap-2">
                  <Clock className="size-4" /> Hours
                </h2>
                <p className="mb-3 text-sm">
                  <span className={status.open ? "text-success" : "text-bone-muted"}>●</span>{" "}
                  <span className="text-bone">{status.label}</span>
                </p>
                <ul className="space-y-2 text-sm">
                  {hours.map((h) => (
                    <li key={h.day} className="flex justify-between">
                      <span className="text-bone-muted">{h.day}</span>
                      <span className={h.closed ? "text-bone-muted" : "text-bone"}>{h.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <div className="mt-12 overflow-hidden rounded-xl border border-line">
            <iframe
              title={`Map to ${businessConfig.name}`}
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[360px] w-full grayscale-[0.3]"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
