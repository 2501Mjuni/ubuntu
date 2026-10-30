"use client";

import { CalendarDays, List } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { QueryBoundary } from "@/components/ui/DataState";
import { EventCard } from "@/components/ui/EventCard";
import { Modal } from "@/components/ui/Modal";
import { CardSkeleton } from "@/components/ui/Skeletons";
import { useUpcomingEvents } from "@/lib/api/hooks";
import { cn } from "@/lib/utils";
import type { CommunityEvent } from "@/types/api";
import { EventCalendar } from "./EventCalendar";
import { EventRsvpForm } from "./EventRsvpForm";

export function EventsBoard() {
  const t = useTranslations("eventsPage");
  const query = useUpcomingEvents();
  const [view, setView] = useState<"list" | "calendar">("list");
  const [category, setCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<CommunityEvent | null>(null);

  const toggle = (active: boolean) => cn("inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4 text-sm font-semibold", active ? "border-ubuntu bg-ubuntu text-white" : "border-line-strong text-ubuntu hover:bg-chalk/50");

  return (
    <QueryBoundary
      query={query}
      isEmpty={(r) => r.data.length === 0}
      skeleton={<div className="grid gap-6 md:grid-cols-2">{Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />)}</div>}
    >
      {(r) => {
        const categories = [...new Set(r.data.map((e) => e.category))];
        const shown = r.data.filter((e) => !category || e.category === category);
        return (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div role="group" aria-label={t("filter")} className="flex flex-wrap gap-2">
                <button type="button" aria-pressed={!category} onClick={() => setCategory(null)} className={toggle(!category)}>{t("all")}</button>
                {categories.map((c) => <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)} className={toggle(category === c)}>{c}</button>)}
              </div>
              <div role="group" aria-label={t("viewer")} className="flex gap-2">
                <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")} className={toggle(view === "list")}><List className="size-4" aria-hidden />{t("list")}</button>
                <button type="button" aria-pressed={view === "calendar"} onClick={() => setView("calendar")} className={toggle(view === "calendar")}><CalendarDays className="size-4" aria-hidden />{t("calendar")}</button>
              </div>
            </div>
            {view === "calendar" ? (
              <EventCalendar events={shown} onSelect={setSelected} />
            ) : (
              <ul className="grid gap-6 md:grid-cols-2">
                {shown.map((e) => (
                  <li key={e.id} className="flex flex-col gap-3">
                    <EventCard event={e} />
                    <Button variant="secondary" size="sm" className="self-start" onClick={() => setSelected(e)}>{t("rsvp")}</Button>
                  </li>
                ))}
              </ul>
            )}
            <Modal open={selected !== null} onOpenChange={(o) => !o && setSelected(null)} title={selected ? t("rsvpTitle", { title: selected.title }) : ""} description={t("rsvpDescription")}>
              {selected && <EventRsvpForm key={selected.slug} slug={selected.slug} />}
            </Modal>
          </div>
        );
      }}
    </QueryBoundary>
  );
}
