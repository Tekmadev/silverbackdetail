"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/customers", label: "Customers", icon: Users },
] as const;

/**
 * /admin must match exactly or it lights up on every child route, since every
 * admin path starts with it.
 */
function useIsActive() {
  const pathname = usePathname();
  return (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));
}

/** Desktop only. Below md the tab bar takes over. */
export function AdminSidebar() {
  const isActive = useIsActive();

  return (
    <nav
      aria-label="Dashboard"
      className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-ink-2 px-3 py-6 md:flex"
    >
      <span className="px-3 pb-6 font-display text-lg font-semibold tracking-tight text-bone">
        Silverback
      </span>
      <ul className="flex flex-col gap-1">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
                  active
                    ? "bg-ink-3 font-medium text-bone"
                    : "text-bone-muted hover:bg-ink-3/60 hover:text-bone",
                )}
              >
                <Icon className="size-[18px] shrink-0" strokeWidth={1.75} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Mobile navigation, pinned to the bottom where a thumb actually reaches. The
 * safe-area padding keeps the labels clear of the iPhone home indicator, which
 * would otherwise sit directly on top of them.
 */
export function AdminTabBar() {
  const isActive = useIsActive();

  return (
    <nav
      aria-label="Dashboard"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ink-2/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="flex">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] transition-colors",
                  active ? "text-bone" : "text-bone-muted",
                )}
              >
                <Icon
                  className={cn("size-5", active && "text-accent")}
                  strokeWidth={active ? 2 : 1.75}
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
