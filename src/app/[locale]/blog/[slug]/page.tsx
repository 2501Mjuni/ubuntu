import { ArrowLeft } from "lucide-react";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/layout/JsonLd";
import { RelatedPosts } from "@/components/sections/RelatedPosts";
import { CtaBand } from "@/components/sections/CtaBand";
import { Badge } from "@/components/ui/Badge";
import { Container, Section } from "@/components/ui/Container";
import { Placeholder } from "@/components/ui/Placeholder";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { ApiError } from "@/lib/api/client";
import { loadBlogPost, loadBlogSlugs } from "@/lib/api/server";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/utils";
import type { Lang } from "@/types/api";

export async function generateStaticParams() {
  const all = await Promise.all(routing.locales.map(async (locale) => (await loadBlogSlugs(locale)).map((slug) => ({ locale, slug }))));
  // Cache Components requires at least one prerendered entry; unknown slugs render on demand.
  return all.flat().length ? all.flat() : routing.locales.map((locale) => ({ locale, slug: "placeholder" }));
}

async function load(locale: string, slug: string) {
  try {
    return await loadBlogPost(locale as Lang, slug);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  const post = await load(locale, slug);
  const base = await pageMetadata({ locale, path: `/blog/${slug}`, title: post.title, description: post.excerpt });
  return { ...base, openGraph: { ...base.openGraph, type: "article" as const, publishedTime: post.publishedAt } };
}

export default async function ArticlePage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [post, t, format] = await Promise.all([load(locale, slug), getTranslations("blog"), getFormatter()]);
  const paragraphs = post.body.split(/\n{2,}/).filter(Boolean);

  return (
    <>
      <article>
        <Section className="pb-8">
          <Container className="max-w-3xl space-y-6">
            <Link href="/blog" className="inline-flex min-h-11 items-center gap-2 font-semibold text-ubuntu hover:underline"><ArrowLeft className="size-4" aria-hidden />{t("back")}</Link>
            <div className="flex flex-wrap items-center gap-3 text-sm text-ink-muted">
              <Badge>{t(`categories.${post.category}`)}</Badge>
              <time dateTime={post.publishedAt}>{format.dateTime(new Date(post.publishedAt), { dateStyle: "long" })}</time>
              <span>{t("readingTime", { minutes: post.readingMinutes })}</span>
            </div>
            <h1 className="text-4xl font-bold text-christalle md:text-5xl">{post.title}</h1>
            <p className="text-xl text-ink-muted">{post.excerpt}</p>
            <p className="text-sm font-semibold">{t("by", { author: post.authorName })}</p>
            <Placeholder label={t("coverPlaceholder")} ratio="aspect-[16/9]" />
          </Container>
        </Section>
        <Container className="max-w-3xl space-y-6 pb-20 text-lg leading-relaxed">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </Container>
      </article>
      <RelatedPosts slug={post.slug} category={post.category} />
      <CtaBand />
      <JsonLd
        data={{
          "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.excerpt, datePublished: post.publishedAt,
          author: { "@type": "Organization", name: post.authorName }, publisher: { "@type": "Organization", name: "Ubuntu Impact Limited", logo: { "@type": "ImageObject", url: `${siteUrl}/icons/icon-512.png` } },
          mainEntityOfPage: `${siteUrl}/${locale}/blog/${post.slug}`,
        }}
      />
    </>
  );
}
