import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Link,
} from "@react-email/components";
import type { BookingRecord } from "@/lib/booking/types";
import { businessConfig } from "@/lib/config/business";
import { formatPrice } from "@/lib/config/site";
import { formatSlotLabel } from "@/lib/booking/availability";

const main = { backgroundColor: "#0a0a0b", color: "#f4f5f7", fontFamily: "Arial, Helvetica, sans-serif" };
const container = { maxWidth: "560px", margin: "0 auto", padding: "32px 24px" };
const card = { backgroundColor: "#121214", border: "1px solid #26262b", borderRadius: "12px", padding: "24px" };
const label = { color: "#9a9da6", fontSize: "13px", margin: "0" };
const value = { color: "#f4f5f7", fontSize: "15px", margin: "0 0 12px", fontWeight: 600 as const };

export function BookingConfirmation({ record }: { record: BookingRecord }) {
  const { contact, name, booking } = businessConfig;
  return (
    <Html>
      <Head />
      <Preview>Your {record.serviceName} booking is confirmed — {record.id}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={{ color: "#c7cad1", letterSpacing: "3px", fontSize: "12px", textTransform: "uppercase" }}>
            {name}
          </Text>
          <Heading style={{ color: "#f4f5f7", fontSize: "26px", margin: "8px 0 4px" }}>
            Booking confirmed
          </Heading>
          <Text style={{ color: "#9a9da6", margin: "0 0 24px" }}>
            Thanks {record.customer.name.split(" ")[0]}. We have your {record.serviceName.toLowerCase()} booked.
            Your confirmation number is <strong style={{ color: "#f4f5f7" }}>{record.id}</strong>.
          </Text>

          <Section style={card}>
            <Text style={label}>Service</Text>
            <Text style={value}>{record.serviceName} · from {formatPrice(record.priceFrom, record.currency)}</Text>
            <Text style={label}>Date &amp; time</Text>
            <Text style={value}>{record.date} at {formatSlotLabel(record.time)}</Text>
            <Text style={label}>Location</Text>
            <Text style={value}>
              {record.location.type === "mobile"
                ? `Mobile · ${record.location.address}`
                : "In-shop · Hamilton studio"}
            </Text>
            <Text style={label}>Vehicle</Text>
            <Text style={value}>
              {record.vehicle.year} {record.vehicle.make} {record.vehicle.model} ({record.vehicle.colour})
            </Text>
            {record.requiresDeposit && (
              <>
                <Text style={label}>Deposit</Text>
                <Text style={value}>
                  {formatPrice(record.depositAmount, record.currency)}{" "}
                  {record.depositPaid ? "paid · credited to your final invoice" : "due to secure your slot"}
                </Text>
              </>
            )}
          </Section>

          <Section style={{ ...card, marginTop: "16px" }}>
            <Text style={{ color: "#f4f5f7", fontWeight: 600, margin: "0 0 8px" }}>Before your appointment</Text>
            <Text style={{ color: "#9a9da6", fontSize: "14px", margin: "0" }}>
              Please remove personal belongings. For mobile service, leave a parking spot with a little room to work.
              {record.requiresDeposit ? ` ${booking.refundPolicy}` : ` ${booking.cancellationPolicy}`}
            </Text>
          </Section>

          <Hr style={{ borderColor: "#26262b", margin: "24px 0" }} />
          <Text style={{ color: "#9a9da6", fontSize: "13px" }}>
            Questions? Call <Link href={`tel:${contact.phone}`} style={{ color: "#edeff3" }}>{contact.phoneDisplay}</Link> or
            email <Link href={`mailto:${contact.email}`} style={{ color: "#edeff3" }}>{contact.email}</Link>.
          </Text>
          <Text style={{ color: "#6b6e76", fontSize: "12px", marginTop: "16px" }}>
            {businessConfig.legalName} · {businessConfig.address.city}, {businessConfig.address.provinceCode}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default BookingConfirmation;
