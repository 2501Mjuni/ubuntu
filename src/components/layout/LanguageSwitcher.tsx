"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const labels = { en: "English", sw: "Kiswahili" } as const;

export function LanguageSwitcher({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const t = useTranslations("common");
  const current = useLocale();
  const pathname = usePathname();
  return (
    <div className={cn("flex items-center gap-1", className)} role="group" aria-label={t("language")}>
      <Languages className={cn("mr-1 size-4", tone === "light" ? "text-white/80" : "text-ink-muted")} aria-hidden />
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          hrefLang={locale}
          lang={locale}
          aria-current={locale === current ? "true" : undefined}
          aria-label={locale === current ? labels[locale] : t("switchTo", { language: labels[locale] })}
          className={cn(
            "flex min-h-11 min-w-11 items-center justify-center rounded-md px-2 text-sm font-bold uppercase transition-colors",
            tone === "light"
              ? locale === current ? "bg-white text-christalle" : "text-white hover:bg-white/10"
              : locale === current ? "bg-surface text-christalle" : "text-ubuntu hover:bg-surface",
          )}
        >
          {locale}
        </Link>
      ))}
    </div>
  );
}
