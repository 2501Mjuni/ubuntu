import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hanken_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/layout/JsonLd";
import { Providers } from "@/components/layout/Providers";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/utils";
import "../globals.css";

// Brand typeface is not yet confirmed; Hanken Grotesk is a close geometric grotesque. Swap it here only.
const brandFont = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-brand", display: "swap" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#40006a", width: "device-width", initialScale: 1 };

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t("defaultTitle"), template: t("titleTemplate") },
    description: t("defaultDescription"),
    applicationName: t("siteName"),
    manifest: "/manifest.webmanifest",
    openGraph: { type: "website", siteName: t("siteName"), locale: locale === "sw" ? "sw_TZ" : "en_TZ" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const common = await getTranslations("common");

  return (
    <html lang={locale} data-scroll-behavior="smooth" className={brandFont.variable}>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <Providers>
            <a href="#main" className="sr-only z-50 rounded-full bg-white px-5 py-3 font-bold text-christalle focus:not-sr-only focus:fixed focus:top-3 focus:left-3">{common("skipToContent")}</a>
            <Header />
            <main id="main" tabIndex={-1} className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
        <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", name: "Ubuntu Impact Limited", url: siteUrl, logo: `${siteUrl}/icons/icon-512.png`, description: "Human Capital Consulting Partner in Tanzania", areaServed: "TZ" }} />
      </body>
    </html>
  );
}
