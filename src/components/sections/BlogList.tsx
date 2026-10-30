"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Field";
import { BlogCard } from "@/components/ui/BlogCard";
import { QueryBoundary } from "@/components/ui/DataState";
import { Pagination } from "@/components/ui/Pagination";
import { PostSkeleton } from "@/components/ui/Skeletons";
import { useBlogPosts } from "@/lib/api/hooks";
import { cn } from "@/lib/utils";
import { blogCategories, type BlogCategory } from "@/types/api";

const PAGE_SIZE = 6;

export function BlogList() {
  const t = useTranslations("blog");
  const [category, setCategory] = useState<BlogCategory | undefined>();
  const [page, setPage] = useState(1);
  const [text, setText] = useState("");
  const [q, setQ] = useState<string | undefined>();
  const search = useTranslations("blogSearch");
  const query = useBlogPosts({ page, pageSize: PAGE_SIZE, category, q });

  // Debounce typing so we do not request on every keystroke.
  useEffect(() => {
    const id = setTimeout(() => { setQ(text.trim() || undefined); setPage(1); }, 300);
    return () => clearTimeout(id);
  }, [text]);

  const chip = (active: boolean) => cn("min-h-11 rounded-full border-2 px-5 text-sm font-semibold transition-colors", active ? "border-ubuntu bg-ubuntu text-white" : "border-line-strong text-ubuntu hover:bg-chalk/50");
  const choose = (c?: BlogCategory) => { setCategory(c); setPage(1); };

  return (
    <div className="space-y-10">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-ink-muted" aria-hidden />
        <Input type="search" aria-label={search("label")} placeholder={search("placeholder")} value={text} onChange={(e) => setText(e.target.value)} className="pl-11" />
      </div>
      <div role="group" aria-label={t("filterLabel")} className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={!category} onClick={() => choose()} className={chip(!category)}>{t("all")}</button>
        {blogCategories.map((c) => <button key={c} type="button" aria-pressed={category === c} onClick={() => choose(c)} className={chip(category === c)}>{t(`categories.${c}`)}</button>)}
      </div>
      <div aria-live="polite">
        <QueryBoundary
          query={query}
          isEmpty={(r) => r.data.length === 0}
          empty={{ title: q ? search("empty", { q }) : t("empty") }}
          skeleton={<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }, (_, i) => <PostSkeleton key={i} />)}</div>}
        >
          {(r) => (
            <div className="space-y-10">
              <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{r.data.map((p) => <li key={p.id} className="relative"><BlogCard post={p} as="h2" /></li>)}</ul>
              <Pagination page={page} pageCount={Math.ceil(r.meta.total / PAGE_SIZE)} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
            </div>
          )}
        </QueryBoundary>
      </div>
    </div>
  );
}
