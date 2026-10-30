"use client";

import { useTranslations } from "next-intl";
import { QueryBoundary } from "@/components/ui/DataState";
import { JobCard } from "@/components/ui/JobCard";
import { CardSkeleton } from "@/components/ui/Skeletons";
import { useFeaturedJobs } from "@/lib/api/hooks";

export function FeaturedJobs() {
  const t = useTranslations("home.jobs");
  const query = useFeaturedJobs();
  return (
    <QueryBoundary
      query={query}
      isEmpty={(r) => r.data.length === 0}
      skeleton={<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }, (_, i) => <CardSkeleton key={i} />)}</div>}
      empty={{ title: t("emptyTitle"), description: t("emptyDescription") }}
    >
      {(r) => <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{r.data.map((job) => <li key={job.id}><JobCard job={job} /></li>)}</ul>}
    </QueryBoundary>
  );
}
