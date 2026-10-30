import { ArrowUpRight, GraduationCap, PartyPopper, Users, UserSearch } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import { loadServices } from "@/lib/api/server";
import type { Lang, ServiceSlug } from "@/types/api";
import { ServerSectionError } from "./ServerSectionError";

const icons: Record<ServiceSlug, typeof Users> = {
  "talent-acquisition": UserSearch, "capacity-building": GraduationCap, "team-building": Users, "event-management": PartyPopper,
};

export async function ServicesGrid() {
  const [lang, t] = await Promise.all([getLocale() as Promise<Lang>, getTranslations("common")]);
  let services;
  try {
    services = await loadServices(lang);
  } catch {
    return <ServerSectionError />;
  }
  return (
    <ul className="services-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((s, i) => {
        const Icon = icons[s.slug];
        return (
          <li key={s.slug}>
            <Card className="service-card group relative flex h-full flex-col gap-5">
              <div className="flex items-start justify-between"><span className="service-icon"><Icon className="size-6" aria-hidden /></span><span className="service-number" aria-hidden>0{i + 1}</span></div>
              <h3 className="text-xl font-bold tracking-tight text-christalle"><Link href={`/services/${s.slug}`} className="after:absolute after:inset-0">{s.title}</Link></h3>
              <p className="flex-1 text-ink-muted">{s.summary}</p>
              <span className="service-action">{t("learnMore")}<ArrowUpRight className="size-4" aria-hidden /></span>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
