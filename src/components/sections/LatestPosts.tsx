"use client";

import { BlogCard } from "@/components/ui/BlogCard";
import { QueryBoundary } from "@/components/ui/DataState";
import { PostSkeleton } from "@/components/ui/Skeletons";
import { useBlogPosts } from "@/lib/api/hooks";

export function LatestPosts() {
  const query = useBlogPosts({ page: 1, pageSize: 3 });
  return (
    <QueryBoundary
      query={query}
      isEmpty={(r) => r.data.length === 0}
      skeleton={<div className="grid gap-8 md:grid-cols-3">{Array.from({ length: 3 }, (_, i) => <PostSkeleton key={i} />)}</div>}
    >
      {(r) => <ul className="grid gap-8 md:grid-cols-3">{r.data.map((p) => <li key={p.id} className="relative"><BlogCard post={p} /></li>)}</ul>}
    </QueryBoundary>
  );
}
