import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const badge = cva("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold", {
  variants: {
    tone: {
      brand: "bg-chalk text-christalle",
      neutral: "bg-surface text-ink-muted",
      accent: "bg-ribbon/10 text-danger",
      success: "bg-success/10 text-success",
      dark: "bg-christalle text-white",
    },
  },
  defaultVariants: { tone: "brand" },
});

export function Badge({ className, tone, ...props }: ComponentProps<"span"> & VariantProps<typeof badge>) {
  return <span className={cn(badge({ tone }), className)} {...props} />;
}
