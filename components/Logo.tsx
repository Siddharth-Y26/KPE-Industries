// PLACEHOLDER IDENTITY. The company profile contains no logo, so this is a plain
// wordmark with a bolt mark. Replace this component (and app/icon.svg) when the
// client supplies a logo.

export function LogoMark({ tone = "light", className = "h-10 w-10" }: { tone?: "light" | "dark"; className?: string }) {
  const square = tone === "dark" ? "#f2a900" : "#0b2545";
  const bolt = tone === "dark" ? "#071528" : "#f2a900";
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <rect width="40" height="40" rx="2" fill={square} />
      <path d="M22.5 6 11 22.2h7.2L16 34l12.8-17.2h-7.6L22.5 6Z" fill={bolt} />
    </svg>
  );
}

export function Logo({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark tone={tone} className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
      <span className="leading-none">
        <span
          className={`block font-display text-[1.02rem] font-bold tracking-tight sm:text-[1.12rem] ${
            tone === "dark" ? "text-white" : "text-navy-900"
          }`}
        >
          Krishna Power
        </span>
        <span
          className={`mt-1.5 block font-display text-[0.6rem] font-semibold uppercase tracking-[0.3em] ${
            tone === "dark" ? "text-steel-300" : "text-steel-500"
          }`}
        >
          &amp; Engineers
        </span>
      </span>
    </span>
  );
}
