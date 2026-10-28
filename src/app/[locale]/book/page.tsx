import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import BookingForm from "@/components/BookingForm";

export default async function BookPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("book");

  return (
    <section className="bg-paper py-14">
      <div className="mx-auto max-w-6xl px-5">
        <h1 className="font-display text-6xl font-extrabold">{t("title")}</h1>
        <p className="mt-3 max-w-2xl text-lg text-black/70">{t("intro")}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.7fr_1fr] lg:items-start">
          <Suspense fallback={null}>
            <BookingForm />
          </Suspense>

          <aside className="on-dark bg-brand-black p-6 text-white lg:sticky lg:top-24">
            <h2 className="font-display text-3xl font-bold text-brand-yellow">{t("side.title")}</h2>
            <p className="mt-2 text-white/80">{t("side.text")}</p>
            <ul className="mt-5 space-y-3 font-semibold">
              <li><a href={`tel:${site.phoneHref}`} className="flex items-center gap-3 hover:text-brand-yellow"><Phone size={20} aria-hidden="true" /> {site.phoneDisplay}</a></li>
              <li><a href={`mailto:${site.email}`} className="flex items-center gap-3 hover:text-brand-yellow"><Mail size={20} aria-hidden="true" /> {site.email}</a></li>
            </ul>
            <Link href="/" className="mt-6 inline-block underline decoration-brand-orange decoration-4 underline-offset-4 hover:text-brand-yellow">{t("back")}</Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
