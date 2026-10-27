"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/#work", label: t("work") },
    { href: "/#services", label: t("services") },
    { href: "/#how", label: t("how") },
    { href: "/#contact", label: t("contact") },
  ];

  return (
    <header className="on-dark sticky top-0 z-50 bg-brand-black text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-3" aria-label={site.name}>
          <Logo />
          <span className="font-display text-2xl font-bold leading-none tracking-wide">
            Prospare
            <span className="block text-sm font-semibold tracking-wider text-brand-yellow">Handyman Work</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="font-medium text-white/85 hover:text-brand-yellow">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/book" className="hidden rounded bg-brand-orange px-4 py-2 font-semibold text-brand-black hover:bg-brand-yellow md:inline-block">
            {t("book")}
          </Link>
          <button
            type="button"
            className="p-1 md:hidden"
            aria-expanded={open}
            aria-label={t("menu")}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Mobile" className="border-t border-white/15 px-5 pb-5 md:hidden">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="block border-b border-white/10 py-3 text-lg font-medium">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/book" onClick={() => setOpen(false)} className="mt-4 block rounded bg-brand-orange px-4 py-3 text-center font-semibold text-brand-black">
            {t("book")}
          </Link>
        </nav>
      )}
    </header>
  );
}
