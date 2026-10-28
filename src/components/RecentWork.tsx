import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { projects } from "@/lib/projects";
import Reveal from "./Reveal";

export default async function RecentWork() {
  const t = await getTranslations("work");

  return (
    <section id="work" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <h2 className="font-display text-5xl font-bold">{t("title")}</h2>
          <p className="mt-3 max-w-xl text-lg text-black/70">{t("intro")}</p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:auto-rows-[14rem] md:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.key} delay={i * 90} outerClassName={p.wide ? "md:col-span-2" : ""}>
              <figure className="tile cut-corner group relative h-full min-h-56 overflow-hidden bg-paper">
                <Image
                  src={p.image}
                  alt={t(`items.${p.key}.title`)}
                  fill
                  priority={i === 0}
                  sizes={p.wide ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute bottom-0 left-0 bg-brand-black px-3 py-2 text-white">
                  <span className="block font-display text-xl font-bold leading-tight">{t(`items.${p.key}.title`)}</span>
                  <span className="block text-sm text-brand-yellow">{t(`items.${p.key}.tag`)}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
