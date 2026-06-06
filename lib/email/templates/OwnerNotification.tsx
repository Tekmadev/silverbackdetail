import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Link,
} from "@react-email/components";
import type { BookingRecord } from "@/lib/booking/types";
import { businessConfig } from "@/lib/config/business";
import { formatPrice } from "@/lib/config/site";
import { formatSlotLabel } from "@/lib/booking/availability";

const main = { backgroundColor: "#0a0a0b", color: "#f4f5f7", fontFamily: "Arial, Helvetica, sans-serif" };
const container = { maxWidth: "560px", margin: "0 auto", padding: "32px 24px" };
const card = { backgroundColor: "#121214", border: "1px solid #26262b", borderRadius: "12px", padding: "24px" };
const row = { color: "#f4f5f7", fontSize: "14px", margin: "0 0 6px" };
const muted = { color: "#9a9da6" };

export function OwnerNotification({ record }: { record: BookingRecord }) {
  return (
    <Html>
      <Head />
      <Preview>New booking {record.id} — {record.serviceName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={{ color: "#f4f5f7", fontSize: "22px", margin: "0 0 4px" }}>
            New booking · {record.id}
          </Heading>
          <Text style={{ ...muted, margin: "0 0 20px" }}>
            Status: <strong style={{ color: record.depositPaid ? "#3fb67a" : "#e0a33e" }}>{record.status}</strong>
          </Text>
          <Section style={card}>
            <Text style={row}><span style={muted}>Service:</span> {record.serviceName} · {formatPrice(record.priceFrom, record.currency)}</Text>
            <Text style={row}><span style={muted}>When:</span> {record.date} at {formatSlotLabel(record.time)}</Text>
            <Text style={row}>
              <span style={muted}>Location:</span>{" "}
              {record.location.type === "mobile" ? `Mobile · ${record.location.address}` : "In-shop"}
            </Text>
            <Text style={row}>
              <span style={muted}>Vehicle:</span> {record.vehicle.year} {record.vehicle.make} {record.vehicle.model}, {record.vehicle.colour} · {record.vehicle.condition}
            </Text>
            {record.vehicle.notes ? (
              <Text style={row}><span style={muted}>Notes:</span> {record.vehicle.notes}</Text>
            ) : null}
            {record.requiresDeposit ? (
              <Text style={row}>
                <span style={muted}>Deposit:</span> {formatPrice(record.depositAmount, record.currency)} · {record.depositPaid ? "PAID" : "not collected"}
              </Text>
            ) : null}
          </Section>
          <Section style={{ ...card, marginTop: "12px" }}>
            <Text style={row}>
              <span style={muted}>Customer:</span> {record.customer.name}
            </Text>
            <Text style={row}>
              <span style={muted}>Email:</span>{" "}
              <Link href={`mailto:${record.customer.email}`} style={{ color: "#edeff3" }}>{record.customer.email}</Link>
            </Text>
            <Text style={row}>
              <span style={muted}>Phone:</span>{" "}
              <Link href={`tel:${record.customer.phone}`} style={{ color: "#edeff3" }}>{record.customer.phone}</Link>
            </Text>
          </Section>
          <Text style={{ ...muted, fontSize: "12px", marginTop: "16px" }}>
            {businessConfig.name} booking system
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default OwnerNotification;
