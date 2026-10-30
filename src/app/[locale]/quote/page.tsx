import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { QuoteFormWithParams } from "@/components/forms/QuoteFormWithParams";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/quote">) {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/quote", namespace: "quote" });
}

export default async function QuotePage({ params }: PageProps<"/[locale]/quote">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("forms.quote");
  return (
    <Section>
      <Container className="max-w-3xl space-y-10">
        <SectionHeader as="h1" title={t("title")} description={t("description")} />
        <Suspense fallback={<Skeleton className="h-96 w-full" />}><QuoteFormWithParams /></Suspense>
      </Container>
    </Section>
  );
}
