import { LogOut } from "lucide-react";
import { AdminSidebar, AdminTabBar } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin/dal";
import { signOut } from "@/lib/admin/actions";

/**
 * Signed-in shell. The login screen sits outside this route group so it renders
 * without navigation, which is why the group exists at all.
 *
 * Never cached: this renders one person's customer list, and a shared cache
 * entry here would be a data leak rather than a stale page.
 */
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Also enforced in every page's own data read. Doing it here too means a page
  // added later without that call still lands behind the gate.
  const admin = await requireAdmin();

  return (
    <div className="min-h-dvh bg-ink md:pl-60">
      <AdminSidebar />

      <header className="sticky top-0 z-20 flex min-h-14 items-center gap-3 border-b border-line bg-ink/90 px-4 backdrop-blur-sm sm:px-6">
        <span className="font-display text-sm font-semibold tracking-tight text-bone md:hidden">
          Silverback
        </span>
        <span
          className="ml-auto truncate text-xs text-bone-muted"
          title={`${admin.email} (${admin.role})`}
        >
          {admin.email}
        </span>
        <form action={signOut}>
          <button
            type="submit"
            className="flex size-11 items-center justify-center rounded-lg text-bone-muted transition-colors hover:bg-ink-3 hover:text-bone"
            aria-label="Sign out"
          >
            <LogOut className="size-[18px]" strokeWidth={1.75} />
          </button>
        </form>
      </header>

      {/* Bottom padding clears the mobile tab bar, which is fixed and would
          otherwise sit on top of the last card in any list. */}
      <main id="main" className="px-4 pb-28 pt-5 sm:px-6 md:pb-12">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>

      <AdminTabBar />
    </div>
  );
}
