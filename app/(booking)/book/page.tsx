import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Book your detail",
  description:
    "Book premium car detailing, paint correction, or ceramic coating in Hamilton, Ontario. In-shop or mobile. Refundable deposits on premium services.",
  alternates: { canonical: "/book" },
  robots: { index: true, follow: true },
};

export default function BookPage() {
  return (
    <div className="py-10 md:py-14">
      <Container className="max-w-5xl">
        <div className="mb-8">
          <p className="eyebrow mb-3">Online booking</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-bone sm:text-4xl">
            Reserve your appointment
          </h1>
          <p className="mt-2 max-w-2xl text-bone-muted">
            A few quick steps. Your progress is saved automatically if you need to step away.
          </p>
        </div>
        <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-ink-3" />}>
          <BookingFlow />
        </Suspense>
      </Container>
    </div>
  );
}
