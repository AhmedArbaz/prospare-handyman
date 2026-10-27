import { getTranslations } from "next-intl/server";
import { BrickWall, Droplets, Fence, Flame, PaintRoller, TreePine, Tv, Zap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Reveal from "./Reveal";

const items = [
  { key: "holiday", icon: TreePine },
  { key: "electrical", icon: Zap },
  { key: "tv", icon: Tv },
  { key: "fireplace", icon: Flame },
  { key: "plumbing", icon: Droplets },
  { key: "patching", icon: BrickWall },
  { key: "painting", icon: PaintRoller },
  { key: "deck", icon: Fence },
] as const;

export default async function Services() {
  const t = await getTranslations("services");

  return (
    <section id="services" className="bg-paper py-20">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <h2 className="font-display text-5xl font-bold">{t("title")}</h2>
          <p className="mt-3 max-w-xl text-lg text-black/70">{t("intro")}</p>
        </Reveal>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ key, icon: Icon }, i) => (
            <li key={key}>
              <Reveal delay={i * 70} outerClassName="h-full">
                <div className="service-card group h-full border-t-4 border-brand-black bg-white p-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <div className="-mx-5 -mt-5 h-40 overflow-hidden bg-paper">
                    <img src={`/images/services/${key}.svg`} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <span className="relative -mt-6 flex h-12 w-12 ring-4 ring-white items-center justify-center bg-brand-yellow transition-colors group-hover:bg-brand-black group-hover:text-brand-yellow">
                    <Icon aria-hidden="true" size={26} />
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-bold leading-tight">{t(`items.${key}.title`)}</h3>
                  <p className="mt-2 text-black/70 group-hover:text-brand-black">{t(`items.${key}.desc`)}</p>
                  <Link
                    href={{ pathname: "/book", query: { service: key } }}
                    className="mt-4 inline-block font-semibold underline decoration-brand-orange decoration-4 underline-offset-4 group-hover:decoration-brand-black"
                  >
                    {t("book")}
                  </Link>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
