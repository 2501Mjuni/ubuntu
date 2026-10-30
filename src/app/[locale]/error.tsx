"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("errors");
  const c = useTranslations("common");
  return (
    <Container className="flex min-h-[60vh] flex-col items-start justify-center gap-5 py-20">
      <h1 className="text-3xl font-bold text-christalle">{t("errorTitle")}</h1>
      <p className="max-w-lg text-lg text-ink-muted">{t("errorText")}</p>
      <div className="flex gap-3">
        <Button onClick={reset}>{t("tryAgain")}</Button>
        <Button asChild variant="secondary"><Link href="/">{c("backHome")}</Link></Button>
      </div>
    </Container>
  );
}
