import { siteConfig } from "@/config/site";

// The company's KPE roundel, traced from the logo the client supplied. The drawing is
// public/logo.svg; app/icon.svg (the browser tab icon) is a copy of the same file.
export function LogoMark({ tone = "light", className = "h-10 w-10" }: { tone?: "light" | "dark"; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a static SVG; nothing for next/image to optimise
    <img
      src={`${siteConfig.basePath}/logo.svg`}
      alt=""
      width={200}
      height={200}
      // On navy the roundel's own blue is close to the background, so a pale ring marks its edge.
      className={`rounded-full ${tone === "dark" ? "ring-1 ring-white/40" : ""} ${className}`}
    />
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
