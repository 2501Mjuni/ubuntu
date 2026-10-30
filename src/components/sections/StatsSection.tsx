"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { QueryBoundary } from "@/components/ui/DataState";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCounter } from "@/components/ui/StatCounter";
import { useStats } from "@/lib/api/hooks";

export function StatsSection() {
  const t = useTranslations("home.stats");
  const query = useStats();
  return (
    <section aria-labelledby="stats-title" className="impact-stats bg-christalle py-12">
      <Container>
        <h2 id="stats-title" className="sr-only">{t("title")}</h2>
        <QueryBoundary
          query={query}
          skeleton={<div className="stats-grid grid grid-cols-2 gap-8 md:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="mx-auto h-16 w-32 bg-none bg-white/15" />)}</div>}
        >
          {(s) => (
            <div className="stats-grid grid grid-cols-2 gap-8 md:grid-cols-4">
              <StatCounter value={s.placedCandidates} suffix="+" label={t("placedCandidates")} />
              <StatCounter value={s.activeJobs} label={t("activeJobs")} />
              <StatCounter value={s.clientCompanies} suffix="+" label={t("clientCompanies")} />
              <StatCounter value={s.yearsExperience} suffix="+" label={t("yearsExperience")} />
            </div>
          )}
        </QueryBoundary>
      </Container>
    </section>
  );
}
