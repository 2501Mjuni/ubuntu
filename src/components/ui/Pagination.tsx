"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function Pagination({ page, pageCount, onPageChange }: { page: number; pageCount: number; onPageChange: (p: number) => void }) {
  const t = useTranslations("common");
  if (pageCount <= 1) return null;
  const item = "flex size-11 items-center justify-center rounded-full text-sm font-semibold transition-colors";
  return (
    <nav aria-label={t("pagination")} className="flex items-center justify-center gap-1">
      <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label={t("previous")} className={cn(item, "hover:bg-surface disabled:opacity-40")}>
        <ChevronLeft className="size-5" aria-hidden />
      </button>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <button key={p} type="button" onClick={() => onPageChange(p)} aria-current={p === page ? "page" : undefined} aria-label={t("pageN", { n: p })}
          className={cn(item, p === page ? "bg-ubuntu text-white" : "hover:bg-surface")}>
          {p}
        </button>
      ))}
      <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= pageCount} aria-label={t("next")} className={cn(item, "hover:bg-surface disabled:opacity-40")}>
        <ChevronRight className="size-5" aria-hidden />
      </button>
    </nav>
  );
}
