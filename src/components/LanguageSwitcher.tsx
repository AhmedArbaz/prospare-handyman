"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const labels = { en: "EN", fr: "FR", es: "ES" } as const;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div role="group" aria-label="Language" className="flex overflow-hidden rounded border border-white/30 text-sm font-semibold">
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          translate="no"
          aria-pressed={l === locale}
          onClick={() => router.replace(pathname, { locale: l })}
          className={
            l === locale
              ? "bg-brand-yellow px-2.5 py-1.5 text-brand-black"
              : "px-2.5 py-1.5 text-white hover:bg-white/15"
          }
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
