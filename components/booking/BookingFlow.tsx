"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft, Clock, Loader2, MapPin, Store, Car, AlertCircle } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { bookingSchema, STEP_FIELDS, VEHICLE_CONDITIONS, type BookingInput } from "@/lib/booking/schema";
import { createBooking } from "@/lib/booking/actions";
import { getAvailability, formatSlotLabel } from "@/lib/booking/availability";
import { businessConfig } from "@/lib/config/business";
import { getServiceBySlug, formatPrice, getServicePricing } from "@/lib/config/site";
import { cn } from "@/lib/utils";

type StepName = "service" | "vehicle" | "location" | "schedule" | "customer" | "review";

const STEP_META: Record<StepName, { label: string }> = {
  service: { label: "Service" },
  vehicle: { label: "Vehicle" },
  location: { label: "Location" },
  schedule: { label: "Date & time" },
  customer: { label: "Your details" },
  review: { label: "Review & deposit" },
};

const STORAGE_KEY = "sb_booking_draft";
const availability = getAvailability(21);

const DEFAULTS: BookingInput = {
  serviceSlug: "" as BookingInput["serviceSlug"],
  vehicle: { year: "", make: "", model: "", colour: "", condition: "" as never, notes: "" },
  location: { type: "shop", address: "" },
  date: "",
  time: "",
  customer: { name: "", email: "", phone: "" },
  company: "",
};

