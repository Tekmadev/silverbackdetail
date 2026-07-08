import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Mail, Phone, CalendarClock, MapPin, Car } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmationActions } from "@/components/booking/ConfirmationActions";
import { decodeBooking, buildIcs } from "@/lib/booking/token";
import { getBookingById } from "@/lib/storage/bookings";
import type { BookingRecord } from "@/lib/booking/types";
import { businessConfig } from "@/lib/config/business";
import { formatPrice, formatPhoneForLink, formatEmailForLink } from "@/lib/config/site";
import { formatSlotLabel } from "@/lib/booking/availability";

export const metadata: Metadata = {
  title: "Booking confirmation",
  robots: { index: false, follow: false },
};

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string; paid?: string; emailed?: string }>;
}) {
  const { id } = await params;
  const { t, paid, emailed } = await searchParams;
  const emailFailed = emailed === "0";

  let record: BookingRecord | null = (await getBookingById(id)) ?? (t ? decodeBooking(t) : null);
  if (record && paid === "1") record = { ...record, depositPaid: true, status: "confirmed" };

  if (!record || record.id !== id) {
    return (
      <Container className="max-w-2xl py-24 text-center">
        <h1 className="font-display text-3xl font-semibold text-bone">Booking not found</h1>
        <p className="mt-3 text-bone-muted">
          We could not find this booking. If you just booked, please use the link from your confirmation email.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <Link href="/book">Start a new booking</Link>
          </Button>
          <Button asChild variant="secondary">
            <a href={formatPhoneForLink()}>Call us</a>
          </Button>
        </div>
      </Container>
    );
  }

  const ics = buildIcs(record);
  const depositLine = record.requiresDeposit
    ? record.depositPaid
      ? `${formatPrice(record.depositAmount, record.currency)} deposit paid · credited to your final invoice`
      : `${formatPrice(record.depositAmount, record.currency)} refundable deposit due to secure your slot`
    : null;

  return (
    <div className="py-12 md:py-20">
      <Container className="max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-16 items-center justify-center rounded-full border border-success/40 bg-success/10 text-success">
            <CheckCircle2 className="size-8" />
          </span>
          <p className="eyebrow mt-6">Confirmation {record.id}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-bone sm:text-5xl">
            You are booked in
          </h1>
          <p className="mt-4 max-w-xl text-lg text-bone-muted">
            {emailFailed ? (
              <>
                Thanks {record.customer.name.split(" ")[0]}. Your booking is saved. If a confirmation
                email doesn&rsquo;t reach <span className="text-bone">{record.customer.email}</span> shortly,
                call or message us and we&rsquo;ll lock it in.
              </>
            ) : (
              <>
                Thanks {record.customer.name.split(" ")[0]}. A confirmation is on its way to{" "}
                <span className="text-bone">{record.customer.email}</span>.
              </>
            )}
          </p>
          {record.requiresDeposit && (
            <Badge variant={record.depositPaid ? "success" : "accent"} className="mt-5">
              {record.depositPaid ? "Deposit paid" : "Deposit pending"}
            </Badge>
          )}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-line bg-ink-3 p-6">
            <h2 className="font-display text-lg font-semibold text-bone">Appointment</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <Detail icon={<CalendarClock className="size-4" />} label={`${record.date} at ${formatSlotLabel(record.time)}`} />
              <Detail
                icon={<MapPin className="size-4" />}
                label={record.location.type === "mobile" ? `Mobile · ${record.location.address}` : "In-shop · Hamilton studio"}
              />
              <Detail
                icon={<Car className="size-4" />}
                label={`${record.vehicle.year} ${record.vehicle.make} ${record.vehicle.model} · ${record.vehicle.colour}`}
              />
            </ul>
          </div>

          <div className="rounded-xl border border-line bg-ink-3 p-6">
            <h2 className="font-display text-lg font-semibold text-bone">{record.serviceName}</h2>
            <p className="mt-2 text-sm text-bone-muted">From {formatPrice(record.priceFrom, record.currency)}</p>
            {depositLine && <p className="mt-3 text-sm text-bone">{depositLine}</p>}
            <p className="mt-4 text-xs leading-relaxed text-bone-muted">
              {record.requiresDeposit ? businessConfig.booking.refundPolicy : businessConfig.booking.cancellationPolicy}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <ConfirmationActions id={record.id} token={t ?? ""} icsContent={ics} />
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-line pt-8 text-center">
          <p className="text-sm text-bone-muted">Questions before your appointment?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="secondary" size="sm">
              <a href={formatPhoneForLink()}>
                <Phone className="size-4" />
                {businessConfig.contact.phoneDisplay}
              </a>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <a href={formatEmailForLink(businessConfig.contact.email)}>
                <Mail className="size-4" />
                {businessConfig.contact.email}
              </a>
            </Button>
          </div>
          <Button asChild variant="link" size="sm">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}

function Detail({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-start gap-2.5 text-bone">
      <span className="mt-0.5 text-silver">{icon}</span>
      <span>{label}</span>
    </li>
  );
}
