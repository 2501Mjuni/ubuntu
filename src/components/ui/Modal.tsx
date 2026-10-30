"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

export function Modal({ open, onOpenChange, title, description, children }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; description?: string; children: ReactNode }) {
  const t = useTranslations("common");
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-christalle/60 backdrop-blur-sm data-[state=open]:motion-safe:animate-[fade-in_150ms]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="pr-10 text-xl font-bold text-christalle">{title}</Dialog.Title>
          {description ? <Dialog.Description className="mt-1 text-sm text-ink-muted">{description}</Dialog.Description> : <Dialog.Description className="sr-only">{title}</Dialog.Description>}
          <div className="mt-5">{children}</div>
          <Dialog.Close aria-label={t("close")} className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full hover:bg-surface"><X className="size-5" aria-hidden /></Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
