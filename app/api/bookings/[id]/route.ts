import { NextResponse } from "next/server";
import { getBookingById } from "@/lib/storage/bookings";
import { cancelBooking } from "@/lib/booking/actions";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, booking });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = (await req.json()) as { action?: string; token?: string };
    if (body.action === "cancel" && body.token) {
      const result = await cancelBooking(id, body.token);
      return NextResponse.json(result, { status: result.ok ? 200 : 400 });
    }
    return NextResponse.json({ ok: false, error: "Unsupported action." }, { status: 400 });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}
