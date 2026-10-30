import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/layout/JsonLd";
import { CtaBand } from "@/components/sections/CtaBand";
import { ServiceTestimonials } from "@/components/sections/TestimonialsSection";
import { Card } from "@/components/ui/Card";
import { Container, Section } from "@/components/ui/Container";
import { Placeholder } from "@/components/ui/Placeholder";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { routing } from "@/i18n/routing";
import { ApiError } from "@/lib/api/client";
import { loadService } from "@/lib/api/server";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/utils";
import { serviceSlugs, type Lang, type ServiceSlug } from "@/types/api";
import { Check } from "lucide-react";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => serviceSlugs.map((slug) => ({ locale, slug })));
}

const isSlug = (s: string): s is ServiceSlug => (serviceSlugs as readonly string[]).includes(s);

async function load(locale: string, slug: string) {
  if (!isSlug(slug)) notFound();
  try {
    return await loadService(locale as Lang, slug);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e; // error.tsx offers a retry
  }
}

export async function generateMetadata({ params }: PageProps<"/[locale]/services/[slug]">) {
  const { locale, slug } = await params;
  const service = await load(locale, slug);
  return pageMetadata({ locale, path: `/services/${slug}`, title: service.title, description: service.summary });
}

export default async function ServicePage({ params }: PageProps<"/[locale]/services/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [service, t, cta] = await Promise.all([load(locale, slug), getTranslations("services"), getTranslations("cta")]);
  const isHiring = service.slug === "talent-acquisition";

  return (
    <>
      <section className="bg-[linear-gradient(120deg,var(--color-christalle),var(--color-ubuntu))] py-16 text-white md:py-24">
        <Container>
          <SectionHeader as="h1" tone="dark" eyebrow={t("names." + service.slug)} title={service.title} description={service.intro} />
        </Container>
      </section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-christalle">{t("offerings")}</h2>
            <ul className="space-y-3">
              {service.offerings.map((o) => (
                <li key={o} className="flex items-start gap-3"><Check className="mt-1 size-5 shrink-0 text-ribbon" aria-hidden /><span className="text-lg">{o}</span></li>
              ))}
            </ul>
          </div>
          <Placeholder label={`${service.title}: photo placeholder`} ratio="aspect-[16/10]" />
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container className="space-y-10">
          <SectionHeader title={t("process")} />
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, i) => (
              <li key={step.title}>
                <Card className="h-full space-y-3">
                  <p className="text-sm font-bold tracking-widest text-violet uppercase">{t("stepN", { n: i + 1 })}</p>
                  <h3 className="text-xl font-bold text-christalle">{step.title}</h3>
                  <p className="text-ink-muted">{step.description}</p>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container className="space-y-10">
          <SectionHeader title={t("outcomes")} />
          <ul className="grid gap-6 md:grid-cols-3">
            {service.outcomes.map((o) => (
              <li key={o.title} className="space-y-2 border-l-4 border-ribbon pl-5">
                <h3 className="text-xl font-bold text-christalle">{o.title}</h3>
                <p className="text-ink-muted">{o.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {service.gallery.length > 0 && (
        <Section className="bg-surface">
          <Container className="space-y-10">
            <SectionHeader title={t("gallery")} description={t("galleryNote")} />
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {service.gallery.map((caption) => <li key={caption}><Placeholder label={caption} ratio="aspect-[4/3]" /></li>)}
            </ul>
          </Container>
        </Section>
      )}

      <Section>
        <Container className="space-y-10">
          <SectionHeader title={t("testimonials")} />
          <ServiceTestimonials service={service.slug} />
        </Container>
      </Section>

      <CtaBand
        title={isHiring ? cta("hireTalent") : t("quoteTitle", { service: service.title })}
        description={isHiring ? t("hireText") : t("quoteText")}
        primary={isHiring ? { href: "/hire", label: cta("hireTalent") } : { href: `/quote?service=${service.slug}`, label: cta("requestQuote") }}
        secondary={{ href: "/contact", label: cta("getInTouch") }}
      />

      <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", name: service.title, description: service.summary, provider: { "@type": "Organization", name: "Ubuntu Impact Limited", url: siteUrl }, areaServed: "TZ" }} />
    </>
  );
}
