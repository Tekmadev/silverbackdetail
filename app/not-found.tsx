import Link from "next/link";
import { Home, Phone } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { formatPhoneForLink } from "@/lib/config/site";

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <header className="border-b border-line">
        <Container className="flex h-16 items-center">
          <Link href="/" aria-label="Home" className="rounded-md">
            <Logo />
          </Link>
        </Container>
      </header>
      <main id="main" className="relative flex flex-1 items-center justify-center overflow-hidden px-6 text-center">
        <div aria-hidden className="grain absolute inset-0" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <p className="font-display text-7xl font-semibold text-metal sm:text-9xl">404</p>
          <h1 className="font-display text-3xl font-semibold text-bone sm:text-4xl">This page took a detour</h1>
          <p className="max-w-md text-bone-muted">
            The page you are looking for does not exist or has moved. Let us get you back on the road.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="size-4" />
                Back to home
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href={formatPhoneForLink()}>
                <Phone className="size-4" />
                Call us
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
