import fs from "node:fs";
import path from "node:path";
import { Drill, Hammer, PaintRoller, Ruler as RulerIcon, Wrench } from "lucide-react";

// Drop a real photo at public/images/hero.jpg and it replaces the illustration automatically.
const hasPhoto = fs.existsSync(path.join(process.cwd(), "public", "images", "hero.jpg"));

const tools = [
  { Icon: Hammer, cls: "left-[4%] top-[12%] h-24 w-24 text-brand-orange/25", delay: "0s" },
  { Icon: PaintRoller, cls: "left-[38%] top-[6%] h-20 w-20 text-brand-yellow/25", delay: "1.2s" },
  { Icon: Wrench, cls: "right-[8%] top-[10%] h-28 w-28 text-brand-orange/25", delay: "2.1s" },
  { Icon: Drill, cls: "left-[46%] bottom-[10%] h-28 w-28 text-brand-yellow/25", delay: "0.6s" },
  { Icon: RulerIcon, cls: "left-[8%] bottom-[8%] h-20 w-20 text-brand-orange/25", delay: "1.7s" },
] as const;

export default function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="hero-backdrop absolute inset-0 overflow-hidden">
      {hasPhoto ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero.jpg" alt="" className="hero-photo absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-brand-black/70" />
        </>
      ) : (
        <>
          <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
            <g fill="none" stroke="#FACC15" strokeOpacity="0.18" strokeWidth="2">
              <path d="M120 300 L400 70 L680 300" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="170" y="300" width="460" height="170" />
              <rect x="350" y="370" width="100" height="100" />
              <rect x="210" y="340" width="90" height="60" />
              <rect x="500" y="340" width="90" height="60" />
            </g>
          </svg>
          {tools.map(({ Icon, cls, delay }, i) => (
            <Icon key={i} strokeWidth={1.25} className={`float-slow absolute ${cls}`} style={{ animationDelay: delay }} />
          ))}
        </>
      )}
    </div>
  );
}
