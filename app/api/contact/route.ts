import { NextResponse } from "next/server";
import { submitContact } from "@/lib/booking/actions";
import type { ContactInput } from "@/lib/booking/schema";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactInput;
    const result = await submitContact(body);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}
