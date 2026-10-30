"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { QueryBoundary } from "@/components/ui/DataState";
import { Skeleton } from "@/components/ui/Skeleton";
import { usePartners } from "@/lib/api/hooks";

export function PartnersStrip() {
  const t = useTranslations("home.partners");
  const query = usePartners();
  return (
    <QueryBoundary query={query} isEmpty={(r) => r.data.length === 0} skeleton={<div className="flex flex-wrap justify-center gap-4">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-14 w-32" />)}</div>}>
      {(r) => (
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          {r.data.map((p) => (
            <li key={p.id} className="flex h-16 min-w-36 items-center justify-center px-5 text-lg font-bold tracking-tight text-ink-muted">
              {p.logoUrl ? <Image src={p.logoUrl} alt={p.name} width={140} height={48} className="h-10 w-auto object-contain" /> : <span title={t("logoPlaceholder")}>{p.name}</span>}
            </li>
          ))}
        </ul>
      )}
    </QueryBoundary>
  );
}
