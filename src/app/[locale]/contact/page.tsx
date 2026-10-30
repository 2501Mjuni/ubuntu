import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/forms/LeadForms";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { pageMetadata } from "@/lib/seo";

// Placeholder map area until the office address is confirmed. Override with NEXT_PUBLIC_MAPS_QUERY.
const mapsQuery = process.env.NEXT_PUBLIC_MAPS_QUERY ?? "Dar es Salaam, Tanzania";
const whatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  return pageMetadata({ locale, path: "/contact", namespace: "contact" });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, footer] = await Promise.all([getTranslations("contact"), getTranslations("footer")]);
  const row = "flex items-start gap-3";
  return (
    <Section>
      <Container className="space-y-12">
        <SectionHeader as="h1" title={t("title")} description={t("description")} />
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-christalle">{t("formTitle")}</h2>
            <ContactForm />
          </div>
          <div className="space-y-6">
            <Card className="space-y-4">
              <h2 className="text-2xl font-bold text-christalle">{t("detailsTitle")}</h2>
              <ul className="space-y-3 text-ink-muted">
                <li className={row}><MapPin className="mt-1 size-5 shrink-0 text-violet" aria-hidden /><span><strong className="text-ink">{t("address")}:</strong> {footer("addressPlaceholder")}</span></li>
                <li className={row}><Mail className="mt-1 size-5 shrink-0 text-violet" aria-hidden /><span><strong className="text-ink">{t("email")}:</strong> {footer("emailPlaceholder")}</span></li>
                <li className={row}><Phone className="mt-1 size-5 shrink-0 text-violet" aria-hidden /><span><strong className="text-ink">{t("phone")}:</strong> {footer("phonePlaceholder")}</span></li>
                <li className={row}><Clock className="mt-1 size-5 shrink-0 text-violet" aria-hidden /><span><strong className="text-ink">{t("hours")}:</strong> {t("hoursValue")}</span></li>
              </ul>
              {whatsapp ? (
                <Button asChild variant="accent"><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden />{t("whatsapp")}</a></Button>
              ) : (
                <Button variant="accent" disabled aria-disabled title={t("whatsappMissing")}><MessageCircle aria-hidden />{t("whatsapp")}</Button>
              )}
              {!whatsapp && <p className="text-xs text-ink-muted">{t("whatsappMissing")}</p>}
            </Card>
            <iframe
              title={t("mapTitle")}
              src={`https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full rounded-lg border border-line"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
