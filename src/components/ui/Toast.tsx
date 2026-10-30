"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface ToastItem { id: number; title: string; description?: string; tone: "success" | "error" }
const ToastContext = createContext<(t: Omit<ToastItem, "id">) => void>(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("common");
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((item: Omit<ToastItem, "id">) => setItems((all) => [...all, { ...item, id: Date.now() + Math.random() }]), []);
  const value = useMemo(() => push, [push]);
  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider duration={6000} label={t("notifications")}>
        {children}
        {items.map((i) => (
          <ToastPrimitive.Root key={i.id} onOpenChange={(open) => !open && setItems((all) => all.filter((x) => x.id !== i.id))}
            className={`flex items-start gap-3 rounded-lg border bg-white p-4 shadow-lg data-[state=open]:motion-safe:animate-[fade-in_200ms] ${i.tone === "error" ? "border-danger" : "border-success"}`}>
            <div className="flex-1">
              <ToastPrimitive.Title className="font-semibold text-ink">{i.title}</ToastPrimitive.Title>
              {i.description && <ToastPrimitive.Description className="mt-0.5 text-sm text-ink-muted">{i.description}</ToastPrimitive.Description>}
            </div>
            <ToastPrimitive.Close aria-label={t("close")} className="flex size-8 items-center justify-center rounded-full hover:bg-surface"><X className="size-4" aria-hidden /></ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed right-0 bottom-0 z-[60] flex w-full max-w-sm flex-col gap-2 p-4 outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
