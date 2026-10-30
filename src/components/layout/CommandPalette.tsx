"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, CornerDownLeft, FileText, Layers, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { api } from "@/lib/api/endpoints";
import { cn } from "@/lib/utils";
import { serviceSlugs, type Lang } from "@/types/api";

interface Item { id: string; group: "pages" | "services" | "jobs" | "articles"; label: string; hint?: string; href: string }

const pageLinks = [["/", "home"], ["/jobs", "jobs"], ["/events", "events"], ["/about", "about"], ["/blog", "blog"], ["/contact", "contact"], ["/hire", "hire"], ["/quote", "quote"]] as const;
const icons = { pages: CornerDownLeft, services: Layers, jobs: Briefcase, articles: FileText };

/** Global search (Ctrl/Cmd+K). Pages and services are local; jobs and articles come from the API. */
export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const t = useTranslations("palette");
  const nav = useTranslations("nav");
  const cta = useTranslations("cta");
  const names = useTranslations("services.names");
  const lang = useLocale() as Lang;
  const router = useRouter();
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(q.trim()), 200);
    return () => clearTimeout(id);
  }, [q]);

  const jobs = useQuery({ queryKey: ["palette", "jobs", lang, debounced], enabled: open && debounced.length > 1, queryFn: ({ signal }) => api.jobs({ lang, signal, q: debounced, pageSize: 5 }) });
  const posts = useQuery({ queryKey: ["palette", "posts", lang], enabled: open, staleTime: 5 * 60_000, queryFn: ({ signal }) => api.blogPosts({ lang, signal, pageSize: 20 }) });

  const items = useMemo<Item[]>(() => {
    const needle = q.trim().toLowerCase();
    const match = (s: string) => !needle || s.toLowerCase().includes(needle);
    const labelFor = (k: string) => (k === "hire" ? cta("hireTalent") : k === "quote" ? cta("requestQuote") : nav(k as never));
    const out: Item[] = [];
    pageLinks.forEach(([href, k]) => { const label = labelFor(k); if (match(label)) out.push({ id: `p${href}`, group: "pages", label, href }); });
    serviceSlugs.forEach((s) => { if (match(names(s))) out.push({ id: `s${s}`, group: "services", label: names(s), href: `/services/${s}` }); });
    if (needle.length > 1) {
      jobs.data?.data.forEach((j) => out.push({ id: `j${j.id}`, group: "jobs", label: j.title, hint: j.location, href: `/jobs?job=${j.slug}` }));
      posts.data?.data.filter((p) => match(`${p.title} ${p.excerpt}`)).slice(0, 4).forEach((p) => out.push({ id: `a${p.id}`, group: "articles", label: p.title, hint: `${p.readingMinutes} min`, href: `/blog/${p.slug}` }));
    }
    return out;
  }, [q, jobs.data, posts.data, nav, cta, names]);

  const go = (item: Item) => { onOpenChange(false); router.push(item.href as never); };
  const index = Math.min(active, Math.max(items.length - 1, 0));

  useEffect(() => { listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" }); }, [index]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, items.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && items[index]) { e.preventDefault(); go(items[index]); }
  };

  let lastGroup = "";
  return (
    <Dialog.Root open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) { setQ(""); setActive(0); } }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-christalle/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-[10vh] left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl bg-white shadow-lg" onKeyDown={onKey}>
          <Dialog.Title className="sr-only">{nav("searchHint")}</Dialog.Title>
          <Dialog.Description className="sr-only">{t("hint")}</Dialog.Description>
          <div className="flex items-center gap-3 border-b border-line px-4">
            <Search className="size-5 text-ink-muted" aria-hidden />
            <input autoFocus role="combobox" aria-expanded aria-controls="palette-list" aria-activedescendant={items[index] ? `opt-${items[index].id}` : undefined} value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} placeholder={t("placeholder")} className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-ink-muted" />
            <kbd className="hidden rounded border border-line-strong px-1.5 py-0.5 text-xs text-ink-muted sm:block">Esc</kbd>
          </div>
          <ul id="palette-list" role="listbox" ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
            {items.length === 0 && <li className="px-3 py-8 text-center text-sm text-ink-muted" role="presentation">{t("empty", { q })}</li>}
            {items.map((item, i) => {
              const header = item.group !== lastGroup;
              lastGroup = item.group;
              const Icon = icons[item.group];
              return (
                <li key={item.id} role="presentation">
                  {header && <p className="px-3 pt-3 pb-1 text-xs font-bold tracking-widest text-violet uppercase">{t(item.group)}</p>}
                  <div id={`opt-${item.id}`} role="option" aria-selected={i === index} onMouseMove={() => setActive(i)} onClick={() => go(item)}
                    className={cn("flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-3 text-sm font-semibold text-christalle", i === index && "bg-chalk/60")}>
                    <Icon className="size-4 shrink-0 text-violet" aria-hidden /><span className="flex-1 truncate">{item.label}</span>
                    {item.hint && <span className="text-xs font-medium text-ink-muted">{item.hint}</span>}
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="hidden border-t border-line px-4 py-2 text-xs text-ink-muted sm:block">{t("navigate")}</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
