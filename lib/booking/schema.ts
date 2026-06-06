import { z } from "zod";
import { businessConfig } from "@/lib/config/business";

const serviceSlugs = businessConfig.services.map((s) => s.slug) as [string, ...string[]];

export const VEHICLE_CONDITIONS = ["Excellent", "Good", "Fair", "Needs work"] as const;

export const bookingSchema = z.object({
  serviceSlug: z.enum(serviceSlugs, { message: "Please choose a service." }),
  vehicle: z.object({
    year: z
      .string()
      .trim()
      .regex(/^(19|20)\d{2}$/, "Enter a valid year."),
    make: z.string().trim().min(1, "Make is required.").max(40),
    model: z.string().trim().min(1, "Model is required.").max(40),
    colour: z.string().trim().min(1, "Colour is required.").max(30),
    condition: z.enum(VEHICLE_CONDITIONS, { message: "Select the condition." }),
    notes: z.string().trim().max(600).optional().or(z.literal("")),
  }),
  location: z
    .object({
      type: z.enum(["shop", "mobile"], { message: "Choose a location." }),
      address: z.string().trim().max(160).optional().or(z.literal("")),
    })
    .refine((v) => v.type === "shop" || (v.address && v.address.length >= 5), {
      message: "Enter the service address for mobile detailing.",
      path: ["address"],
    }),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date."),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Choose a time."),
  customer: z.object({
    name: z.string().trim().min(2, "Enter your full name.").max(80),
    email: z.string().trim().email("Enter a valid email."),
    phone: z
      .string()
      .trim()
      .min(10, "Enter a valid phone number.")
      .max(24)
      .regex(/^[+(\d][\d\s().+-]{8,}$/, "Enter a valid phone number."),
  }),
  // Honeypot — must stay empty.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type BookingInput = z.infer<typeof bookingSchema>;

/** Field paths grouped by wizard step, used for per-step validation. */
export const STEP_FIELDS = {
  service: ["serviceSlug"],
  vehicle: ["vehicle.year", "vehicle.make", "vehicle.model", "vehicle.colour", "vehicle.condition", "vehicle.notes"],
  location: ["location.type", "location.address"],
  schedule: ["date", "time"],
  customer: ["customer.name", "customer.email", "customer.phone"],
} as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  service: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a little more.").max(1500),
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
