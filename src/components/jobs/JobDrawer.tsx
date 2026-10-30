"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Briefcase, CalendarClock, Link2, MapPin, X } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import type { Job } from "@/types/api";
import { JobApplyForm } from "./JobApplyForm";

export function JobDrawer({ job, onClose }: { job: Job | null; onClose: () => void }) {
  const t = useTranslations("jobBoard");
  const jt = useTranslations("jobs");
  const common = useTranslations("common");
  const format = useFormatter();
  const toast = useToast();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?job=${job?.slug}`);
      toast({ tone: "success", title: t("copied") });
    } catch {
      /* clipboard unavailable: ignore */
    }
  };

  return (
    <Dialog.Root open={job !== null} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-christalle/60 backdrop-blur-sm data-[state=open]:motion-safe:animate-[fade-in_150ms]" />
        <Dialog.Content className="drawer fixed inset-y-0 right-0 z-50 w-full max-w-xl overflow-y-auto bg-white shadow-lg">
          {job && (
            <div className="space-y-6 p-6 sm:p-8">
              <div className="space-y-3 pr-10">
                <div className="flex flex-wrap gap-2"><Badge>{jt(`types.${job.jobType}`)}</Badge><Badge tone="neutral">{jt(`levels.${job.careerLevel}`)}</Badge></div>
                <Dialog.Title className="text-2xl font-bold text-christalle">{job.title}</Dialog.Title>
                <Dialog.Description className="text-ink-muted">{job.companyName ?? jt("confidential")} · {job.industry}</Dialog.Description>
              </div>
              <ul className="grid gap-2 rounded-lg bg-surface p-4 text-sm text-ink-muted sm:grid-cols-2">
                <li className="flex items-center gap-2"><MapPin className="size-4 text-violet" aria-hidden />{job.location}</li>
                <li className="flex items-center gap-2"><Briefcase className="size-4 text-violet" aria-hidden />{job.salaryRange ? `${format.number(job.salaryRange.min)} – ${format.number(job.salaryRange.max)} ${job.salaryRange.currency}` : jt("competitive")}</li>
                {job.deadline && <li className="flex items-center gap-2 sm:col-span-2"><CalendarClock className="size-4 text-violet" aria-hidden />{t("deadline")}: {format.dateTime(new Date(job.deadline), { dateStyle: "long" })}</li>}
              </ul>
              <section className="space-y-2"><h3 className="font-bold text-christalle">{t("about")}</h3><p className="text-ink-muted">{job.summary}</p></section>
              <section className="space-y-2"><h3 className="font-bold text-christalle">{t("responsibilities")}</h3>
                <ul className="list-disc space-y-1 pl-5 text-ink-muted">{(t.raw("respItems") as string[]).map((x) => <li key={x}>{x}</li>)}</ul></section>
              <section className="space-y-2"><h3 className="font-bold text-christalle">{t("requirements")}</h3>
                <ul className="list-disc space-y-1 pl-5 text-ink-muted">{(t.raw("reqItems") as string[]).map((x) => <li key={x}>{x}</li>)}</ul></section>
              <section className="space-y-2"><h3 className="font-bold text-christalle">{t("skills")}</h3>
                <div className="flex flex-wrap gap-2">{job.skills.map((s) => <Badge key={s} tone="neutral">{s}</Badge>)}</div></section>
              <p className="text-xs text-ink-muted">{t("sampleNote")}</p>
              <div className="border-t border-line pt-6">
                <h3 className="mb-4 text-lg font-bold text-christalle">{t("applyTitle", { title: job.title })}</h3>
                <JobApplyForm key={job.slug} slug={job.slug} />
              </div>
              <button type="button" onClick={copy} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-violet hover:underline"><Link2 className="size-4" aria-hidden />{t("share")}</button>
            </div>
          )}
          <Dialog.Close aria-label={common("close")} className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full hover:bg-surface"><X className="size-5" aria-hidden /></Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
