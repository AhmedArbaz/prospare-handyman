"use client";

import { useEffect, useRef, useState } from "react";

// Clip-path reveal on scroll. The outer box is observed (never clipped);
// the inner box carries the clip-path, otherwise the observer sees zero area and never fires.
export default function Reveal({
  children,
  className = "",
  outerClassName = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  outerClassName?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={outerClassName}>
      <div style={{ transitionDelay: `${delay}ms` }} className={`reveal h-full ${seen ? "in" : ""} ${className}`}>
        {children}
      </div>
    </div>
  );
}
