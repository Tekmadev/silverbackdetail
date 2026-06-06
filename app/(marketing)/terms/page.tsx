import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { businessConfig } from "@/lib/config/business";

export const metadata: Metadata = {
  title: "Terms of service",
  description: `The terms that govern bookings and services with ${businessConfig.name}.`,
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "June 6, 2026";

export default function TermsPage() {
  const { name, legalName, contact, booking } = businessConfig;
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of service"
        description={`Last updated ${LAST_UPDATED}.`}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Terms", path: "/terms" },
        ]}
      />
      <section className="py-16 md:py-20">
        <Container>
          <div className="prose-sb">
            <p>
              These terms govern your use of the {name} website and the services provided by {legalName}. By booking a
              service, you agree to these terms.
            </p>

            <h2>Bookings and scheduling</h2>
            <p>
              Bookings are subject to availability. We require a minimum lead time of {booking.minLeadTimeHours} hours.
              We will confirm your appointment and may contact you to adjust timing based on your vehicle’s condition.
            </p>

            <h2>Deposits</h2>
            <p>
              Premium services, including paint correction and ceramic coating, require a deposit to secure your slot.
              {" "}
              {booking.depositExplanation}
            </p>

            <h2>Cancellations and refunds</h2>
            <p>{booking.cancellationPolicy}</p>
            <p>{booking.refundPolicy}</p>
            <p>
              Cancellations made within the refund window may forfeit the deposit, as the slot is reserved exclusively
              for you and is difficult to refill on short notice.
            </p>

            <h2>Pricing</h2>
            <p>
              Listed prices are starting prices. Final pricing depends on your vehicle’s size, condition, and the scope
              of work, and will be confirmed before work begins. All prices are in Canadian dollars and exclude
              applicable taxes unless stated otherwise.
            </p>

            <h2>Service results</h2>
            <p>
              We take great care with every vehicle and stand behind our work. Detailing and correction results vary
              with a vehicle’s age, paint, and prior condition. Where existing damage cannot be safely corrected, we
              will advise you before proceeding.
            </p>

            <h2>Liability</h2>
            <p>
              We carry appropriate care and handling practices. To the extent permitted by law, our liability for any
              claim relating to a service is limited to the amount paid for that service. We are not responsible for
              pre-existing damage or defects disclosed or discovered during service.
            </p>

            <h2>Your responsibilities</h2>
            <ul>
              <li>Remove personal belongings before your appointment.</li>
              <li>For mobile service, provide safe access and a suitable space to work.</li>
              <li>Disclose any known issues with your vehicle in advance.</li>
            </ul>

            <h2>Contact</h2>
            <p>
              Questions about these terms? Email <a href={`mailto:${contact.email}`}>{contact.email}</a>.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
