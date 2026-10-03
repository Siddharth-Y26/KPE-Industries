import type { ReactNode } from "react";

export function Eyebrow({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  return (
    <p
      className={`flex items-center gap-3 font-display text-xs font-semibold uppercase tracking-[0.22em] ${
        tone === "dark" ? "text-steel-300" : "text-navy-700"
      }`}
    >
      <span aria-hidden="true" className="h-2 w-2 shrink-0 bg-gold-500" />
      {children}
    </p>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({ eyebrow, title, children, tone = "light", className = "" }: SectionHeadingProps) {
  return (
    <div data-reveal className={`max-w-3xl ${className}`}>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2
        className={`mt-5 text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl lg:text-[2.9rem] ${
          tone === "dark" ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      {children ? (
        <div className={`mt-5 text-lg leading-relaxed ${tone === "dark" ? "text-steel-200" : "text-steel-500"}`}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
