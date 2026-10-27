import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";

// Placeholder. The real booking form is built in Step 4.
export default async function BookPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("book");

  return (
    <section className="mx-auto max-w-3xl px-5 py-24">
      <h1 className="font-display text-6xl font-extrabold">{t("title")}</h1>
      <p className="mt-4 text-lg text-black/70">{t("intro")}</p>
      <p className="mt-6 text-lg font-semibold">
        <a href={`tel:${site.phoneHref}`} className="underline decoration-brand-orange decoration-4 underline-offset-4">{site.phoneDisplay}</a>
        {" / "}
        <a href={`mailto:${site.email}`} className="underline decoration-brand-orange decoration-4 underline-offset-4">{site.email}</a>
      </p>
      <Link href="/" className="mt-8 inline-block rounded bg-brand-orange px-6 py-3 font-semibold text-brand-black hover:bg-brand-yellow">
        {t("back")}
      </Link>
    </section>
  );
}
