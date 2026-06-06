import { ShieldCheck, Star, RefreshCw } from "lucide-react";
import { businessConfig } from "@/lib/config/business";
import { cn } from "@/lib/utils";

export function TrustBadges({ className }: { className?: string }) {
  const { trust } = businessConfig;
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-bone-muted", className)}>
      <li className="flex items-center gap-2">
        <Star className="size-4 fill-warning text-warning" />
        <span className="font-medium text-bone">{trust.googleRating.toFixed(1)}</span> Google rating
      </li>
      {trust.certifications.map((cert) => (
        <li key={cert} className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-silver" />
          {cert}
        </li>
      ))}
      <li className="flex items-center gap-2">
        <RefreshCw className="size-4 text-silver" />
        Refundable deposits
      </li>
    </ul>
  );
}
