import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "navy" | "outline" | "outline-light" | "outline-dark" | "whatsapp";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-display font-semibold tracking-wide transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-gold-500 text-navy-950 hover:bg-gold-400",
  navy: "bg-navy-900 text-white hover:bg-navy-800",
  outline: "border border-navy-900/25 text-navy-900 hover:border-navy-900 hover:bg-navy-900 hover:text-white",
  "outline-light": "border border-white/30 text-white hover:border-white hover:bg-white hover:text-navy-950",
  "outline-dark": "border border-navy-950/40 text-navy-950 hover:border-navy-950 hover:bg-navy-950 hover:text-white",
  whatsapp: "bg-whatsapp text-white hover:brightness-110",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-13 px-7 text-[0.95rem]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
};

export function ButtonLink({ href, children, variant, size, className, external }: ButtonLinkProps) {
  const classes = buttonClass(variant, size, className);
  if (external || /^(https?:|tel:|mailto:)/.test(href)) {
    const newTab = href.startsWith("http");
    return (
      <a href={href} className={classes} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
