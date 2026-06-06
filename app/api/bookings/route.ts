import { NextResponse } from "next/server";
import { createBooking } from "@/lib/booking/actions";
import type { BookingInput } from "@/lib/booking/schema";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as BookingInput;
    const result = await createBooking(body);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}
