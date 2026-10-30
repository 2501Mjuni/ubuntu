import { getTranslations, setRequestLocale } from "next-intl/server";
import { EventsBoard } from "@/components/events/EventsBoard";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/events">) {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/events", namespace: "events" });
}

export default async function EventsPage({ params }: PageProps<"/[locale]/events">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("eventsPage");
  return (
    <Section>
      <Container className="space-y-10">
        <SectionHeader as="h1" title={t("title")} description={t("description")} />
        <EventsBoard />
      </Container>
    </Section>
  );
}
