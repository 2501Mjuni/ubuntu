"use client";

import { QueryBoundary } from "@/components/ui/DataState";
import { CardSkeleton } from "@/components/ui/Skeletons";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { useServiceTestimonials, useTestimonials } from "@/lib/api/hooks";
import type { ServiceSlug } from "@/types/api";

function List({ query }: { query: ReturnType<typeof useTestimonials> }) {
  return (
    <QueryBoundary
      query={query}
      isEmpty={(r) => r.data.length === 0}
      skeleton={<div className="grid gap-6 md:grid-cols-3">{Array.from({ length: 3 }, (_, i) => <CardSkeleton key={i} />)}</div>}
    >
      {(r) => <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{r.data.slice(0, 3).map((item) => <li key={item.id}><TestimonialCard item={item} /></li>)}</ul>}
    </QueryBoundary>
  );
}

export const TestimonialsSection = () => <List query={useTestimonials()} />;
export const ServiceTestimonials = ({ service }: { service: ServiceSlug }) => <List query={useServiceTestimonials(service)} />;
