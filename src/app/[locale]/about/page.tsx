import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { CtaBand } from "@/components/sections/CtaBand";
import { ServerSectionError } from "@/components/sections/ServerSectionError";
import { Card } from "@/components/ui/Card";
import { Container, Section } from "@/components/ui/Container";
import { Placeholder } from "@/components/ui/Placeholder";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { loadTeam } from "@/lib/api/server";
import { pageMetadata } from "@/lib/seo";
import type { Lang } from "@/types/api";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/about", namespace: "about" });
}

async function Team() {
  const [lang, t] = await Promise.all([getLocale() as Promise<Lang>, getTranslations("about.team")]);
  let team;
  try {
    team = await loadTeam(lang);
  } catch {
    return <ServerSectionError />;
  }
  return (
    <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {team.map((m) => (
        <li key={m.id} className="space-y-4">
          <Placeholder label={t("photoPlaceholder")} ratio="aspect-[4/5]" />
          <div>
            <h3 className="text-xl font-bold text-christalle">{m.name}</h3>
            <p className="font-semibold text-ubuntu">{m.role}</p>
            <p className="mt-2 text-ink-muted">{m.bio}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const values = t.raw("values.items") as { title: string; text: string }[];
  const history = t.raw("history.items") as { year: string; title: string; text: string }[];

  return (
    <>
      <section className="bg-[linear-gradient(120deg,var(--color-christalle),var(--color-ubuntu))] py-16 text-white md:py-24">
        <Container><SectionHeader as="h1" tone="dark" title={t("hero.title")} description={t("hero.description")} /></Container>
      </section>

      <Section>
        <Container className="grid gap-8 lg:grid-cols-2">
          <Card className="space-y-3 border-l-4 border-l-ribbon"><h2 className="text-2xl font-bold text-christalle">{t("mission.title")}</h2><p className="text-lg text-ink-muted">{t("mission.text")}</p></Card>
          <Card className="space-y-3 border-l-4 border-l-violet"><h2 className="text-2xl font-bold text-christalle">{t("vision.title")}</h2><p className="text-lg text-ink-muted">{t("vision.text")}</p></Card>
        </Container>
      </Section>

      <Section className="bg-christalle text-white">
        <Container className="max-w-4xl space-y-4 text-center">
          <h2 className="text-3xl font-bold">{t("ubuntu.title")}</h2>
          <p className="text-2xl leading-relaxed text-chalk">{t("ubuntu.text")}</p>
        </Container>
      </Section>

      <Section>
        <Container className="space-y-10">
          <SectionHeader title={t("values.title")} />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <li key={v.title}><Card className="h-full space-y-3"><span className="flex size-10 items-center justify-center rounded-full bg-ribbon font-bold text-white" aria-hidden>{i + 1}</span><h3 className="text-xl font-bold text-christalle">{v.title}</h3><p className="text-ink-muted">{v.text}</p></Card></li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container className="space-y-10">
          <SectionHeader title={t("history.title")} description={t("history.note")} />
          <ol className="relative space-y-8 border-l-2 border-line-strong pl-8">
            {history.map((h) => (
              <li key={h.title} className="relative">
                <span className="absolute top-1.5 -left-[2.6rem] size-4 rounded-full border-4 border-white bg-ribbon" aria-hidden />
                <p className="text-sm font-bold tracking-widest text-violet uppercase">{h.year}</p>
                <h3 className="text-xl font-bold text-christalle">{h.title}</h3>
                <p className="text-ink-muted">{h.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container className="space-y-10">
          <SectionHeader title={t("team.title")} />
          <Suspense fallback={<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="aspect-[4/5]" />)}</div>}>
            <Team />
          </Suspense>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
