"use client";

import { useTranslations } from "next-intl";
import { Container, Section } from "@/components/ui/Container";
import { BlogCard } from "@/components/ui/BlogCard";
import { PostSkeleton } from "@/components/ui/Skeletons";
import { useBlogPosts } from "@/lib/api/hooks";
import type { BlogCategory } from "@/types/api";

/** Articles from the same category, falling back to the latest ones. Hidden when nothing else exists or the request fails. */
export function RelatedPosts({ slug, category }: { slug: string; category: BlogCategory }) {
  const t = useTranslations("blogSearch");
  const same = useBlogPosts({ pageSize: 4, category });
  const latest = useBlogPosts({ pageSize: 4 });
  const pool = same.data && same.data.data.filter((p) => p.slug !== slug).length >= 2 ? same.data : latest.data;
  const posts = pool?.data.filter((p) => p.slug !== slug).slice(0, 3) ?? [];
  if (same.isError && latest.isError) return null;
  if (pool && posts.length === 0) return null;
  return (
    <Section className="border-t border-line bg-surface" aria-labelledby="related-heading">
      <Container className="space-y-8">
        <h2 id="related-heading" className="text-2xl font-bold text-christalle">{t("related")}</h2>
        {pool ? <ul className="grid gap-8 md:grid-cols-3">{posts.map((p) => <li key={p.id} className="relative"><BlogCard post={p} as="h3" /></li>)}</ul>
          : <div className="grid gap-8 md:grid-cols-3">{Array.from({ length: 3 }, (_, i) => <PostSkeleton key={i} />)}</div>}
      </Container>
    </Section>
  );
}
