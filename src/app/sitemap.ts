import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { loadBlogSlugs } from "@/lib/api/server";
import { siteUrl } from "@/lib/utils";
import { serviceSlugs } from "@/types/api";

const staticPaths = ["", "/about", "/blog", "/jobs", "/events", "/contact", "/hire", "/quote", "/privacy", "/cookies", ...serviceSlugs.map((s) => `/services/${s}`)];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blog = Object.fromEntries(await Promise.all(routing.locales.map(async (l) => [l, await loadBlogSlugs(l)] as const)));
  const paths = [...staticPaths, ...(blog[routing.defaultLocale] ?? []).map((s) => `/blog/${s}`)];
  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `${siteUrl}/${l}${path}`])) },
    })),
  );
}
