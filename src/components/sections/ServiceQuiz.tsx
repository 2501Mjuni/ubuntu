"use client";

import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { serviceSlugs, type ServiceSlug } from "@/types/api";

type Weights = Partial<Record<ServiceSlug, number>>;
const [TA, CB, TB, EM] = serviceSlugs;

/** Each option adds weight to the services it points to. The highest total wins; ties go to the first question's answer. */
const questions: { key: "q1" | "q2" | "q3"; options: { key: string; weights: Weights }[] }[] = [
  { key: "q1", options: [{ key: "a", weights: { [TA]: 5 } }, { key: "b", weights: { [CB]: 5 } }, { key: "c", weights: { [TB]: 5 } }, { key: "d", weights: { [EM]: 5 } }] },
  { key: "q2", options: [{ key: "a", weights: { [TA]: 1, [EM]: 1 } }, { key: "b", weights: { [CB]: 1, [TB]: 1 } }, { key: "c", weights: { [CB]: 1, [TA]: 1 } }] },
  { key: "q3", options: [{ key: "a", weights: { [TA]: 1, [CB]: 1 } }, { key: "b", weights: { [TB]: 1, [CB]: 1 } }, { key: "c", weights: { [EM]: 1, [TB]: 1 } }] },
];

export function ServiceQuiz() {
  const t = useTranslations("quiz");
  const names = useTranslations("services.names");
  const [answers, setAnswers] = useState<number[]>([]);
  const step = answers.length;
  const done = step === questions.length;

  const scores = serviceSlugs.map((slug) => ({
    slug,
    score: answers.reduce((sum, a, i) => sum + (questions[i].options[a].weights[slug] ?? 0), 0),
  }));
  const winner = scores.reduce((best, s) => (s.score > best.score ? s : best), scores[0]).slug;
  const q = questions[Math.min(step, questions.length - 1)];

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-6 shadow-md sm:p-10">
      {done ? (
        <div className="space-y-6" role="status">
          <p className="inline-flex items-center gap-2 text-sm font-bold tracking-widest text-violet uppercase"><Sparkles className="size-4" aria-hidden />{t("result")}</p>
          <h3 className="text-3xl font-bold text-christalle">{names(winner)}</h3>
          <p className="text-lg text-ink-muted">{t("why")}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href={`/services/${winner}`}>{t("learn")}<ArrowRight aria-hidden /></Link></Button>
            <Button asChild size="lg" variant="secondary">{winner === "talent-acquisition" ? <Link href="/hire">{t("hire")}</Link> : <Link href={`/quote?service=${winner}`}>{t("quote")}</Link>}</Button>
            <Button size="lg" variant="ghost" onClick={() => setAnswers([])}><RotateCcw aria-hidden />{t("restart")}</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-ink-muted">{t("step", { n: step + 1, total: questions.length })}</p>
            <div className="flex gap-1.5" aria-hidden>{questions.map((_, i) => <span key={i} className={cn("h-1.5 w-10 rounded-full", i <= step ? "bg-violet" : "bg-line")} />)}</div>
          </div>
          <h3 className="text-2xl font-bold text-christalle">{t(q.key)}</h3>
          <div className="grid gap-3">
            {q.options.map((o, i) => (
              <button key={o.key} type="button" onClick={() => setAnswers([...answers, i])} className="min-h-14 rounded-lg border-2 border-line-strong px-5 py-3 text-left font-semibold text-christalle transition-colors hover:border-violet hover:bg-chalk/40">
                {t(`${q.key}${o.key}` as never)}
              </button>
            ))}
          </div>
          {step > 0 && <Button variant="ghost" size="sm" onClick={() => setAnswers(answers.slice(0, -1))}><ArrowLeft aria-hidden />{t("back")}</Button>}
        </div>
      )}
    </div>
  );
}
