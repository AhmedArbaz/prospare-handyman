import { getTranslations } from "next-intl/server";
import { BrickWall, Fence, Flame, PaintRoller, TreePine, Tv } from "lucide-react";
import { projects, type Tone } from "@/lib/projects";
import Reveal from "./Reveal";

const toneClass: Record<Tone, string> = {
  orange: "bg-brand-orange text-brand-black",
  yellow: "bg-brand-yellow text-brand-black",
  black: "bg-brand-black text-white",
  paper: "bg-paper text-brand-black",
};

const icons = { tv: Tv, deck: Fence, painting: PaintRoller, fireplace: Flame, patching: BrickWall, holiday: TreePine };

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
          {projects.map((p, i) => {
            const Icon = icons[p.key];
            return (
              <Reveal key={p.key} delay={i * 90} outerClassName={i === 0 ? "md:col-span-2 md:row-span-2" : ""}>
                <figure className={`tile cut-corner group relative flex h-full min-h-56 flex-col justify-between overflow-hidden p-5 ${toneClass[p.tone]}`}>
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={t(`items.${p.key}.title`)} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <>
                      <span className="tile-wipe" aria-hidden="true" />
                      <Icon aria-hidden="true" strokeWidth={1.5} className={`relative transition-colors group-hover:text-brand-black ${i === 0 ? "h-24 w-24" : "h-14 w-14"}`} />
                    </>
                  )}
                  <figcaption className="relative mt-auto self-start bg-brand-black px-3 py-2 text-white">
                    <span className="block font-display text-xl font-bold leading-tight">{t(`items.${p.key}.title`)}</span>
                    <span className="block text-sm text-brand-yellow">{t(`items.${p.key}.tag`)}</span>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
