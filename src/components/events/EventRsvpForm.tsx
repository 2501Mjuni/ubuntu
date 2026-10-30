"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { applyServerErrors, CaptchaSlot, ConsentField, Honeypot, SubmitError, SubmitRow, SuccessPanel, useErrorText } from "@/components/forms/FormParts";
import { Field, Input } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { useEventRsvp } from "@/lib/api/hooks";
import { eventRsvpSchema, type EventRsvpValues } from "@/lib/schemas/forms";
import type { EventRsvpPayload } from "@/types/api";

export function EventRsvpForm({ slug }: { slug: string }) {
  const f = useTranslations("forms.fields");
  const forms = useTranslations("forms");
  const t = useTranslations("eventsPage");
  const err = useErrorText();
  const toast = useToast();
  const mutation = useEventRsvp(slug);
  const [done, setDone] = useState(false);
  const { register, control, handleSubmit, setError, formState: { errors } } = useForm<EventRsvpValues, unknown, ReturnType<typeof eventRsvpSchema.parse>>({
    resolver: zodResolver(eventRsvpSchema), defaultValues: { website: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values as EventRsvpPayload);
      setDone(true);
      toast({ tone: "success", title: t("done") });
    } catch (e) {
      if (!applyServerErrors(e, setError, ["name", "email", "phone", "attendees", "website"])) toast({ tone: "error", title: forms("errorTitle"), description: forms("tryAgain") });
    }
  });

  if (done) return <SuccessPanel title={t("done")} text={t("doneText")} />;
  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-4">
      <Field label={f("name")} required error={err(errors.name?.message)}>{(a) => <Input {...register("name")} autoComplete="name" aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
      <Field label={f("email")} required error={err(errors.email?.message)}>{(a) => <Input type="email" {...register("email")} autoComplete="email" aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
      <Field label={f("phone")} hint={f("phoneHint")} required error={err(errors.phone?.message)}>{(a) => <Input type="tel" {...register("phone")} autoComplete="tel" aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
      <Field label={t("attendees")} error={err(errors.attendees?.message)}>{(a) => <Input type="number" inputMode="numeric" min={1} {...register("attendees")} aria-invalid={a.invalid} aria-describedby={a.describedBy} id={a.id} />}</Field>
      <ConsentField control={control} error={err(errors.consent?.message)} />
      <Honeypot register={() => register("website")} />
      <CaptchaSlot />
      <SubmitError show={mutation.isError && !Object.keys(errors).length} />
      <SubmitRow pending={mutation.isPending}>{t("submit")}</SubmitRow>
    </form>
  );
}
