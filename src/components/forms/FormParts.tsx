"use client";

import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useId } from "react";
import { Controller, type Control, type FieldErrors, type FieldValues, type Path, type UseFormSetError } from "react-hook-form";
import { Checkbox } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api/client";

/** Translates a validation message key (from zod or the server). Unknown values are shown as sent. */
export function useErrorText() {
  const t = useTranslations("validation");
  return (message?: string) => (message ? (t.has(message as never) ? t(message as never) : message) : undefined);
}

/** Hidden trap for bots: real users never see or fill it. Submissions with a value are rejected. */
export function Honeypot({ register }: { register: () => object }) {
  const t = useTranslations("forms");
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>{t("honeypot")}<input type="text" tabIndex={-1} autoComplete="off" {...register()} /></label>
    </div>
  );
}

/** Slot for a CAPTCHA widget. It writes its token to the form's `captchaToken` field when integrated. */
export function CaptchaSlot() {
  const t = useTranslations("forms");
  return <div data-captcha-slot className="sr-only">{t("captchaNote")}</div>;
}

export function SubmitRow({ pending, children, variant }: { pending: boolean; children: ReactNode; variant?: "light" }) {
  const t = useTranslations("forms");
  return (
    <Button type="submit" size="lg" variant={variant} disabled={pending} aria-busy={pending} className="w-full sm:w-auto">
      {pending ? t("sending") : children}
    </Button>
  );
}

export function SubmitError({ show }: { show: boolean }) {
  const t = useTranslations("forms");
  return show ? <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">{t("tryAgain")}</p> : null;
}

export function SuccessPanel({ title, text }: { title: string; text: string }) {
  return (
    <div role="status" className="flex items-start gap-4 rounded-lg border border-success/30 bg-success/5 p-6">
      <CheckCircle2 className="size-7 shrink-0 text-success" aria-hidden />
      <div>
        <p className="text-lg font-bold text-ink">{title}</p>
        <p className="mt-1 text-ink-muted">{text}</p>
      </div>
    </div>
  );
}

/** Copies server-side field errors (422) onto the matching inputs. Returns true when any were applied. */
export function applyServerErrors<T extends FieldValues>(error: unknown, setError: UseFormSetError<T>, known: string[]): boolean {
  if (!(error instanceof ApiError) || error.status !== 422) return false;
  let applied = false;
  for (const [field, messages] of Object.entries(error.fields)) {
    if (known.includes(field)) {
      setError(field as Path<T>, { type: "server", message: messages[0] });
      applied = true;
    }
  }
  return applied;
}

export const firstError = <T extends FieldValues>(errors: FieldErrors<T>, name: Path<T>) => errors[name]?.message as string | undefined;

/** Required consent checkbox bound to the form's `consent` field. */
export function ConsentField<TIn extends FieldValues, TOut extends FieldValues>({ control, error }: { control: Control<TIn, unknown, TOut>; error?: string }) {
  const t = useTranslations("forms");
  const id = useId();
  return (
    <div className="space-y-1.5">
      <Controller
        control={control}
        name={"consent" as Path<TIn>}
        render={({ field }) => (
          <Checkbox id={id} checked={field.value === true} onCheckedChange={field.onChange} invalid={Boolean(error)} describedBy={`${id}-error`}>{t("consent")}</Checkbox>
        )}
      />
      <p id={`${id}-error`} role="status" aria-live="polite" className="text-sm font-medium text-danger empty:hidden">{error}</p>
    </div>
  );
}
