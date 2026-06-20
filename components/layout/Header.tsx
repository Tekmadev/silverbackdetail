"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/animations/Magnetic";
import { MobileNav } from "@/components/layout/MobileNav";
import { primaryNav } from "@/lib/config/nav";
import { businessConfig } from "@/lib/config/business";
import { formatPhoneForLink } from "@/lib/config/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !isHome;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        solid
          ? "border-b border-line bg-ink/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between md:h-18">
        <Link
          href="/"
          aria-label={`${businessConfig.name} home`}
          className={cn(
            "origin-left rounded-md transition-transform duration-300",
            solid && "scale-[0.94]",
          )}
        >
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "text-bone" : "text-bone-muted hover:text-bone",
                )}
              >
                {link.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-3.5 bottom-1 h-px origin-left bg-silver transition-transform duration-200",
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={formatPhoneForLink()}
            className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-bone-muted transition-colors hover:text-bone xl:flex"
          >
            <Phone className="size-4" />
            {businessConfig.contact.phoneDisplay}
          </a>
          <Magnetic className="hidden sm:inline-flex">
            <Button asChild size="sm">
              <Link href="/book">Book now</Link>
            </Button>
          </Magnetic>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
