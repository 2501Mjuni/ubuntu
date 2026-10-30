import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import { HeroExplorer } from "./HeroExplorer";

export function Hero() {
  const t = useTranslations("home.hero");
  const cta = useTranslations("cta");
  return (
    <section className="hero-section">
      <Container>
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" />{t("eyebrow")}</p>
            <h1 className="hero-title">{t("titleStart")}<br /><em>{t("titleAccent")}</em><br />{t("titleEnd")}</h1>
            <p className="hero-description">{t("subtitle")}</p>
            <div className="hero-actions flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/hire">{cta("hireTalent")}<ArrowUpRight aria-hidden /></Link></Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/jobs">{cta("findJob")}<ArrowUpRight aria-hidden /></Link>
              </Button>
            </div>
            <p className="hero-location"><MapPin className="size-4" aria-hidden />{t("location")}</p>
          </div>
          <HeroExplorer />
        </div>
        <div className="hero-bottom">
          <Link href="/#services" className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold"><span className="scroll-circle"><ArrowDown className="size-4" aria-hidden /></span>{t("scroll")}</Link>
          <div className="hero-principles" aria-hidden><span>{t("people")}</span><i /><span>{t("purpose")}</span><i /><span>{t("progress")}</span></div>
        </div>
      </Container>
    </section>
  );
}
