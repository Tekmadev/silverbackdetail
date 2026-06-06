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

const main = { backgroundColor: "#0a0a0b", color: "#f4f5f7", fontFamily: "Arial, Helvetica, sans-serif" };
const container = { maxWidth: "560px", margin: "0 auto", padding: "32px 24px" };
const card = { backgroundColor: "#121214", border: "1px solid #26262b", borderRadius: "12px", padding: "24px" };

export function RefundConfirmation({ record }: { record: BookingRecord }) {
  const { contact } = businessConfig;
  return (
    <Html>
      <Head />
      <Preview>Your deposit has been refunded — {record.id}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={{ color: "#f4f5f7", fontSize: "24px", margin: "0 0 8px" }}>Deposit refunded</Heading>
          <Text style={{ color: "#9a9da6", margin: "0 0 20px" }}>
            Hi {record.customer.name.split(" ")[0]}, we have refunded your deposit for booking{" "}
            <strong style={{ color: "#f4f5f7" }}>{record.id}</strong>.
          </Text>
          <Section style={card}>
            <Text style={{ color: "#f4f5f7", fontSize: "15px", margin: "0" }}>
              {formatPrice(record.depositAmount, record.currency)} refunded to your original payment method.
            </Text>
            <Text style={{ color: "#9a9da6", fontSize: "14px", margin: "10px 0 0" }}>
              Refunds typically take 5 to 10 business days to appear, depending on your bank.
            </Text>
          </Section>
          <Text style={{ color: "#9a9da6", fontSize: "13px", marginTop: "20px" }}>
            We hope to see you another time. Questions? Email{" "}
            <Link href={`mailto:${contact.email}`} style={{ color: "#edeff3" }}>{contact.email}</Link>.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default RefundConfirmation;
