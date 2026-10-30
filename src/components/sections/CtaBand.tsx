import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";

export function CtaBand({ title, description, primary, secondary }: { title?: string; description?: string; primary?: { href: string; label: string }; secondary?: { href: string; label: string } }) {
  const t = useTranslations("home.finalCta");
  const cta = useTranslations("cta");
  return (
    <section className="cta-section">
      <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-3xl font-bold md:text-4xl">{title ?? t("title")}</h2>
          <p className="text-lg text-white/85">{description ?? t("description")}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="light" size="lg"><Link href={primary?.href ?? "/hire"}>{primary?.label ?? cta("hireTalent")}</Link></Button>
          <Button asChild variant="outline-light" size="lg"><Link href={secondary?.href ?? "/contact"}>{secondary?.label ?? cta("getInTouch")}</Link></Button>
        </div>
      </Container>
    </section>
  );
}
