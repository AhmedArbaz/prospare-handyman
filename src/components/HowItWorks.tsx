import { getTranslations } from "next-intl/server";
import Reveal from "./Reveal";

const steps = ["one", "two", "three"] as const;

export default async function HowItWorks() {
  const t = await getTranslations("how");

  return (
    <section id="how" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <h2 className="font-display text-5xl font-bold">{t("title")}</h2>
        </Reveal>
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s}>
              <Reveal delay={i * 150} className="flex gap-5">
                <span className="font-display text-7xl font-extrabold leading-none text-brand-orange" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className="font-display text-2xl font-bold">{t(`steps.${s}.title`)}</h3>
                  <p className="mt-2 text-black/70">{t(`steps.${s}.desc`)}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
