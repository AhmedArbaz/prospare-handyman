export default function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <rect width="200" height="200" rx="36" fill="#0A0A0A" />
      <path d="M38 102 L100 46 L162 102" fill="none" stroke="#F97316" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="62" y="106" width="76" height="62" rx="6" fill="#F97316" />
      <rect x="90" y="128" width="20" height="40" rx="3" fill="#FACC15" />
    </svg>
  );
}
