"use client";

import { QueryBoundary } from "@/components/ui/DataState";
import { EventCard } from "@/components/ui/EventCard";
import { CardSkeleton } from "@/components/ui/Skeletons";
import { useUpcomingEvents } from "@/lib/api/hooks";

export function EventsSection() {
  const query = useUpcomingEvents();
  return (
    <QueryBoundary
      query={query}
      isEmpty={(r) => r.data.length === 0}
      skeleton={<div className="grid gap-6 md:grid-cols-2">{Array.from({ length: 2 }, (_, i) => <CardSkeleton key={i} />)}</div>}
    >
      {(r) => <ul className="grid gap-6 md:grid-cols-2">{r.data.slice(0, 4).map((e) => <li key={e.id}><EventCard event={e} /></li>)}</ul>}
    </QueryBoundary>
  );
}
