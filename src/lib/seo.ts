import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { siteUrl } from "./utils";

/** Path without locale, e.g. "/blog/my-post" ("" for the home page). */
export async function pageMetadata({ locale, path, namespace, title, description, absoluteTitle }: {
  locale: string; path: string; namespace?: string; title?: string; description?: string; absoluteTitle?: boolean;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const resolvedTitle = title ?? (namespace ? t(`${namespace}.title` as never) : t("defaultTitle"));
  const resolvedDescription = description ?? (namespace ? t(`${namespace}.description` as never) : t("defaultDescription"));
  const url = (l: string) => `${siteUrl}/${l}${path}`;
  return {
    // The layout's title template does not apply to a page in the same segment, so the home page opts out explicitly.
    title: absoluteTitle ? { absolute: t("defaultTitle") } : resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: url(locale), languages: { ...Object.fromEntries(routing.locales.map((l) => [l, url(l)])), "x-default": url(routing.defaultLocale) } },
    openGraph: { title: resolvedTitle, description: resolvedDescription, url: url(locale), locale: locale === "sw" ? "sw_TZ" : "en_TZ", type: "website" },
    twitter: { title: resolvedTitle, description: resolvedDescription },
  };
}
