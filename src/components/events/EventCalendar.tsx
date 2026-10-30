"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CommunityEvent } from "@/types/api";

const DAY = 86_400_000;

/** Month grid. The first month shown is the month of the earliest event, so it never depends on the current time. */
export function EventCalendar({ events, onSelect }: { events: CommunityEvent[]; onSelect: (e: CommunityEvent) => void }) {
  const t = useTranslations("eventsPage");
  const format = useFormatter();
  const first = events.length ? new Date(Math.min(...events.map((e) => +new Date(e.startsAt)))) : new Date(0);
  const [cursor, setCursor] = useState({ y: first.getUTCFullYear(), m: first.getUTCMonth() });

  const start = Date.UTC(cursor.y, cursor.m, 1);
  const days = new Date(Date.UTC(cursor.y, cursor.m + 1, 0)).getUTCDate();
  const offset = (new Date(start).getUTCDay() + 6) % 7; // Monday first
  const cells = Array.from({ length: Math.ceil((offset + days) / 7) * 7 }, (_, i) => i - offset + 1);
  const byDay = new Map<number, CommunityEvent[]>();
  events.forEach((e) => {
    const d = new Date(e.startsAt);
    if (d.getUTCFullYear() === cursor.y && d.getUTCMonth() === cursor.m) byDay.set(d.getUTCDate(), [...(byDay.get(d.getUTCDate()) ?? []), e]);
  });
  const move = (delta: number) => setCursor(({ y, m }) => { const d = new Date(Date.UTC(y, m + delta, 1)); return { y: d.getUTCFullYear(), m: d.getUTCMonth() }; });
  const weekdays = Array.from({ length: 7 }, (_, i) => format.dateTime(new Date(Date.UTC(2024, 0, 1 + i) + 0 * DAY), { weekday: "short", timeZone: "UTC" }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => move(-1)} aria-label={t("prev")} className="flex size-11 items-center justify-center rounded-full border border-line-strong hover:bg-surface"><ChevronLeft className="size-5" aria-hidden /></button>
        <h2 className="text-xl font-bold text-christalle" aria-live="polite">{format.dateTime(new Date(start), { month: "long", year: "numeric", timeZone: "UTC" })}</h2>
        <button type="button" onClick={() => move(1)} aria-label={t("next")} className="flex size-11 items-center justify-center rounded-full border border-line-strong hover:bg-surface"><ChevronRight className="size-5" aria-hidden /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold tracking-wider text-ink-muted uppercase" aria-hidden>{weekdays.map((d) => <span key={d}>{d}</span>)}</div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          const inMonth = d >= 1 && d <= days;
          const list = inMonth ? byDay.get(d) ?? [] : [];
          return (
            <div key={i} className={cn("flex min-h-16 flex-col gap-1 rounded-md border p-1 sm:min-h-24 sm:p-2", inMonth ? "border-line bg-white" : "border-transparent")}>
              {inMonth && <span className="text-xs font-semibold text-ink-muted">{d}</span>}
              {list.map((e) => (
                <button key={e.id} type="button" onClick={() => onSelect(e)} title={e.title} className="truncate rounded bg-violet px-1 py-0.5 text-left text-[0.65rem] font-semibold text-white hover:bg-christalle sm:px-1.5 sm:text-xs">
                  <span className="sr-only sm:not-sr-only">{e.title}</span><span className="sm:hidden" aria-hidden>●</span>
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
