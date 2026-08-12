"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, type SignInState } from "@/lib/admin/actions";

export function LoginForm({ next, disabled }: { next?: string; disabled?: boolean }) {
  const [state, formAction, isPending] = useActionState<SignInState, FormData>(signIn, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {next && <input type="hidden" name="next" value={next} />}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          // Phone keyboards capitalise and autocorrect by default, which quietly
          // mangles an email address before it is ever submitted.
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          inputMode="email"
          required
          disabled={disabled || isPending}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={disabled || isPending}
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-accent/30 bg-accent-soft px-3 py-2.5 text-sm text-bone"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.75} />
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={disabled || isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
