"use client";

import { useSearchParams } from "next/navigation";
import { QuoteRequestForm } from "./LeadForms";

/** Pre-selects the service from ?service=... (service pages link here). */
export function QuoteFormWithParams() {
  return <QuoteRequestForm defaultService={useSearchParams().get("service") ?? undefined} />;
}
