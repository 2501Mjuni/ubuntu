import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { NewsletterForm } from "@/components/forms/LeadForms";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import { serviceSlugs } from "@/types/api";

async function year() {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer() {
  const [t, names, nav, nl, cta] = await Promise.all([getTranslations("footer"), getTranslations("services.names"), getTranslations("nav"), getTranslations("newsletter"), getTranslations("cta")]);
  const link = "inline-flex min-h-11 items-center text-white/85 hover:text-white hover:underline";
  return (
    <footer className="site-footer bg-christalle text-white">
      <Container className="py-14">
        <div className="newsletter-panel mb-16 grid gap-6 rounded-lg border border-white/15 bg-white/5 p-6 md:grid-cols-2 md:items-center md:p-8">
          <div>
            <h2 className="text-xl font-bold">{nl("title")}</h2>
            <p className="mt-1 text-white/75">{nl("description")}</p>
          </div>
          <NewsletterForm />
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Image src="/brand/logo-horizontal-white.webp" alt="Ubuntu Impact" width={180} height={56} className="h-12 w-auto" />
            <p className="max-w-xs text-white/75">{t("tagline")}</p>
          </div>
          <nav aria-label={t("services")}>
            <h2 className="mb-2 text-sm font-bold tracking-widest text-chalk uppercase">{t("services")}</h2>
            <ul>{serviceSlugs.map((s) => <li key={s}><Link href={`/services/${s}`} className={link}>{names(s)}</Link></li>)}</ul>
          </nav>
          <nav aria-label={t("company")}>
            <h2 className="mb-2 text-sm font-bold tracking-widest text-chalk uppercase">{t("company")}</h2>
            <ul>
              <li><Link href="/about" className={link}>{nav("about")}</Link></li>
              <li><Link href="/blog" className={link}>{nav("blog")}</Link></li>
              <li><Link href="/contact" className={link}>{nav("contact")}</Link></li>
              <li><Link href="/hire" className={link}>{cta("hireTalent")}</Link></li>
            </ul>
          </nav>
          <div>
            <h2 className="mb-2 text-sm font-bold tracking-widest text-chalk uppercase">{t("contactHeading")}</h2>
            <ul className="space-y-2 text-white/85">
              <li className="flex items-start gap-2"><MapPin className="mt-1 size-4 shrink-0" aria-hidden />{t("addressPlaceholder")}</li>
              <li className="flex items-start gap-2"><Mail className="mt-1 size-4 shrink-0" aria-hidden />{t("emailPlaceholder")}</li>
              <li className="flex items-start gap-2"><Phone className="mt-1 size-4 shrink-0" aria-hidden />{t("phonePlaceholder")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-sm text-white/75 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("rights", { year: await year() })}</p>
          <nav aria-label={t("legal")}>
            <ul className="flex flex-wrap gap-x-4">
              <li><Link href="/privacy" className={link}>{t("privacy")}</Link></li>
              <li><Link href="/cookies" className={link}>{t("cookies")}</Link></li>
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
