"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";

export function Accordion({ items }: { items: { value: string; title: string; content: ReactNode }[] }) {
  return (
    <AccordionPrimitive.Root type="single" collapsible className="divide-y divide-line rounded-lg border border-line bg-white">
      {items.map((i) => (
        <AccordionPrimitive.Item key={i.value} value={i.value}>
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex min-h-14 w-full items-center justify-between gap-4 px-5 py-3 text-left font-semibold text-christalle hover:bg-surface">
              {i.title}
              <Plus className="size-5 shrink-0 transition-transform group-data-[state=open]:rotate-45 motion-reduce:transition-none" aria-hidden />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="px-5 pb-5 text-ink-muted">{i.content}</AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
