import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/shared/Logo";
import { businessConfig } from "@/lib/config/business";
import { formatPhoneForLink } from "@/lib/config/site";

/**
 * Minimal chrome for the booking flow. Deliberately omits the Lenis smooth-scroll
 * provider so native form scrolling and inputs are never intercepted.
 */
export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" aria-label={`${businessConfig.name} home`} className="rounded-md">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <a
              href={formatPhoneForLink()}
              className="hidden items-center gap-2 text-sm font-medium text-bone-muted transition-colors hover:text-bone sm:flex"
            >
              <Phone className="size-4" />
              {businessConfig.contact.phoneDisplay}
            </a>
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-bone-muted transition-colors hover:text-bone"
            >
              <ArrowLeft className="size-4" />
              Back to site
            </Link>
          </div>
        </Container>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
    </div>
  );
}
