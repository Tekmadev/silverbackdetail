"use client";

import * as React from "react";
import { CalendarPlus, Loader2, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConfirmationActions({
  id,
  token,
  icsContent,
}: {
  id: string;
  token: string;
  icsContent: string;
}) {
  const [cancelState, setCancelState] = React.useState<"idle" | "loading" | "done">("idle");
  const [cancelMessage, setCancelMessage] = React.useState<string | null>(null);

  function downloadIcs() {
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `silverback-${id}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function cancel() {
    if (!confirm("Cancel this booking? If you are within the refund window, your deposit will be refunded.")) return;
    setCancelState("loading");
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel", token }),
      });
      const data = (await res.json()) as { ok: boolean; refunded?: boolean; error?: string };
      setCancelState("done");
      if (data.ok) {
        setCancelMessage(
          data.refunded
            ? "Your booking is cancelled and your deposit has been refunded."
            : data.error ?? "Your booking has been cancelled.",
        );
      } else {
        setCancelMessage(data.error ?? "We could not cancel automatically. Please call us.");
      }
    } catch {
      setCancelState("done");
      setCancelMessage("We could not reach the server. Please call us to cancel.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button onClick={downloadIcs} variant="secondary">
          <CalendarPlus className="size-4" />
          Add to calendar
        </Button>
      </div>

      <div className="rounded-xl border border-line bg-ink-2 p-5">
        <p className="text-sm font-medium text-bone">Need to make a change?</p>
        <p className="mt-1 text-sm text-bone-muted">
          You can cancel below. Deposits on premium services are refundable up to 48 hours before your appointment.
        </p>
        {cancelState !== "done" ? (
          <Button onClick={cancel} variant="ghost" size="sm" disabled={cancelState === "loading"} className="mt-3 text-bone-muted hover:text-accent">
            {cancelState === "loading" ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4" />}
            Cancel booking
          </Button>
        ) : (
          <p className="mt-3 flex items-start gap-2 text-sm text-success">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            {cancelMessage}
          </p>
        )}
      </div>
    </div>
  );
}
