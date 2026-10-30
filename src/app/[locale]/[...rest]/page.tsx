import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

// Unmatched URLs under a locale land here so they render the localized 404 page.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale, rest: ["not-found"] }));
}

export default function CatchAll() {
  notFound();
}
