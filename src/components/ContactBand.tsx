import { getTranslations } from "next-intl/server";
import { Mail, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";

export default async function ContactBand() {
  const t = await getTranslations("cta");

  return (
    <section id="contact" className="bg-brand-orange py-16 text-brand-black">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-5xl font-extrabold">{t("title")}</h2>
          <p className="mt-2 text-lg">{t("subtitle")}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/book" className="rounded bg-brand-black px-6 py-3 text-lg font-semibold text-white hover:bg-white hover:text-brand-black">
            {t("book")}
          </Link>
          <a href={`tel:${site.phoneHref}`} className="flex items-center gap-2 rounded border-2 border-brand-black px-5 py-3 text-lg font-semibold hover:bg-brand-black hover:text-white">
            <Phone size={20} aria-hidden="true" /> {t("call")}
          </a>
          <a href={`mailto:${site.email}`} className="flex items-center gap-2 rounded border-2 border-brand-black px-5 py-3 text-lg font-semibold hover:bg-brand-black hover:text-white">
            <Mail size={20} aria-hidden="true" /> {t("email")}
          </a>
        </div>
      </div>
    </section>
  );
}
