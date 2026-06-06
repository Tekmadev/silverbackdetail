import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/booking/availability";

// Availability depends on the current date; refresh periodically.
export const revalidate = 1800;

export async function GET() {
  const days = getAvailability(30);
  return NextResponse.json({ days });
}
