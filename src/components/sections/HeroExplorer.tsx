"use client";

import { ArrowUpRight, GraduationCap, PartyPopper, Users, UserSearch } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { serviceSlugs } from "@/types/api";

const icons = [UserSearch, GraduationCap, Users, PartyPopper];

export function HeroExplorer() {
  const t = useTranslations("home.hero");
  const names = useTranslations("services.names");
  const common = useTranslations("common");
  const [selected, setSelected] = useState(0);
  const Icon = icons[selected];
  const descriptions = t.raw("serviceDescriptions") as string[];

  return (
    <div className="impact-explorer">
      <div className="explorer-heading"><span className="eyebrow">{t("visualLabel")}</span><span className="explorer-edition" aria-hidden>UI / 04</span></div>
      <div className="impact-orbit" aria-hidden>
        <div className="orbit-ring orbit-ring-outer" /><div className="orbit-ring orbit-ring-inner" />
        <div className="orbit-axis" />
        <div className="orbit-core"><Image src="/brand/mark.webp" alt="" width={90} height={90} className="size-20 object-contain" /><span>ubuntu impact</span></div>
        {icons.map((NodeIcon, i) => <div key={i} className={`orbit-node orbit-node-${i} ${selected === i ? "is-active" : ""}`}><NodeIcon /><span>0{i + 1}</span></div>)}
        <span className="orbit-spark orbit-spark-one" /><span className="orbit-spark orbit-spark-two" />
        <span className="orbit-caption">{t("visualNote")}</span>
      </div>
      <div className="explorer-panel">
        <p className="explorer-prompt">{t("selectService")}</p>
        <div className="explorer-options" role="group" aria-label={t("explore")}>
          {serviceSlugs.map((slug, i) => <button key={slug} type="button" aria-pressed={selected === i} onClick={() => setSelected(i)} className={selected === i ? "is-active" : ""}><span className="sr-only">{names(slug)} </span>0{i + 1}</button>)}
        </div>
        <div className="explorer-detail" aria-live="polite" aria-atomic="true">
          <span className="explorer-service-icon"><Icon aria-hidden /></span>
          <div><h2>{names(serviceSlugs[selected])}</h2><p>{descriptions[selected]}</p></div>
          <Link href={`/services/${serviceSlugs[selected]}`} className="explorer-link" aria-label={`${common("learnMore")}: ${names(serviceSlugs[selected])}`}><ArrowUpRight aria-hidden /></Link>
        </div>
      </div>
    </div>
  );
}
