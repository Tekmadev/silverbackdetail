import { businessConfig } from "@/lib/config/business";
import { absoluteUrl, getWeeklyHours } from "@/lib/config/site";
import { faqs, processSteps } from "@/lib/data/content";

export const revalidate = 86400;

export async function GET() {
  const { name, legalName, contact, address, services, serviceAreas, booking } = businessConfig;
  const hours = getWeeklyHours();

  const out: string[] = [];
  out.push(`# ${name} — Full Reference`);
  out.push("");
  out.push(businessConfig.longDescription);
  out.push("");
  out.push("## Business details");
  out.push(`- Legal name: ${legalName}`);
  out.push(`- Location: ${address.street}, ${address.city}, ${address.province} ${address.postalCode}, ${address.country}`);
  out.push(`- Phone: ${contact.phoneDisplay}`);
  out.push(`- Email: ${contact.email}`);
  out.push(`- Founded: ${businessConfig.foundedYear}`);
  out.push("");
  out.push("## Hours");
  hours.forEach((h) => out.push(`- ${h.day}: ${h.hours}`));
  out.push("");
  out.push("## Service areas");
  serviceAreas.forEach((a) => out.push(`- ${a.name}${a.primary ? " (primary studio)" : ""}`));
  out.push("");

  out.push("## Services");
  services.forEach((s) => {
    out.push("");
    out.push(`### ${s.name}`);
    out.push(`URL: ${absoluteUrl(`/services/${s.slug}`)}`);
    out.push(`Starting price: ${s.priceFrom} ${s.currency}`);
    out.push(`Duration: ${s.duration}`);
    out.push(
      `Deposit: ${
        s.requiresDeposit
          ? `${s.depositAmount} ${s.currency}, refundable up to ${s.depositRefundWindowHours} hours before service`
          : "none required"
      }`,
    );
    out.push(`Summary: ${s.longDescription}`);
    out.push(`Includes: ${s.includes.join("; ")}.`);
    if (s.excludes.length) out.push(`Not included: ${s.excludes.join("; ")}.`);
  });
  out.push("");

  out.push("## Booking policy");
  out.push(`- Minimum lead time: ${booking.minLeadTimeHours} hours`);
  out.push(`- Cancellation: ${booking.cancellationPolicy}`);
  out.push(`- Refunds: ${booking.refundPolicy}`);
  out.push(`- Deposits: ${booking.depositExplanation}`);
  out.push("");

  out.push("## Process");
  processSteps.forEach((p) => out.push(`${p.step}. ${p.title}: ${p.description}`));
  out.push("");

  out.push("## Frequently asked questions");
  faqs.forEach((f) => {
    out.push("");
    out.push(`Q: ${f.question}`);
    out.push(`A: ${f.answer}`);
  });
  out.push("");

  return new Response(out.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
