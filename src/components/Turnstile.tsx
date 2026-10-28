"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, o: { sitekey: string; callback: (t: string) => void; "expired-callback": () => void }) => string;
    };
  }
}

export const turnstileEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

// Cloudflare Turnstile widget. Renders nothing when no site key is configured.
export default function Turnstile({ onToken }: { onToken: (t: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    const el = ref.current;
    if (!key || !el) return;
    let rendered = false;
    const render = () => {
      if (rendered || !window.turnstile) return;
      rendered = true;
      window.turnstile.render(el, { sitekey: key, callback: onToken, "expired-callback": () => onToken("") });
    };
    if (window.turnstile) return render();
    let script = document.getElementById("turnstile-script") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", render);
    return () => script?.removeEventListener("load", render);
  }, [key, onToken]);

  return key ? <div ref={ref} className="mt-2" /> : null;
}
