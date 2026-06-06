"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="font-display text-3xl font-semibold text-bone sm:text-4xl">We hit an unexpected bump</h1>
      <p className="max-w-md text-bone-muted">
        Sorry about that. You can try again, or head back home. If it keeps happening, please give us a call.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} size="lg">
          <RotateCcw className="size-4" />
          Try again
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href="/">
            <Home className="size-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
}
