"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { primaryNav } from "@/lib/config/nav";
import { businessConfig } from "@/lib/config/business";
import { formatPhoneForLink } from "@/lib/config/site";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  // Each nav link is wrapped in <DialogClose>, so the sheet closes on tap.
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent
        showClose
        className="left-0 top-0 h-dvh max-w-none translate-x-0 translate-y-0 rounded-none border-0 border-l border-line bg-ink p-0 sm:left-auto sm:right-0 sm:max-w-sm"
      >
        <DialogTitle className="sr-only">Site navigation</DialogTitle>
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-line px-6">
            <Logo />
          </div>
          <nav aria-label="Mobile" className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
            {primaryNav.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <DialogClose asChild key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-4 py-3.5 text-lg font-medium transition-colors",
                      active ? "bg-ink-3 text-bone" : "text-bone-muted hover:bg-ink-2 hover:text-bone",
                    )}
                  >
                    {link.label}
                    <ArrowRight className="size-4 opacity-50" />
                  </Link>
                </DialogClose>
              );
            })}
          </nav>
          <div className="space-y-3 border-t border-line p-6">
            <Button asChild className="w-full" size="lg">
              <Link href="/book">Book your detail</Link>
            </Button>
            <a
              href={formatPhoneForLink()}
              className="flex items-center justify-center gap-2 text-sm font-medium text-bone-muted transition-colors hover:text-bone"
            >
              <Phone className="size-4" />
              {businessConfig.contact.phoneDisplay}
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
