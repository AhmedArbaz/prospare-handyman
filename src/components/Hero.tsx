import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Ruler from "./Ruler";
import HeroBackdrop from "./HeroBackdrop";

export default async function Hero() {
  const t = await getTranslations("hero");
  const rows = [
    ["job", "jobValue"],
    ["place", "placeValue"],
    ["photos", "photosValue"],
    ["day", "dayValue"],
  ] as const;

  return (
    <section className="on-dark relative overflow-hidden bg-brand-black text-white">
      <HeroBackdrop />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-14 md:grid-cols-[1.25fr_1fr] md:items-center md:pt-20">
        <div>
          <h1 className="hero-title font-display text-6xl font-extrabold leading-[0.95] sm:text-7xl lg:text-8xl">{t("title")}</h1>
          <p className="mt-6 max-w-xl text-lg text-white/80">{t("subtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/book" className="rounded bg-brand-orange px-6 py-3 text-lg font-semibold text-brand-black hover:bg-brand-yellow">
              {t("ctaBook")}
            </Link>
            <Link href="/#work" className="rounded border-2 border-white px-6 py-3 text-lg font-semibold hover:border-brand-yellow hover:text-brand-yellow">
              {t("ctaWork")}
            </Link>
          </div>
        </div>

        <div aria-hidden="true" className="cut-corner float-slow border-l-8 border-brand-orange bg-white p-6 text-brand-black">
          <div className="flex items-center justify-between border-b-2 border-brand-black pb-3">
            <span className="font-display text-3xl font-bold">{t("ticket.title")}</span>
            <span className="rounded bg-brand-yellow px-2 py-1 text-sm font-semibold">{t("ticket.status")}</span>
          </div>
          <dl className="mt-4 space-y-4">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm text-black/60">{t(`ticket.${label}`)}</dt>
                <dd className="text-lg font-semibold">{t(`ticket.${value}`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="relative"><Ruler /></div>
    </section>
  );
}
