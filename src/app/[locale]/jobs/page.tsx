import { getTranslations, setRequestLocale } from "next-intl/server";
import { JobBoard } from "@/components/jobs/JobBoard";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/jobs">) {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/jobs", namespace: "jobs" });
}

export default async function JobsPage({ params }: PageProps<"/[locale]/jobs">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("jobBoard");
  return (
    <Section>
      <Container className="space-y-10">
        <SectionHeader as="h1" title={t("title")} description={t("description")} />
        <JobBoard />
      </Container>
    </Section>
  );
}
