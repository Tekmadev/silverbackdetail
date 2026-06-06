import { NextResponse } from "next/server";
import { createBooking } from "@/lib/booking/actions";
import type { BookingInput } from "@/lib/booking/schema";

/**
 * API alternative to the createBooking server action. Accepts a full booking
 * payload and returns a Stripe Checkout URL (deposit services) or a confirmation
 * URL (everything else). The booking form uses the server action directly; this
 * exists for external/programmatic use.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as BookingInput;
    const result = await createBooking(body);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}
