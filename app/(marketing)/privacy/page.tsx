import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { businessConfig } from "@/lib/config/business";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${businessConfig.name} collects, uses, and protects your personal information.`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "June 6, 2026";

export default function PrivacyPage() {
  const { name, legalName, contact, address } = businessConfig;
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy policy"
        description={`Last updated ${LAST_UPDATED}.`}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ]}
      />
      <section className="py-16 md:py-20">
        <Container>
          <div className="prose-sb">
            <p>
              {legalName} (“{name}”, “we”, “us”) respects your privacy. This policy explains what information we collect
              when you use our website or book a service, how we use it, and the choices you have.
            </p>

            <h2>Information we collect</h2>
            <p>We collect information you provide directly, including:</p>
            <ul>
              <li>Contact details such as your name, email address, and phone number.</li>
              <li>Booking details such as your vehicle information, service location, and appointment preferences.</li>
              <li>Payment information for deposits, processed securely by our payment provider. We do not store card numbers.</li>
              <li>Messages you send us through our contact form.</li>
            </ul>

            <h2>How we use your information</h2>
            <ul>
              <li>To schedule, confirm, and deliver the services you request.</li>
              <li>To process refundable deposits and any refunds.</li>
              <li>To send booking confirmations, reminders, and service updates.</li>
              <li>To respond to enquiries and provide customer support.</li>
              <li>To improve our website and services.</li>
            </ul>

            <h2>Payment processing</h2>
            <p>
              Deposits are processed by a third-party payment processor. Your card details are handled directly by that
              processor under their own security standards and are never stored on our servers.
            </p>

            <h2>Sharing your information</h2>
            <p>
              We do not sell your personal information. We share it only with service providers who help us operate
              (such as payment, email, and hosting providers), and only as needed to deliver our services or comply with
              the law.
            </p>

            <h2>Data retention</h2>
            <p>
              We keep booking and contact records for as long as necessary to provide our services and meet legal,
              accounting, and tax obligations, after which we securely delete or anonymize them.
            </p>

            <h2>Your rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal information. To make a request,
              contact us using the details below. We will respond in accordance with applicable Canadian privacy law.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about this policy? Email <a href={`mailto:${contact.email}`}>{contact.email}</a> or write to us at{" "}
              {address.street}, {address.city}, {address.provinceCode} {address.postalCode}, {address.country}.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
