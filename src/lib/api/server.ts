import { cacheLife } from "next/cache";
import type { Lang, ServiceSlug } from "@/types/api";
import { api } from "./endpoints";

/*
 * Server loaders for SEO-critical content. Cached because the content is the same for every visitor.
 * Each one throws on failure so the nearest error.tsx can offer a retry.
 */

export async function loadServices(lang: Lang) {
  "use cache";
  cacheLife("hours");
  return (await api.services({ lang })).data;
}

export async function loadService(lang: Lang, slug: ServiceSlug) {
  "use cache";
  cacheLife("hours");
  return api.service({ lang, slug });
}

export async function loadBlogPost(lang: Lang, slug: string) {
  "use cache";
  cacheLife("hours");
  return api.blogPost({ lang, slug });
}

export async function loadTeam(lang: Lang) {
  "use cache";
  cacheLife("hours");
  return (await api.team({ lang })).data;
}

export async function loadFeaturedJobs(lang: Lang) {
  "use cache";
  cacheLife("minutes");
  return (await api.featuredJobs({ lang })).data;
}

export async function loadBlogSlugs(lang: Lang) {
  "use cache";
  cacheLife("hours");
  try {
    return (await api.blogPosts({ lang, pageSize: 100 })).data.map((p) => p.slug);
  } catch {
    return [];
  }
}
