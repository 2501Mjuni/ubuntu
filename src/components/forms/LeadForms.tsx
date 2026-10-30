"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { useContactMessage, useHiringEnquiry, useNewsletter, useQuoteRequest } from "@/lib/api/hooks";
import {
  contactSchema, hiringEnquirySchema, newsletterSchema, quoteRequestSchema,
  type ContactValues, type HiringEnquiryValues, type NewsletterValues, type QuoteRequestValues,
} from "@/lib/schemas/forms";
import { serviceSlugs, type ContactPayload, type HiringEnquiryPayload, type QuoteRequestPayload } from "@/types/api";
import { applyServerErrors, CaptchaSlot, ConsentField, Honeypot, SubmitError, SubmitRow, SuccessPanel, useErrorText } from "./FormParts";

function useFormTexts() {
  return { f: useTranslations("forms.fields"), forms: useTranslations("forms"), err: useErrorText() };
}

const quoteServices = serviceSlugs.filter((s) => s !== "talent-acquisition");

export function HiringEnquiryForm() {
  const { f, forms, err } = useFormTexts();
  const toast = useToast();
  const mutation = useHiringEnquiry();
  const [done, setDone] = useState(false);
  const { register, control, handleSubmit, setError, formState: { errors } } = useForm<HiringEnquiryValues, unknown, ReturnType<typeof hiringEnquirySchema.parse>>({
    resolver: zodResolver(hiringEnquirySchema), defaultValues: { website: "" },
  });
  const known = ["companyName", "contactName", "email", "phone", "roles", "headcount", "message", "website"];

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values as HiringEnquiryPayload);
      setDone(true);
      toast({ tone: "success", title: forms("successTitle") });
    } catch (e) {
      if (!applyServerErrors(e, setError, known)) toast({ tone: "error", title: forms("errorTitle"), description: forms("tryAgain") });
    }
  });

  if (done) return <SuccessPanel title={forms("successTitle")} text={forms("hire.success")} />;
  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={f("companyName")} required error={err(errors.companyName?.message)}>{(a) => <Input {...register("companyName")} autoComplete="organization" aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
        <Field label={f("contactName")} required error={err(errors.contactName?.message)}>{(a) => <Input {...register("contactName")} autoComplete="name" aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
        <Field label={f("email")} required error={err(errors.email?.message)}>{(a) => <Input type="email" {...register("email")} autoComplete="email" aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
        <Field label={f("phone")} hint={f("phoneHint")} required error={err(errors.phone?.message)}>{(a) => <Input type="tel" {...register("phone")} autoComplete="tel" aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
      </div>
      <Field label={f("roles")} hint={f("rolesHint")} required error={err(errors.roles?.message)}>{(a) => <Input {...register("roles")} aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
      <Field label={f("headcount")} error={err(errors.headcount?.message)}>{(a) => <Input type="number" inputMode="numeric" min={1} {...register("headcount")} aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
      <Field label={f("message")} error={err(errors.message?.message)}>{(a) => <Textarea {...register("message")} aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
      <ConsentField control={control} error={err(errors.consent?.message)} />
      <Honeypot register={() => register("website")} />
      <CaptchaSlot />
      <SubmitError show={mutation.isError && !Object.keys(errors).length} />
      <SubmitRow pending={mutation.isPending}>{forms("hire.submit")}</SubmitRow>
    </form>
  );
}

export function QuoteRequestForm({ defaultService }: { defaultService?: string }) {
  const { f, forms, err } = useFormTexts();
  const names = useTranslations("services.names");
  const toast = useToast();
  const mutation = useQuoteRequest();
  const [done, setDone] = useState(false);
  const { register, control, handleSubmit, setError, formState: { errors } } = useForm<QuoteRequestValues, unknown, ReturnType<typeof quoteRequestSchema.parse>>({
    resolver: zodResolver(quoteRequestSchema), defaultValues: { website: "", service: quoteServices.includes(defaultService as never) ? defaultService : undefined },
  });
  const known = ["service", "organisation", "name", "email", "phone", "participants", "preferredDate", "details", "website"];

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values as QuoteRequestPayload);
      setDone(true);
      toast({ tone: "success", title: forms("successTitle") });
    } catch (e) {
      if (!applyServerErrors(e, setError, known)) toast({ tone: "error", title: forms("errorTitle"), description: forms("tryAgain") });
    }
  });

  if (done) return <SuccessPanel title={forms("successTitle")} text={forms("quote.success")} />;
  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-5">
      <Field label={f("service")} required error={err(errors.service?.message)}>
        {(a) => (
          <Controller control={control} name="service" render={({ field }) => (
            <Select id={a.id} value={field.value} onValueChange={field.onChange} invalid={a.invalid} describedBy={a.describedBy} placeholder={f("servicePlaceholder")} options={quoteServices.map((s) => ({ value: s, label: names(s) }))} />
          )} />
        )}
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={f("organisation")} required error={err(errors.organisation?.message)}>{(a) => <Input {...register("organisation")} autoComplete="organization" aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
        <Field label={f("name")} required error={err(errors.name?.message)}>{(a) => <Input {...register("name")} autoComplete="name" aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
        <Field label={f("email")} required error={err(errors.email?.message)}>{(a) => <Input type="email" {...register("email")} autoComplete="email" aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
        <Field label={f("phone")} hint={f("phoneHint")} required error={err(errors.phone?.message)}>{(a) => <Input type="tel" {...register("phone")} autoComplete="tel" aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
        <Field label={f("participants")} error={err(errors.participants?.message)}>{(a) => <Input type="number" inputMode="numeric" min={1} {...register("participants")} aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
        <Field label={f("preferredDate")} error={err(errors.preferredDate?.message)}>{(a) => <Input type="date" {...register("preferredDate")} aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
      </div>
      <Field label={f("details")} required error={err(errors.details?.message)}>{(a) => <Textarea {...register("details")} aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
      <ConsentField control={control} error={err(errors.consent?.message)} />
      <Honeypot register={() => register("website")} />
      <CaptchaSlot />
      <SubmitError show={mutation.isError && !Object.keys(errors).length} />
      <SubmitRow pending={mutation.isPending}>{forms("quote.submit")}</SubmitRow>
    </form>
  );
}

export function ContactForm() {
  const { f, forms, err } = useFormTexts();
  const t = useTranslations("contact");
  const toast = useToast();
  const mutation = useContactMessage();
  const [done, setDone] = useState(false);
  const { register, control, handleSubmit, setError, formState: { errors } } = useForm<ContactValues, unknown, ReturnType<typeof contactSchema.parse>>({
    resolver: zodResolver(contactSchema), defaultValues: { website: "" },
  });
  const known = ["name", "email", "phone", "subject", "message", "website"];

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values as ContactPayload);
      setDone(true);
      toast({ tone: "success", title: forms("successTitle") });
    } catch (e) {
      if (!applyServerErrors(e, setError, known)) toast({ tone: "error", title: forms("errorTitle"), description: forms("tryAgain") });
    }
  });

  if (done) return <SuccessPanel title={forms("successTitle")} text={t("success")} />;
  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={f("name")} required error={err(errors.name?.message)}>{(a) => <Input {...register("name")} autoComplete="name" aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
        <Field label={f("email")} required error={err(errors.email?.message)}>{(a) => <Input type="email" {...register("email")} autoComplete="email" aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
        <Field label={f("phone")} hint={f("phoneHint")} error={err(errors.phone?.message)}>{(a) => <Input type="tel" {...register("phone")} autoComplete="tel" aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
        <Field label={f("subject")} required error={err(errors.subject?.message)}>{(a) => <Input {...register("subject")} aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
      </div>
      <Field label={f("contactMessage")} required error={err(errors.message?.message)}>{(a) => <Textarea {...register("message")} aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
      <ConsentField control={control} error={err(errors.consent?.message)} />
      <Honeypot register={() => register("website")} />
      <CaptchaSlot />
      <SubmitError show={mutation.isError && !Object.keys(errors).length} />
      <SubmitRow pending={mutation.isPending}>{forms("submit")}</SubmitRow>
    </form>
  );
}

export function NewsletterForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const t = useTranslations("newsletter");
  const err = useErrorText();
  const mutation = useNewsletter();
  const [done, setDone] = useState(false);
  const locale = useLocale();
  const { register, handleSubmit, setError, formState: { errors } } = useForm<NewsletterValues, unknown, ReturnType<typeof newsletterSchema.parse>>({
    resolver: zodResolver(newsletterSchema), defaultValues: { website: "" },
  });
  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values);
      setDone(true);
    } catch (e) {
      applyServerErrors(e, setError, ["email", "website"]);
    }
  });

  if (done) return <p role="status" className={tone === "dark" ? "text-white" : "text-ink"}>{t("success")}</p>;
  return (
    <form onSubmit={onSubmit} noValidate lang={locale} className="relative space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">{t("label")}</label>
          <Input id="newsletter-email" type="email" autoComplete="email" placeholder={t("placeholder")} aria-invalid={Boolean(errors.email)} aria-describedby="newsletter-error" {...register("email")} />
        </div>
        <SubmitRow pending={mutation.isPending} variant={tone === "dark" ? "light" : undefined}>{t("button")}</SubmitRow>
      </div>
      <p id="newsletter-error" role="status" aria-live="polite" className={`text-sm font-medium empty:hidden ${tone === "dark" ? "text-chalk" : "text-danger"}`}>
        {err(errors.email?.message) ?? (mutation.isError && !errors.email ? t("error") : undefined)}
      </p>
      <Honeypot register={() => register("website")} />
      <CaptchaSlot />
    </form>
  );
}

