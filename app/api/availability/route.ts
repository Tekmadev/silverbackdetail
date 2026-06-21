import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/booking/availability";
import { getBookedSlots } from "@/lib/storage/bookings";

// Do not cache: availability must reflect live bookings.
export const revalidate = 0;

export async function GET() {
  const days = getAvailability(30);

  if (days.length === 0) {
    return NextResponse.json({ days });
  }

  const bookedSlots = await getBookedSlots(days[0].date, days[days.length - 1].date);

  if (bookedSlots.size === 0) {
    return NextResponse.json({ days });
  }

  const filtered = days
    .map((day) => ({
      ...day,
      slots: day.slots.filter((slot) => !bookedSlots.has(`${day.date}:${slot}`)),
    }))
    .filter((day) => day.slots.length > 0);

  return NextResponse.json({ days: filtered });
}
