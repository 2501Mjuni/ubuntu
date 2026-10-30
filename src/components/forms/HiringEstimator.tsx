"use client";

import { Calculator, Clock, Users } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { estimate, levels, type EstimatorLevel } from "@/lib/estimator";
import { cn } from "@/lib/utils";

export function HiringEstimator() {
  const t = useTranslations("estimator");
  const jt = useTranslations("jobs.levels");
  const format = useFormatter();
  const [level, setLevel] = useState<EstimatorLevel>("INTERMEDIATE");
  const [salary, setSalary] = useState(1_500_000);
  const [roles, setRoles] = useState(1);
  const r = estimate({ level, monthlySalary: salary, roles });
  const tzs = (n: number) => format.number(n, { maximumFractionDigits: 0 });

  return (
    <Card className="space-y-6 border-violet/30 bg-chalk/20">
      <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-violet text-white"><Calculator className="size-5" aria-hidden /></span>
        <div><h2 className="text-xl font-bold text-christalle">{t("title")}</h2><p className="text-sm text-ink-muted">{t("description")}</p></div></div>
      <fieldset className="space-y-2"><legend className="text-sm font-semibold text-christalle">{t("level")}</legend>
        <div className="flex flex-wrap gap-2">{levels.map((l) => (
          <button key={l} type="button" aria-pressed={level === l} onClick={() => setLevel(l)} className={cn("min-h-10 rounded-full border px-4 text-sm font-semibold", level === l ? "border-violet bg-violet text-white" : "border-line-strong bg-white text-christalle hover:border-violet")}>{jt(l)}</button>))}</div></fieldset>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-christalle">{t("salary")}: <span className="text-violet">{tzs(salary)} TZS</span>
          <input type="range" min={500_000} max={6_000_000} step={100_000} value={salary} onChange={(e) => setSalary(Number(e.target.value))} className="w-full accent-violet" /></label>
        <label className="space-y-2 text-sm font-semibold text-christalle">{t("roles")}: <span className="text-violet">{roles}</span>
          <input type="range" min={1} max={20} value={roles} onChange={(e) => setRoles(Number(e.target.value))} className="w-full accent-violet" /></label>
      </div>
      <dl className="grid gap-4 sm:grid-cols-3" aria-live="polite">
        <div className="rounded-lg bg-white p-4"><dt className="text-xs font-bold tracking-widest text-violet uppercase">{t("fee")}</dt><dd className="mt-1 text-lg font-bold text-christalle">{tzs(r.fee[0])} – {tzs(r.fee[1])}</dd></div>
        <div className="rounded-lg bg-white p-4"><dt className="flex items-center gap-1 text-xs font-bold tracking-widest text-violet uppercase"><Clock className="size-3.5" aria-hidden />{t("time")}</dt><dd className="mt-1 text-lg font-bold text-christalle">{t("days", { min: r.days[0], max: r.days[1] })}</dd></div>
        <div className="rounded-lg bg-white p-4"><dt className="flex items-center gap-1 text-xs font-bold tracking-widest text-violet uppercase"><Users className="size-3.5" aria-hidden />{t("shortlist")}</dt><dd className="mt-1 text-lg font-bold text-christalle">{t("candidates", { count: r.shortlist })}</dd></div>
      </dl>
      <p className="text-xs text-ink-muted">{t("disclaimer")}</p>
    </Card>
  );
}
