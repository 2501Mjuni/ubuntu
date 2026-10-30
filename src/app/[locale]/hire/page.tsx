import { getTranslations, setRequestLocale } from "next-intl/server";
import { HiringEstimator } from "@/components/forms/HiringEstimator";
import { HiringEnquiryForm } from "@/components/forms/LeadForms";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/hire">) {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/hire", namespace: "hire" });
}

export default async function HirePage({ params }: PageProps<"/[locale]/hire">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("forms.hire");
  return (
    <Section>
      <Container className="max-w-3xl space-y-10">
        <SectionHeader as="h1" title={t("title")} description={t("description")} />
        <HiringEstimator />
        <HiringEnquiryForm />
      </Container>
    </Section>
  );
}
