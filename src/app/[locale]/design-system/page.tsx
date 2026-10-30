import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { DesignSystemDemo } from "./Demo";

export const metadata = { title: "Design system", robots: { index: false, follow: false } };

export default async function DesignSystemPage({ params }: PageProps<"/[locale]/design-system">) {
  if (process.env.NODE_ENV === "production") notFound(); // development only
  const { locale } = await params;
  setRequestLocale(locale);
  return <DesignSystemDemo />;
}
