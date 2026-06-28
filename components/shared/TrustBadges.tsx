import { RefreshCw, Car, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Honest, verifiable assurances shown under the main call to action. No ratings,
 * review counts, or certifications until they can be backed by real data.
 */
export function TrustBadges({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-bone-muted", className)}>
      <li className="flex items-center gap-2">
        <RefreshCw className="size-4 text-silver" />
        Refundable deposits
      </li>
      <li className="flex items-center gap-2">
        <Car className="size-4 text-silver" />
        In-shop &amp; mobile
      </li>
      <li className="flex items-center gap-2">
        <Clock className="size-4 text-silver" />
        Open 7 days a week
      </li>
    </ul>
  );
}
