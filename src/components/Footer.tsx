import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import Logo from "./Logo";

export default async function Footer() {
  const t = await getTranslations("footer");
  const n = await getTranslations("nav");

  return (
    <footer className="on-dark bg-brand-black text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="h-12 w-12" />
            <span className="font-display text-2xl font-bold leading-none">
              Prospare
              <span className="block text-sm font-semibold text-brand-yellow">Handyman Work</span>
            </span>
          </div>
          <p className="mt-4 text-white/70">{t("tagline")}</p>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-brand-yellow">{t("explore")}</h2>
          <ul className="mt-3 space-y-2">
            <li><Link href="/#work" className="hover:text-brand-yellow">{n("work")}</Link></li>
            <li><Link href="/#services" className="hover:text-brand-yellow">{n("services")}</Link></li>
            <li><Link href="/#how" className="hover:text-brand-yellow">{n("how")}</Link></li>
            <li><Link href="/book" className="hover:text-brand-yellow">{n("book")}</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-brand-yellow">{t("contact")}</h2>
          <ul className="mt-3 space-y-2">
            <li><a href={`tel:${site.phoneHref}`} className="hover:text-brand-yellow">{site.phoneDisplay}</a></li>
            <li><a href={`mailto:${site.email}`} className="hover:text-brand-yellow">{site.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15 py-5 text-center text-sm text-white/60">
        © {new Date().getFullYear()} {site.name}. {t("rights")}
      </div>
    </footer>
  );
}
