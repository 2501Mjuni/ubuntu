import { Briefcase, Clock, MapPin } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import type { Job } from "@/types/api";
import { Badge } from "./Badge";
import { Card } from "./Card";

export function JobCard({ job }: { job: Job }) {
  const t = useTranslations("jobs");
  const format = useFormatter();
  return (
    <Card className="job-card flex h-full flex-col gap-4 transition-all hover:border-line-strong hover:shadow-md">
      <div className="flex flex-wrap gap-2">
        <Badge>{t(`types.${job.jobType}`)}</Badge>
        <Badge tone="neutral">{t(`levels.${job.careerLevel}`)}</Badge>
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-christalle">{job.title}</h3>
        <p className="text-sm font-medium text-ink-muted">{job.companyName ?? t("confidential")} · {job.industry}</p>
      </div>
      <p className="text-ink-muted">{job.summary}</p>
      <ul className="mt-auto space-y-1.5 text-sm text-ink-muted">
        <li className="flex items-center gap-2"><MapPin className="size-4 text-violet" aria-hidden />{job.location}</li>
        <li className="flex items-center gap-2">
          <Briefcase className="size-4 text-violet" aria-hidden />
          {job.salaryRange ? `${format.number(job.salaryRange.min)} – ${format.number(job.salaryRange.max)} ${job.salaryRange.currency}` : t("competitive")}
        </li>
        {job.deadline && (
          <li className="flex items-center gap-2"><Clock className="size-4 text-violet" aria-hidden />{t("closes", { date: format.dateTime(new Date(job.deadline), { dateStyle: "medium" }) })}</li>
        )}
      </ul>
    </Card>
  );
}
