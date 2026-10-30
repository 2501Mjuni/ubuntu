"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ReactNode } from "react";

export function Tabs({ items, defaultValue, label }: { items: { value: string; label: string; content: ReactNode }[]; defaultValue?: string; label: string }) {
  return (
    <TabsPrimitive.Root defaultValue={defaultValue ?? items[0]?.value}>
      <TabsPrimitive.List aria-label={label} className="flex gap-1 overflow-x-auto border-b border-line">
        {items.map((i) => (
          <TabsPrimitive.Trigger key={i.value} value={i.value} className="min-h-11 shrink-0 border-b-4 border-transparent px-4 text-sm font-semibold text-ink-muted transition-colors hover:text-ubuntu data-[state=active]:border-ribbon data-[state=active]:text-christalle">
            {i.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {items.map((i) => <TabsPrimitive.Content key={i.value} value={i.value} className="pt-6">{i.content}</TabsPrimitive.Content>)}
    </TabsPrimitive.Root>
  );
}
