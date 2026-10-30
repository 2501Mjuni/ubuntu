import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/cookies">) {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/cookies", namespace: "cookies" });
}

export default async function LegalPage({ params }: PageProps<"/[locale]/cookies">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  const sections = t.raw("cookies.sections") as { title: string; text: string }[];
  return (
    <Section>
      <Container className="max-w-3xl space-y-8">
        <h1 className="text-4xl font-bold text-christalle">{t("cookies.title")}</h1>
        <p role="note" className="rounded-md border border-ribbon/30 bg-ribbon/5 px-4 py-3 text-sm font-medium text-danger">{t("placeholderNote")}</p>
        <p className="text-sm text-ink-muted">{t("updated")}</p>
        {sections.map((s) => (
          <section key={s.title} className="space-y-2"><h2 className="text-2xl font-bold text-christalle">{s.title}</h2><p className="text-lg text-ink-muted">{s.text}</p></section>
        ))}
      </Container>
    </Section>
  );
}
