import type { CSSProperties } from "react";

// A number that counts up from zero (see .countup in globals.css).
// The real value is ordinary text for screen readers and search engines; the animated
// copy is presentation only.
export function CountUp({ value }: { value: number }) {
  return (
    <>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="countup" style={{ "--to": value } as CSSProperties} />
    </>
  );
}

// Stagger for [data-reveal] children: style={revealDelay(index)}
export function revealDelay(index: number, step = 90): CSSProperties {
  return { "--reveal-delay": `${index * step}ms` } as CSSProperties;
}
