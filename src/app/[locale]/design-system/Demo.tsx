"use client";

import { useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState, EmptyState } from "@/components/ui/DataState";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { Placeholder } from "@/components/ui/Placeholder";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { CardSkeleton, PostSkeleton } from "@/components/ui/Skeletons";
import { StatCounter } from "@/components/ui/StatCounter";
import { Tabs } from "@/components/ui/Tabs";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { useToast } from "@/components/ui/Toast";
import { BlogCard } from "@/components/ui/BlogCard";
import { EventCard } from "@/components/ui/EventCard";
import { JobCard } from "@/components/ui/JobCard";
import { jobSeeds, eventSeeds, postSeeds, testimonialSeeds } from "@/mocks/data";
import type { BlogPost, CommunityEvent, Job, Testimonial } from "@/types/api";

const colors = [
  ["ribbon", "Red Ribbon", "#eb0a3e", "brand"], ["christalle", "Christalle", "#40006a", "brand"], ["ubuntu", "Ubuntu Purple", "#5b0098", "brand"],
  ["violet", "Electric Violet", "#8700e0", "brand"], ["chalk", "Blue Chalk", "#f9d6ff", "brand"], ["ink", "Ink", "#1a1021", "derived"],
  ["ink-muted", "Ink muted", "#5f5468", "derived"], ["surface", "Surface", "#f8f2fb", "derived"], ["line", "Line", "#e6dcee", "derived"], ["danger", "Danger", "#c4072f", "derived"], ["success", "Success", "#0b6b3a", "derived"],
] as const;

const job: Job = { id: "1", slug: "x", title: jobSeeds[0].title.en, companyName: "Sample Holdings Ltd", industry: "Finance", location: "Dar es Salaam", jobType: "FULL_TIME", careerLevel: "SENIOR", salaryRange: { min: 1800000, max: 2600000, currency: "TZS" }, deadline: "2026-11-20T00:00:00.000Z", postedAt: "2026-10-20T00:00:00.000Z", skills: [], summary: jobSeeds[0].summary.en };
const event: CommunityEvent = { id: "1", slug: "x", title: eventSeeds[1].title.en, category: "Masterclass", startsAt: "2026-11-12T08:00:00.000Z", endsAt: null, venue: "Dar es Salaam", onlineUrl: null, isPaid: true, price: 25000, currency: "TZS" };
const post: BlogPost = { id: "1", slug: "x", title: postSeeds[0].title.en, excerpt: postSeeds[0].excerpt.en, body: "", category: "career-advice", authorName: "Ubuntu Impact", publishedAt: "2026-10-20T00:00:00.000Z", readingMinutes: 5, coverImageUrl: null };
const testimonial: Testimonial = { id: "1", type: "company", quote: testimonialSeeds[0].quote.en, authorName: "Sample Client A", authorRole: "HR Director", organisation: "Sample Holdings Ltd", service: null };

const h = "mb-6 text-2xl font-bold text-christalle";

