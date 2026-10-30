"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full min-h-11 rounded-md border border-line-strong bg-white px-4 py-2.5 text-base text-ink placeholder:text-ink-muted/70 transition-colors hover:border-ubuntu focus-visible:border-violet focus-visible:outline-3 focus-visible:outline-violet/40 aria-[invalid=true]:border-danger disabled:bg-surface disabled:opacity-70";

/** Label + control + hint + error. The error region is aria-live so screen readers announce it when it appears. */
export function Field({
  label, hint, error, required, children,
}: { label: string; hint?: string; error?: string; required?: boolean; children: (a: { id: string; describedBy?: string; invalid: boolean }) => ReactNode }) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
        {required && <span aria-hidden className="ml-0.5 text-danger">*</span>}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && <p id={hintId} className="text-xs text-ink-muted">{hint}</p>}
      <p id={errorId} role="status" aria-live="polite" className="min-h-0 text-sm font-medium text-danger empty:hidden">{error}</p>
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, className)} {...props} />;
}

export function Textarea({ className, rows = 5, ...props }: ComponentProps<"textarea">) {
  return <textarea rows={rows} className={cn(control, "resize-y", className)} {...props} />;
}

export interface Option { value: string; label: string }

export function Select({
  id, value, onValueChange, options, placeholder, invalid, describedBy, disabled, name,
}: { id?: string; value?: string; onValueChange: (v: string) => void; options: Option[]; placeholder?: string; invalid?: boolean; describedBy?: string; disabled?: boolean; name?: string }) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled} name={name}>
      <SelectPrimitive.Trigger id={id} aria-invalid={invalid} aria-describedby={describedBy} className={cn(control, "flex items-center justify-between text-left data-[placeholder]:text-ink-muted/70")}>
        <SelectPrimitive.Value placeholder={placeholder} />
        <ChevronDown className="size-4 text-ink-muted" aria-hidden />
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content position="popper" sideOffset={6} className="z-50 max-h-72 min-w-(--radix-select-trigger-width) overflow-hidden rounded-md border border-line bg-white shadow-lg">
          <SelectPrimitive.Viewport className="p-1.5">
            {options.map((o) => (
              <SelectPrimitive.Item key={o.value} value={o.value} className="relative flex min-h-10 cursor-pointer select-none items-center rounded-sm py-2 pr-3 pl-8 text-sm outline-none data-[highlighted]:bg-chalk/70 data-[state=checked]:font-semibold">
                <SelectPrimitive.ItemIndicator className="absolute left-2"><Check className="size-4 text-ubuntu" aria-hidden /></SelectPrimitive.ItemIndicator>
                <SelectPrimitive.ItemText>{o.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

export function Checkbox({ id, checked, onCheckedChange, invalid, describedBy, children }: { id?: string; checked: boolean; onCheckedChange: (v: boolean) => void; invalid?: boolean; describedBy?: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <CheckboxPrimitive.Root id={id} checked={checked} onCheckedChange={(v) => onCheckedChange(v === true)} aria-invalid={invalid} aria-describedby={describedBy}
        className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-sm border-2 border-line-strong bg-white transition-colors hover:border-ubuntu data-[state=checked]:border-ubuntu data-[state=checked]:bg-ubuntu aria-[invalid=true]:border-danger">
        <CheckboxPrimitive.Indicator><Check className="size-4 text-white" aria-hidden /></CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label htmlFor={id} className="text-sm leading-snug text-ink">{children}</label>
    </div>
  );
}