export function BookingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();

  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    mode: "onTouched",
    defaultValues: DEFAULTS,
  });

  const [stepIndex, setStepIndex] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const serviceSlug = form.watch("serviceSlug");
  const selectedService = serviceSlug ? getServiceBySlug(serviceSlug) : undefined;
  const requiresDeposit = Boolean(selectedService?.requiresDeposit);

  const steps: StepName[] = requiresDeposit
    ? ["service", "vehicle", "location", "schedule", "customer", "review"]
    : ["service", "vehicle", "location", "schedule", "customer"];
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];
  const isLast = stepIndex === steps.length - 1;

  // Hydrate from sessionStorage + preselect from ?service=
  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) form.reset({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    const preselect = searchParams.get("service");
    if (preselect && getServiceBySlug(preselect)) {
      form.setValue("serviceSlug", preselect as BookingInput["serviceSlug"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist draft to sessionStorage (debounced via subscription).
  React.useEffect(() => {
    const sub = form.watch((values) => {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      } catch {
        /* ignore */
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  function scrollTop() {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  async function next() {
    setServerError(null);
    const fields = STEP_FIELDS[currentStep as keyof typeof STEP_FIELDS];
    const valid = fields ? await form.trigger(fields as never) : true;
    if (!valid) return;
    if (isLast) {
      await submit();
      return;
    }
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    scrollTop();
  }

  function back() {
    setServerError(null);
    setStepIndex((i) => Math.max(i - 1, 0));
    scrollTop();
  }

  async function submit() {
    setSubmitting(true);
    setServerError(null);
    try {
      const values = form.getValues();
      const result = await createBooking(values);
      if (!result.ok) {
        setServerError(result.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      sessionStorage.removeItem(STORAGE_KEY);
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }
      if (result.confirmationUrl) {
        router.push(result.confirmationUrl);
        return;
      }
      setServerError("Booking created but no confirmation was returned.");
      setSubmitting(false);
    } catch {
      setServerError("We could not reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  const primaryLabel = isLast
    ? requiresDeposit
      ? "Pay deposit & confirm"
      : "Confirm booking"
    : "Continue";

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
      {/* minmax(0,1fr) (not a bare auto/1fr track) keeps the flexible column from
          growing to its content width, so the date strip's overflow-x-auto scrolls
          instead of stretching the page. grid-cols-1 does the same on mobile. */}
      <div className="min-w-0">
        <Stepper steps={steps} current={stepIndex} />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void next();
          }}
          className="mt-10"
          noValidate
        >
          {/* honeypot */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute left-[-9999px] h-0 w-0"
            {...form.register("company")}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={reduce ? false : { opacity: 0, x: 12 }}
              animate={reduce ? {} : { opacity: 1, x: 0 }}
              exit={reduce ? {} : { opacity: 0, x: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {currentStep === "service" && <ServiceStep form={form} />}
              {currentStep === "vehicle" && <VehicleStep form={form} />}
              {currentStep === "location" && <LocationStep form={form} />}
              {currentStep === "schedule" && <ScheduleStep form={form} />}
              {currentStep === "customer" && <CustomerStep form={form} />}
              {currentStep === "review" && selectedService && <ReviewStep form={form} />}
            </motion.div>
          </AnimatePresence>

          {serverError && (
            <p role="alert" className="mt-6 flex items-center gap-2 rounded-lg border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-bone">
              <AlertCircle className="size-4 shrink-0 text-accent" />
              {serverError}
            </p>
          )}

          <div className="mt-8 flex items-center justify-between gap-4">
            <Button type="button" variant="ghost" onClick={back} disabled={stepIndex === 0 || submitting}>
              <ChevronLeft className="size-4" />
              Back
            </Button>
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Processing
                </>
              ) : (
                primaryLabel
              )}
            </Button>
          </div>
        </form>
      </div>

      <BookingSummary service={selectedService} form={form} />
    </div>
  );
}

/* ------------------------------- Stepper -------------------------------- */
function Stepper({ steps, current }: { steps: StepName[]; current: number }) {
  const pct = (current / (steps.length - 1)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <p className="font-medium text-bone">{STEP_META[steps[current]].label}</p>
        <p className="text-bone-muted">
          Step {current + 1} of {steps.length}
        </p>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-3">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500"
          style={{ width: `${Math.max(8, pct)}%` }}
        />
      </div>
      <ol className="mt-4 hidden flex-wrap gap-x-5 gap-y-1 text-xs text-bone-muted sm:flex">
        {steps.map((s, i) => (
          <li key={s} className={cn("flex items-center gap-1.5", i <= current && "text-silver")}>
            {i < current ? <Check className="size-3.5 text-success" /> : <span>{i + 1}.</span>}
            {STEP_META[s].label}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------- Field ---------------------------------- */
function Field({
  label,
  htmlFor,
  error,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-accent"> *</span>}
      </Label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-sm text-accent">
          <AlertCircle className="size-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------------- Steps ---------------------------------- */
function StepHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-7">
      <h2 className="font-display text-2xl font-semibold text-bone">{title}</h2>
      <p className="mt-1.5 text-bone-muted">{description}</p>
    </div>
  );
}

function ServiceStep({ form }: { form: UseFormReturn<BookingInput> }) {
  const selected = form.watch("serviceSlug");
  const error = form.formState.errors.serviceSlug?.message;
  return (
    <fieldset>
      <StepHeading title="Choose your service" description="Select the detail you would like to book." />
      <div className="grid gap-3 sm:grid-cols-2">
        {businessConfig.services.map((s) => {
          const active = selected === s.slug;
          return (
            <button
              type="button"
              key={s.slug}
              onClick={() => {
                form.setValue("serviceSlug", s.slug as BookingInput["serviceSlug"], { shouldValidate: true });
              }}
              aria-pressed={active}
              className={cn(
                "flex flex-col items-start gap-2 rounded-xl border p-5 text-left transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                active ? "border-accent bg-accent-soft" : "border-line bg-ink-3 hover:border-line-strong",
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-display text-lg font-semibold text-bone">{s.name}</span>
                <span className={cn("flex size-5 items-center justify-center rounded-full border", active ? "border-accent bg-accent text-bone" : "border-line-strong")}>
                  {active && <Check className="size-3.5" />}
                </span>
              </div>
              <span className="text-sm text-bone-muted">{s.shortDescription}</span>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  from {formatPrice(getServicePricing(s).current, s.currency)}
                  {getServicePricing(s).isPromo && (
                    <span className="ml-1.5 opacity-60 line-through">
                      {formatPrice(getServicePricing(s).regular, s.currency)}
                    </span>
                  )}
                </Badge>
                {getServicePricing(s).isPromo && (
                  <Badge variant="accent">{getServicePricing(s).promo?.label}</Badge>
                )}
                {s.requiresDeposit && <Badge variant="accent">Deposit secures slot</Badge>}
              </div>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-accent">
          <AlertCircle className="size-3.5" />
          {error}
        </p>
      )}
    </fieldset>
  );
}

function VehicleStep({ form }: { form: UseFormReturn<BookingInput> }) {
  const { register, formState, control } = form;
  const e = formState.errors.vehicle;
  return (
    <fieldset>
      <StepHeading title="Tell us about your vehicle" description="This helps us prepare the right products and time." />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Year" htmlFor="v-year" required error={e?.year?.message}>
          <Input id="v-year" inputMode="numeric" placeholder="2021" {...register("vehicle.year")} aria-invalid={!!e?.year} />
        </Field>
        <Field label="Make" htmlFor="v-make" required error={e?.make?.message}>
          <Input id="v-make" placeholder="BMW" {...register("vehicle.make")} aria-invalid={!!e?.make} />
        </Field>
        <Field label="Model" htmlFor="v-model" required error={e?.model?.message}>
          <Input id="v-model" placeholder="M4" {...register("vehicle.model")} aria-invalid={!!e?.model} />
        </Field>
        <Field label="Colour" htmlFor="v-colour" required error={e?.colour?.message}>
          <Input id="v-colour" placeholder="Black Sapphire" {...register("vehicle.colour")} aria-invalid={!!e?.colour} />
        </Field>
        <Field label="Condition" required error={e?.condition?.message} className="sm:col-span-2">
          <Controller
            control={control}
            name="vehicle.condition"
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger aria-invalid={!!e?.condition}>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_CONDITIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="Notes (optional)" htmlFor="v-notes" error={e?.notes?.message} className="sm:col-span-2">
          <Textarea id="v-notes" placeholder="Anything we should know? Problem areas, pet hair, specific concerns..." {...register("vehicle.notes")} />
        </Field>
      </div>
    </fieldset>
  );
}

function LocationStep({ form }: { form: UseFormReturn<BookingInput> }) {
  const { control, register, watch, formState } = form;
  const type = watch("location.type");
  const addrError = formState.errors.location?.address?.message;
  return (
    <fieldset>
      <StepHeading title="Where should we detail it?" description="Bring it to the studio or let us come to you." />
      <Controller
        control={control}
        name="location.type"
        render={({ field }) => (
          <RadioGroup value={field.value} onValueChange={field.onChange} className="grid gap-3 sm:grid-cols-2">
            <label className={cn("flex cursor-pointer items-start gap-3 rounded-xl border p-5 transition-colors", type === "shop" ? "border-accent bg-accent-soft" : "border-line bg-ink-3 hover:border-line-strong")}>
              <RadioGroupItem value="shop" className="mt-0.5" />
              <span>
                <span className="flex items-center gap-2 font-medium text-bone">
                  <Store className="size-4 text-silver" /> Bring to shop
                </span>
                <span className="mt-1 block text-sm text-bone-muted">Our Hamilton studio with controlled lighting.</span>
              </span>
            </label>
            <label className={cn("flex cursor-pointer items-start gap-3 rounded-xl border p-5 transition-colors", type === "mobile" ? "border-accent bg-accent-soft" : "border-line bg-ink-3 hover:border-line-strong")}>
              <RadioGroupItem value="mobile" className="mt-0.5" />
              <span>
                <span className="flex items-center gap-2 font-medium text-bone">
                  <MapPin className="size-4 text-silver" /> Mobile service
                </span>
                <span className="mt-1 block text-sm text-bone-muted">We come to your home or workplace.</span>
              </span>
            </label>
          </RadioGroup>
        )}
      />
      {type === "mobile" && (
        <div className="mt-5">
          <Field label="Service address" htmlFor="addr" required error={addrError}>
            <Input id="addr" placeholder="Street, city, postal code" autoComplete="street-address" {...register("location.address")} aria-invalid={!!addrError} />
          </Field>
        </div>
      )}
    </fieldset>
  );
}

function ScheduleStep({ form }: { form: UseFormReturn<BookingInput> }) {
  const { watch, setValue, formState } = form;
  const date = watch("date");
  const time = watch("time");
  const day = availability.find((d) => d.date === date);
  return (
    <fieldset className="min-w-0">
      <StepHeading title="Pick a date and time" description={`Earliest availability respects our ${businessConfig.booking.minLeadTimeHours} hour lead time.`} />
      <p className="mb-2 text-sm font-medium text-bone">Date</p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {availability.map((d) => {
          const active = date === d.date;
          return (
            <button
              type="button"
              key={d.date}
              onClick={() => {
                setValue("date", d.date, { shouldValidate: true });
                setValue("time", "");
              }}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg border px-2 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                active ? "border-accent bg-accent-soft text-bone" : "border-line bg-ink-3 text-bone-muted hover:border-line-strong",
              )}
            >
              <span className="text-xs uppercase tracking-wide">{d.label.split(",")[0]}</span>
              <span className="font-medium text-bone">{d.label.split(", ")[1]}</span>
            </button>
          );
        })}
      </div>
      {formState.errors.date && <p className="mt-1 text-sm text-accent">{formState.errors.date.message}</p>}

      {day && (
        <div className="mt-6">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-bone">
            <Clock className="size-4 text-silver" /> Time
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {day.slots.map((slot) => {
              const active = time === slot;
              return (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setValue("time", slot, { shouldValidate: true })}
                  className={cn(
                    "rounded-lg border px-2 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    active ? "border-accent bg-accent-soft text-bone" : "border-line bg-ink-3 text-bone-muted hover:border-line-strong",
                  )}
                >
                  {formatSlotLabel(slot)}
                </button>
              );
            })}
          </div>
          {formState.errors.time && <p className="mt-2 text-sm text-accent">{formState.errors.time.message}</p>}
        </div>
      )}
    </fieldset>
  );
}

function CustomerStep({ form }: { form: UseFormReturn<BookingInput> }) {
  const { register, formState } = form;
  const e = formState.errors.customer;
  return (
    <fieldset>
      <StepHeading title="Your details" description="We will send your confirmation and reminders here." />
      <div className="grid gap-5">
        <Field label="Full name" htmlFor="c-name" required error={e?.name?.message}>
          <Input id="c-name" autoComplete="name" placeholder="Jordan Lee" {...register("customer.name")} aria-invalid={!!e?.name} />
        </Field>
        <Field label="Email" htmlFor="c-email" required error={e?.email?.message}>
          <Input id="c-email" type="email" autoComplete="email" placeholder="you@email.com" {...register("customer.email")} aria-invalid={!!e?.email} />
        </Field>
        <Field label="Phone" htmlFor="c-phone" required error={e?.phone?.message}>
          <Input id="c-phone" type="tel" autoComplete="tel" placeholder="(905) 555-0142" {...register("customer.phone")} aria-invalid={!!e?.phone} />
        </Field>
      </div>
    </fieldset>
  );
}

function ReviewStep({ form }: { form: UseFormReturn<BookingInput> }) {
  const v = form.getValues();
  const service = getServiceBySlug(v.serviceSlug);
  if (!service) return null;
  return (
    <fieldset>
      <StepHeading title="Review and secure your slot" description="Confirm the details below. Your deposit is fully refundable." />
      <div className="space-y-3 rounded-xl border border-line bg-ink-3 p-6 text-sm">
        <Row
          label="Service"
          value={`${service.name} · from ${formatPrice(getServicePricing(service).current, service.currency)}${
            getServicePricing(service).isPromo
              ? ` (was ${formatPrice(getServicePricing(service).regular, service.currency)})`
              : ""
          }`}
        />
        <Row label="Vehicle" value={`${v.vehicle.year} ${v.vehicle.make} ${v.vehicle.model} · ${v.vehicle.colour}`} />
        <Row label="Location" value={v.location.type === "mobile" ? `Mobile · ${v.location.address}` : "In-shop · Hamilton"} />
        <Row label="When" value={v.date ? `${v.date} at ${formatSlotLabel(v.time)}` : "—"} />
        <Row label="Contact" value={`${v.customer.name} · ${v.customer.email}`} />
      </div>

      <div className="mt-5 rounded-xl border border-accent/40 bg-accent-soft p-6">
        <div className="flex items-center justify-between">
          <p className="font-medium text-bone">Refundable deposit</p>
          <p className="font-display text-2xl font-semibold text-bone">{formatPrice(service.depositAmount, service.currency)}</p>
        </div>
        <p className="mt-2 text-sm text-bone-muted">{businessConfig.booking.depositExplanation}</p>
        <p className="mt-1 text-sm text-bone-muted">{businessConfig.booking.refundPolicy}</p>
      </div>
    </fieldset>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0">
      <span className="text-bone-muted">{label}</span>
      <span className="text-right font-medium text-bone">{value}</span>
    </div>
  );
}

/* --------------------------- Sticky summary ----------------------------- */
function BookingSummary({
  service,
  form,
}: {
  service: ReturnType<typeof getServiceBySlug>;
  form: UseFormReturn<BookingInput>;
}) {
  const date = form.watch("date");
  const time = form.watch("time");
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-xl border border-line bg-ink-2 p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-bone">
          <Car className="size-5 text-silver" /> Your booking
        </h2>
        <dl className="mt-5 space-y-3 text-sm">
          <SummaryRow label="Service" value={service?.name ?? "Not selected"} />
          <SummaryRow
            label="From"
            value={service ? formatPrice(getServicePricing(service).current, service.currency) : "—"}
          />
          {service && getServicePricing(service).isPromo && (
            <SummaryRow
              label={getServicePricing(service).promo?.label ?? "Promo"}
              value={`Save ${formatPrice(getServicePricing(service).savings, service.currency)}`}
              highlight
            />
          )}
          <SummaryRow label="Duration" value={service?.duration ?? "—"} />
          <SummaryRow label="When" value={date ? `${date}${time ? ` · ${formatSlotLabel(time)}` : ""}` : "—"} />
          {service?.requiresDeposit && (
            <SummaryRow label="Deposit" value={`${formatPrice(service.depositAmount, service.currency)} · refundable`} highlight />
          )}
        </dl>
        <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-bone-muted">
          {service?.requiresDeposit
            ? businessConfig.booking.refundPolicy
            : businessConfig.booking.cancellationPolicy}
        </p>
      </div>
    </aside>
  );
}

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-bone-muted">{label}</dt>
      <dd className={cn("text-right font-medium", highlight ? "text-bone" : "text-bone")}>{value}</dd>
    </div>
  );
}
