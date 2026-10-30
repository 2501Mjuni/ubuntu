import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeader({ eyebrow, title, description, align = "left", tone = "light", action, as: Heading = "h2" }: {
  eyebrow?: string; title: string; description?: string; align?: "left" | "center"; tone?: "light" | "dark"; action?: ReactNode; as?: "h1" | "h2";
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", align === "center" && "justify-center text-center")}>
      <div className={cn("max-w-2xl space-y-3", align === "center" && "mx-auto")}>
        {eyebrow && <p className={cn("eyebrow", tone === "dark" ? "text-chalk" : "text-violet")}>{eyebrow}</p>}
        <Heading className={cn("section-title text-3xl font-bold md:text-4xl", tone === "dark" ? "text-white" : "text-christalle")}>{title}</Heading>
        {description && <p className={cn("text-lg", tone === "dark" ? "text-white/80" : "text-ink-muted")}>{description}</p>}
      </div>
      {action}
    </div>
  );
}
