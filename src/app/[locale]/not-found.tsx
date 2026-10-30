import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("errors");
  const c = await getTranslations("common");
  return (
    <Container className="flex min-h-[60vh] flex-col items-start justify-center gap-5 py-20">
      <p className="text-6xl font-extrabold text-ribbon">404</p>
      <h1 className="text-3xl font-bold text-christalle">{t("notFoundTitle")}</h1>
      <p className="max-w-lg text-lg text-ink-muted">{t("notFoundText")}</p>
      <Button asChild><Link href="/">{c("backHome")}</Link></Button>
    </Container>
  );
}
