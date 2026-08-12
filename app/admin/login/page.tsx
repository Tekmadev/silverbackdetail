import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/admin/LoginForm";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";
import { businessConfig } from "@/lib/config/business";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const configured = isSupabaseAuthConfigured();

  return (
    <main
      id="main"
      className="flex min-h-dvh flex-col items-center justify-center px-4 py-12 sm:px-6"
    >
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Image
            src={businessConfig.media.logoMark}
            alt=""
            width={48}
            height={48}
            className="size-12 rounded-full"
            priority
          />
          <h1 className="font-display text-2xl font-semibold tracking-tight text-bone">
            Silverback Dashboard
          </h1>
          <p className="text-sm text-bone-muted">Bookings, customers, and revenue.</p>
        </div>

        <div className="rounded-xl border border-line bg-ink-2 p-6">
          {configured ? (
            <LoginForm next={next} />
          ) : (
            // Local dev with no .env.local lands here. Saying so beats a form
            // that silently fails against a Supabase project that is not there.
            <p className="text-sm leading-relaxed text-bone-muted">
              Sign-in is not configured on this deployment. Set{" "}
              <code className="text-silver">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="text-silver">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to enable it.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
