import { z } from "zod";
import { serviceSlugs } from "@/types/api";

/*
 * Error messages are translation keys under the "validation" namespace.
 * Components translate them with t(message), so schemas stay locale-free.
 */
const required = "required";
const text = (max = 200) => z.string().trim().min(1, required).max(max, "tooLong");
const email = z.string().trim().min(1, required).email("email");
// Tanzanian numbers: +255 or 0 followed by 9 digits; spaces and dashes tolerated.
const phone = z
  .string()
  .trim()
  .min(1, required)
  .refine((v) => /^(\+?255|0)[1-9]\d{8}$/.test(v.replace(/[\s-]/g, "")), "phone");
const optionalNumber = z.preprocess(
  (v) => (v === "" || v === null || Number.isNaN(v) ? undefined : v),
  z.coerce.number().int("number").positive("number").max(100000, "number").optional(),
);
const consent = z.literal(true, { error: "consent" });
const antiSpam = { website: z.string().max(0).optional(), captchaToken: z.string().optional() };

export const hiringEnquirySchema = z.object({
  companyName: text(),
  contactName: text(),
  email,
  phone,
  roles: text(500),
  headcount: optionalNumber,
  message: z.string().trim().max(2000, "tooLong").optional(),
  consent,
  ...antiSpam,
});

export const quoteRequestSchema = z.object({
  service: z.enum(serviceSlugs.filter((s) => s !== "talent-acquisition") as [string, ...string[]], { error: required }),
  organisation: text(),
  name: text(),
  email,
  phone,
  participants: optionalNumber,
  preferredDate: z.string().optional(),
  details: z.string().trim().min(10, "tooShort").max(2000, "tooLong"),
  consent,
  ...antiSpam,
});

export const contactSchema = z.object({
  name: text(),
  email,
  phone: z.string().trim().optional(),
  subject: text(),
  message: z.string().trim().min(10, "tooShort").max(2000, "tooLong"),
  consent,
  ...antiSpam,
});

export const newsletterSchema = z.object({ email, ...antiSpam });

export type HiringEnquiryValues = z.input<typeof hiringEnquirySchema>;
export type QuoteRequestValues = z.input<typeof quoteRequestSchema>;
export type ContactValues = z.input<typeof contactSchema>;
export type NewsletterValues = z.input<typeof newsletterSchema>;

export const jobApplicationSchema = z.object({
  name: text(),
  email,
  phone,
  coverNote: z.string().trim().max(2000, "tooLong").optional(),
  consent,
  ...antiSpam,
});
export type JobApplicationValues = z.input<typeof jobApplicationSchema>;

export const eventRsvpSchema = z.object({ name: text(), email, phone, attendees: optionalNumber, consent, ...antiSpam });
export type EventRsvpValues = z.input<typeof eventRsvpSchema>;
