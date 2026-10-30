"use client";

import { ArrowUpRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { serviceSlugs } from "@/types/api";
import { CommandPalette } from "./CommandPalette";
import { LanguageSwitcher } from "./LanguageSwitcher";

const linkStyle = "nav-link flex min-h-11 items-center rounded-md px-3 text-[0.875rem] font-semibold text-christalle transition-colors hover:bg-surface";

export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("cta");
  const names = useTranslations("services.names");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  // Ctrl/Cmd+K opens the global search from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearchOpen((o) => !o); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close menus on navigation (state adjusted during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setServicesOpen(false);
  }

  // Close the services popover on outside click or Escape.
  useEffect(() => {
    if (!servicesOpen) return;
    const onClick = (e: MouseEvent) => !servicesRef.current?.contains(e.target as Node) && setServicesOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setServicesOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [servicesOpen]);

    const jobLink = <Link href="/jobs">{tc("findJob")}</Link>;

  return (
    <header className="site-header sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/85">
      <Container className="flex h-22 items-center justify-between gap-4">
        <Link href="/" aria-label={t("homeLink")} className="shrink-0">
          <Image src="/brand/logo-horizontal.webp" alt="Ubuntu Impact" width={150} height={47} priority className="h-10 w-auto sm:h-11" />
        </Link>

        <nav aria-label={t("label")} className="hidden items-center gap-1 lg:flex">
          <div ref={servicesRef} className="relative">
            <button type="button" aria-expanded={servicesOpen} aria-controls="services-menu" onClick={() => setServicesOpen((o) => !o)} className={cn(linkStyle, "gap-1")}>
              {t("services")}
              <ChevronDown className={cn("size-4 transition-transform", servicesOpen && "rotate-180")} aria-hidden />
            </button>
            {servicesOpen && (
              <ul id="services-menu" aria-label={t("servicesMenu")} className="absolute top-full left-0 mt-2 w-64 rounded-lg border border-line bg-white p-2 shadow-lg">
                {serviceSlugs.map((s) => (
                  <li key={s}><Link href={`/services/${s}`} className="flex min-h-11 items-center rounded-md px-3 font-semibold text-christalle hover:bg-chalk/60">{names(s)}</Link></li>
                ))}
              </ul>
            )}
          </div>
          <Link href="/jobs" aria-current={pathname === "/jobs" ? "page" : undefined} className={linkStyle}>{t("jobs")}</Link>
          <Link href="/events" aria-current={pathname === "/events" ? "page" : undefined} className={linkStyle}>{t("events")}</Link>
          <Link href="/about" aria-current={pathname === "/about" ? "page" : undefined} className={linkStyle}>{t("about")}</Link>
          <Link href="/blog" aria-current={pathname === "/blog" ? "page" : undefined} className={linkStyle}>{t("blog")}</Link>
          <Link href="/contact" aria-current={pathname === "/contact" ? "page" : undefined} className={linkStyle}>{t("contact")}</Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button type="button" onClick={() => setSearchOpen(true)} aria-label={t("searchHint")} title={t("searchHint")} className="flex size-11 items-center justify-center rounded-full text-christalle hover:bg-surface"><Search className="size-5" aria-hidden /></button>
          <LanguageSwitcher />
          <Button asChild variant="secondary" size="sm" className="hidden xl:inline-flex">{jobLink}</Button>
          <Button asChild size="sm"><Link href="/hire">{tc("hireTalent")}<ArrowUpRight aria-hidden /></Link></Button>
        </div>

        <button type="button" onClick={() => setSearchOpen(true)} aria-label={t("searchHint")} className="ml-auto flex size-11 items-center justify-center rounded-full text-christalle hover:bg-surface lg:hidden"><Search className="size-5" aria-hidden /></button>
        <button type="button" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? t("closeMenu") : t("openMenu")} className="flex size-11 items-center justify-center rounded-full text-christalle hover:bg-surface lg:hidden">
          {menuOpen ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
        </button>
      </Container>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-line bg-white lg:hidden">
          <Container className="space-y-4 py-4">
            <nav aria-label={t("label")} className="flex flex-col">
              <p className="px-4 pt-2 pb-1 text-xs font-bold tracking-widest text-violet uppercase">{t("services")}</p>
              {serviceSlugs.map((s) => <Link key={s} href={`/services/${s}`} className={linkStyle}>{names(s)}</Link>)}
              <div className="my-2 h-px bg-line" />
              <Link href="/jobs" aria-current={pathname === "/jobs" ? "page" : undefined} className={linkStyle}>{t("jobs")}</Link>
              <Link href="/events" aria-current={pathname === "/events" ? "page" : undefined} className={linkStyle}>{t("events")}</Link>
              <Link href="/about" aria-current={pathname === "/about" ? "page" : undefined} className={linkStyle}>{t("about")}</Link>
              <Link href="/blog" aria-current={pathname === "/blog" ? "page" : undefined} className={linkStyle}>{t("blog")}</Link>
              <Link href="/contact" aria-current={pathname === "/contact" ? "page" : undefined} className={linkStyle}>{t("contact")}</Link>
            </nav>
            <div className="flex flex-col gap-3">
              <Button asChild variant="secondary">{jobLink}</Button>
              <Button asChild><Link href="/hire">{tc("hireTalent")}<ArrowUpRight aria-hidden /></Link></Button>
            </div>
            <LanguageSwitcher />
          </Container>
        </div>
      )}
      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
