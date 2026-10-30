import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { CtaBand } from "@/components/sections/CtaBand";
import { EventsSection } from "@/components/sections/EventsSection";
import { FeaturedJobs } from "@/components/sections/FeaturedJobs";
import { Hero } from "@/components/sections/Hero";
import { JobPostingsJsonLd } from "@/components/sections/JobPostingsJsonLd";
import { LatestPosts } from "@/components/sections/LatestPosts";
import { PartnersStrip } from "@/components/sections/PartnersStrip";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { StatsSection } from "@/components/sections/StatsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";
import { CardSkeleton } from "@/components/ui/Skeletons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceQuiz } from "@/components/sections/ServiceQuiz";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  return pageMetadata({ locale, path: "", namespace: "home", absoluteTitle: true });
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tq = await getTranslations("quiz");

  return (
    <>
      <Hero />
      <StatsSection />

      <Section id="services">
        <Container className="space-y-10">
          <SectionHeader eyebrow={t("services.eyebrow")} title={t("services.title")} description={t("services.description")} />
          <Suspense fallback={<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />)}</div>}>
            <ServicesGrid />
          </Suspense>
        </Container>
      </Section>

      <Section id="quiz" className="bg-chalk/20">
        <Container className="space-y-10">
          <SectionHeader align="center" eyebrow={tq("eyebrow")} title={tq("title")} description={tq("description")} />
          <ServiceQuiz />
        </Container>
      </Section>

      <Section id="jobs" className="bg-surface">
        <Container className="space-y-10">
          <SectionHeader
            eyebrow={t("jobs.eyebrow")} title={t("jobs.title")} description={t("jobs.description")}
            action={<Button asChild variant="secondary"><Link href="/jobs">{t("jobs.cta")}<ArrowRight aria-hidden /></Link></Button>}
          />
          <FeaturedJobs />
        </Container>
        <Suspense><JobPostingsJsonLd /></Suspense>
      </Section>

      <Section>
        <Container className="space-y-10">
          <SectionHeader eyebrow={t("testimonials.eyebrow")} title={t("testimonials.title")} />
          <TestimonialsSection />
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container className="space-y-10">
          <SectionHeader eyebrow={t("events.eyebrow")} title={t("events.title")} description={t("events.description")} action={<Button asChild variant="secondary"><Link href="/events">{t("events.cta")}<ArrowRight aria-hidden /></Link></Button>} />
          <EventsSection />
        </Container>
      </Section>

      <Section>
        <Container className="space-y-10">
          <SectionHeader eyebrow={t("blog.eyebrow")} title={t("blog.title")} action={<Button asChild variant="secondary"><Link href="/blog">{t("blog.cta")}<ArrowRight aria-hidden /></Link></Button>} />
          <LatestPosts />
        </Container>
      </Section>

      <Section className="border-y border-line py-14">
        <Container className="space-y-8">
          <h2 className="text-center text-sm font-bold tracking-widest text-ink-muted uppercase">{t("partners.title")}</h2>
          <PartnersStrip />
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