export function DesignSystemDemo() {
  const [modal, setModal] = useState(false);
  const [page, setPage] = useState(2);
  const [checked, setChecked] = useState(false);
  const [select, setSelect] = useState<string>();
  const toast = useToast();

  return (
    <Container className="space-y-16 py-12">
      <SectionHeader as="h1" eyebrow="Development only" title="Design system" description="Tokens and components shared by every Ubuntu Impact portal. Not indexed and hidden in production." />

      <section aria-labelledby="ds-colour">
        <h2 id="ds-colour" className={h}>Colour tokens</h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {colors.map(([token, name, hex, source]) => (
            <li key={token} className="overflow-hidden rounded-lg border border-line">
              <div className="h-20" style={{ background: hex }} />
              <div className="p-3 text-sm"><p className="font-bold">{name}</p><p className="text-ink-muted">{hex}</p><Badge tone={source === "brand" ? "brand" : "neutral"} className="mt-1">{source === "brand" ? "from brand guide" : "derived"}</Badge></div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ds-type">
        <h2 id="ds-type" className={h}>Typography</h2>
        <div className="space-y-3">
          <p className="text-5xl font-extrabold text-christalle">Display 5xl</p>
          <p className="text-4xl font-bold text-christalle">Heading 4xl</p>
          <p className="text-3xl font-bold text-christalle">Heading 3xl</p>
          <p className="text-2xl font-bold">Heading 2xl</p>
          <p className="text-xl font-semibold">Heading xl</p>
          <p className="text-base">Body base. The quick brown fox jumps over the lazy dog.</p>
          <p className="text-sm text-ink-muted">Small muted text for captions and metadata.</p>
        </div>
      </section>

      <section aria-labelledby="ds-radius">
        <h2 id="ds-radius" className={h}>Radius, shadow and spacing</h2>
        <div className="flex flex-wrap gap-6">
          {(["sm", "md", "lg", "xl"] as const).map((r) => <div key={r} className="flex size-24 items-center justify-center border border-line-strong bg-surface text-sm font-semibold" style={{ borderRadius: `var(--radius-${r})` }}>{r}</div>)}
          {(["sm", "md", "lg"] as const).map((s) => <div key={s} className="flex size-24 items-center justify-center rounded-lg bg-white text-sm font-semibold" style={{ boxShadow: `var(--shadow-${s})` }}>shadow-{s}</div>)}
        </div>
      </section>

      <section aria-labelledby="ds-buttons">
        <h2 id="ds-buttons" className={h}>Buttons and badges</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button><Button variant="accent">Accent</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">Ghost</Button>
          <Button size="sm">Small</Button><Button size="lg">Large</Button><Button disabled>Disabled</Button>
          <span className="rounded-lg bg-christalle p-3"><Button variant="light">On dark</Button> <Button variant="outline-light">Outline</Button></span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2"><Badge>Brand</Badge><Badge tone="neutral">Neutral</Badge><Badge tone="accent">Accent</Badge><Badge tone="success">Success</Badge><Badge tone="dark">Dark</Badge></div>
      </section>

      <section aria-labelledby="ds-forms">
        <h2 id="ds-forms" className={h}>Form controls</h2>
        <div className="grid max-w-3xl gap-5 sm:grid-cols-2">
          <Field label="Text input" hint="Helper text">{(a) => <Input id={a.id} aria-describedby={a.describedBy} placeholder="Type here" />}</Field>
          <Field label="With error" required error="This field is required.">{(a) => <Input id={a.id} aria-invalid={a.invalid} aria-describedby={a.describedBy} />}</Field>
          <Field label="Select">{(a) => <Select id={a.id} value={select} onValueChange={setSelect} placeholder="Choose…" options={[{ value: "a", label: "Capacity Building" }, { value: "b", label: "Team Building" }]} />}</Field>
          <Field label="Textarea">{(a) => <Textarea id={a.id} rows={3} />}</Field>
          <Checkbox id="ds-check" checked={checked} onCheckedChange={setChecked}>I agree to the terms</Checkbox>
        </div>
      </section>

      <section aria-labelledby="ds-feedback">
        <h2 id="ds-feedback" className={h}>Modal, toast, tabs, accordion, pagination</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setModal(true)}>Open modal</Button>
          <Button variant="secondary" onClick={() => toast({ tone: "success", title: "Saved", description: "Your changes were saved." })}>Success toast</Button>
          <Button variant="secondary" onClick={() => toast({ tone: "error", title: "Could not send", description: "Please try again." })}>Error toast</Button>
        </div>
        <Modal open={modal} onOpenChange={setModal} title="Modal title" description="Focus is trapped and Escape closes it."><p>Modal content.</p></Modal>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <Tabs label="Example tabs" items={[{ value: "a", label: "Overview", content: <p>Overview content.</p> }, { value: "b", label: "Process", content: <p>Process content.</p> }]} />
          <Accordion items={[{ value: "1", title: "How fast do you respond?", content: "Within one business day." }, { value: "2", title: "Can I combine services?", content: "Yes." }]} />
        </div>
        <div className="mt-8"><Pagination page={page} pageCount={5} onPageChange={setPage} /></div>
      </section>

      <section aria-labelledby="ds-states">
        <h2 id="ds-states" className={h}>Loading, empty and error states</h2>
        <div className="grid gap-6 md:grid-cols-3"><CardSkeleton /><PostSkeleton /><div className="space-y-3"><Skeleton className="h-6 w-2/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></div></div>
        <div className="mt-6 grid gap-6 md:grid-cols-2"><EmptyState /><ErrorState onRetry={() => toast({ tone: "success", title: "Retry clicked" })} /></div>
      </section>

      <section aria-labelledby="ds-cards">
        <h2 id="ds-cards" className={h}>Cards</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <JobCard job={job} /><EventCard event={event} /><TestimonialCard item={testimonial} />
          <div className="relative"><BlogCard post={post} /></div>
          <Card><p className="font-bold text-christalle">Generic card</p><p className="mt-1 text-ink-muted">Surface for any content.</p></Card>
          <Placeholder label="Photo placeholder" />
        </div>
      </section>

      <section aria-labelledby="ds-stats" className="rounded-xl bg-christalle p-10">
        <h2 id="ds-stats" className="sr-only">Stat counters</h2>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4"><StatCounter value={1250} label="Candidates placed" /><StatCounter value={38} label="Active jobs" /><StatCounter value={112} label="Client companies" /><StatCounter value={9} label="Years of experience" suffix="+" /></div>
      </section>
    </Container>
  );
}
