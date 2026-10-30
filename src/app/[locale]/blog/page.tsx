import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogList } from "@/components/sections/BlogList";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/blog", namespace: "blog" });
}

export default async function BlogPage({ params }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  return (
    <Section>
      <Container className="space-y-10">
        <SectionHeader as="h1" title={t("title")} description={t("description")} />
        <BlogList />
      </Container>
    </Section>
  );
}
