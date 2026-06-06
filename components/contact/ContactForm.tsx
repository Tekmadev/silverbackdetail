"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { contactSchema, type ContactInput } from "@/lib/booking/schema";
import { submitContact } from "@/lib/booking/actions";
import { businessConfig } from "@/lib/config/business";

export function ContactForm() {
  const [sent, setSent] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", phone: "", service: "", message: "", company: "" },
  });

  const service = watch("service");

  async function onSubmit(values: ContactInput) {
    setServerError(null);
    const result = await submitContact(values);
    if (result.ok) setSent(true);
    else setServerError(result.error ?? "Something went wrong. Please try again.");
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-success/40 bg-success/5 p-10 text-center">
        <CheckCircle2 className="size-10 text-success" />
        <h2 className="font-display text-2xl font-semibold text-bone">Message sent</h2>
        <p className="max-w-sm text-bone-muted">
          Thanks for reaching out. We will get back to you shortly, usually within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="absolute left-[-9999px] h-0 w-0" {...register("company")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name <span className="text-accent">*</span></Label>
          <Input id="name" autoComplete="name" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && <FieldError msg={errors.name.message} />}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email <span className="text-accent">*</span></Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email && <FieldError msg={errors.email.message} />}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
          {errors.phone && <FieldError msg={errors.phone.message} />}
        </div>
        <div className="space-y-2">
          <Label>Service of interest</Label>
          <Select value={service || undefined} onValueChange={(v) => setValue("service", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {businessConfig.services.map((s) => (
                <SelectItem key={s.slug} value={s.name}>
                  {s.name}
                </SelectItem>
              ))}
              <SelectItem value="Not sure yet">Not sure yet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message <span className="text-accent">*</span></Label>
        <Textarea
          id="message"
          rows={5}
          placeholder="Tell us about your vehicle and what you are looking for."
          {...register("message")}
          aria-invalid={!!errors.message}
        />
        {errors.message && <FieldError msg={errors.message.message} />}
      </div>

      {serverError && (
        <p role="alert" className="flex items-center gap-2 rounded-lg border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-bone">
          <AlertCircle className="size-4 shrink-0 text-accent" />
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Sending
          </>
        ) : (
          <>
            <Send className="size-4" /> Send message
          </>
        )}
      </Button>
    </form>
  );
}

function FieldError({ msg }: { msg?: string }) {
  return (
    <p className="flex items-center gap-1.5 text-sm text-accent">
      <AlertCircle className="size-3.5" />
      {msg}
    </p>
  );
}
