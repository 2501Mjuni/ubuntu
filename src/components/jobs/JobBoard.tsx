"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState, ErrorState } from "@/components/ui/DataState";
import { Input } from "@/components/ui/Field";
import { Pagination } from "@/components/ui/Pagination";
import { CardSkeleton } from "@/components/ui/Skeletons";
import { JobCard } from "@/components/ui/JobCard";
import { useJobFacets, useJobs, type JobFilters } from "@/lib/api/hooks";
import { cn } from "@/lib/utils";
import type { Job, JobSort } from "@/types/api";
import { JobDrawer } from "./JobDrawer";

const types = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "CONSULTANCY"];
const levels = ["JUNIOR", "INTERMEDIATE", "SENIOR"];

/** Multi-select chip group. Values are stored comma separated, which is what the API expects. */
function Chips({ label, options, value, onChange }: { label: string; options: { value: string; label: string }[]; value?: string; onChange: (v?: string) => void }) {
  const selected = (value ?? "").split(",").filter(Boolean);
  const toggle = (v: string) => {
    const next = selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v];
    onChange(next.length ? next.join(",") : undefined);
  };
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-bold tracking-widest text-violet uppercase">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o.value} type="button" aria-pressed={selected.includes(o.value)} onClick={() => toggle(o.value)}
            className={cn("min-h-9 rounded-full border px-3.5 text-sm font-semibold transition-colors", selected.includes(o.value) ? "border-violet bg-violet text-white" : "border-line-strong bg-white text-christalle hover:border-violet")}>
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function JobBoard() {
  const t = useTranslations("jobBoard");
  const jt = useTranslations("jobs");
  const format = useFormatter();
  const [filters, setFilters] = useState<JobFilters>({ sort: "newest", page: 1 });
  const [text, setText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [open, setOpen] = useState<Job | null>(null);
  const facets = useJobFacets();
  const jobs = useJobs(filters);

  // Debounce the search box so we do not request on every keystroke.
  useEffect(() => {
    const id = setTimeout(() => setFilters((f) => (f.q === (text || undefined) ? f : { ...f, q: text || undefined, page: 1 })), 300);
    return () => clearTimeout(id);
  }, [text]);

  // Deep link: ?job=slug opens that job once.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("job");
    if (!slug) return;
    let alive = true;
    void import("@/lib/api/endpoints").then(({ api }) => {
      const lang = document.documentElement.lang === "sw" ? "sw" : "en";
      return api.jobs({ lang, q: slug.replace(/-/g, " ") }).then((r) => alive && setOpen(r.data.find((j) => j.slug === slug) ?? null)).catch(() => undefined);
    });
    return () => { alive = false; };
  }, []);

  const set = (patch: Partial<JobFilters>) => setFilters((f) => ({ ...f, ...patch, page: 1 }));
  const active = [filters.jobType, filters.careerLevel, filters.location, filters.industry].filter(Boolean).length;
  const clear = () => { setText(""); setFilters({ sort: filters.sort, page: 1 }); };
  const pageCount = jobs.data ? Math.max(1, Math.ceil(jobs.data.meta.total / jobs.data.meta.pageSize)) : 1;
  const opt = (xs: string[] = []) => xs.map((x) => ({ value: x, label: x }));

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-line bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-ink-muted" aria-hidden />
            <Input type="search" aria-label={t("searchLabel")} placeholder={t("searchPlaceholder")} value={text} onChange={(e) => setText(e.target.value)} className="pl-11" />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-christalle">
            <span className="whitespace-nowrap">{t("sortBy")}</span>
            <select value={filters.sort} onChange={(e) => set({ sort: e.target.value as JobSort })} className="min-h-11 rounded-md border border-line-strong bg-white px-3 text-sm">
              {(["newest", "deadline", "salary"] as const).map((s) => <option key={s} value={s}>{t(`sort.${s}`)}</option>)}
            </select>
          </label>
          <Button variant="secondary" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters} aria-controls="job-filters">
            <SlidersHorizontal aria-hidden />{t("filters")}{active > 0 && <span className="rounded-full bg-violet px-2 text-xs text-white">{active}</span>}
          </Button>
        </div>
        {showFilters && (
          <div id="job-filters" className="mt-5 grid gap-5 border-t border-line pt-5 md:grid-cols-2">
            <Chips label={t("type")} options={types.map((v) => ({ value: v, label: jt(`types.${v}` as never) }))} value={filters.jobType} onChange={(v) => set({ jobType: v })} />
            <Chips label={t("level")} options={levels.map((v) => ({ value: v, label: jt(`levels.${v}` as never) }))} value={filters.careerLevel} onChange={(v) => set({ careerLevel: v })} />
            <Chips label={t("location")} options={opt(facets.data?.locations)} value={filters.location} onChange={(v) => set({ location: v })} />
            <Chips label={t("industry")} options={opt(facets.data?.industries)} value={filters.industry} onChange={(v) => set({ industry: v })} />
          </div>
        )}
      </div>

      <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="font-semibold text-christalle">{jobs.data ? t("results", { count: jobs.data.meta.total }) : " "}</p>
        {(active > 0 || text) && <Button variant="ghost" size="sm" onClick={clear}><X aria-hidden />{t("clear")}</Button>}
      </div>

      {jobs.isPending ? (
        <div aria-busy="true" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}</div>
      ) : jobs.isError || !jobs.data ? (
        <ErrorState onRetry={() => void jobs.refetch()} retrying={jobs.isFetching} />
      ) : jobs.data.data.length === 0 ? (
        <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} />
      ) : (
        <ul className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3 transition-opacity", jobs.isPlaceholderData && "opacity-60")}>
          {jobs.data.data.map((job) => (
            <li key={job.id} className="relative">
              <JobCard job={job} />
              <p className="sr-only">{t("posted", { date: format.dateTime(new Date(job.postedAt), { dateStyle: "medium" }) })}</p>
              <button type="button" onClick={() => setOpen(job)} className="absolute inset-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet" aria-label={`${t("view")}: ${job.title}`} />
            </li>
          ))}
        </ul>
      )}
      {pageCount > 1 && <Pagination page={filters.page ?? 1} pageCount={pageCount} onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))} />}
      <JobDrawer job={open} onClose={() => setOpen(null)} />
    </div>
  );
}
