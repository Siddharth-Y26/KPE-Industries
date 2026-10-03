import type { CSSProperties } from "react";

// A number that counts up from zero when it scrolls into view. MotionObserver drives
// the animation; see .countup in globals.css.
// The real value is separate, ordinary text for screen readers and search engines, and
// the page shows the final number if the script never runs.
export function CountUp({ value }: { value: number }) {
  return (
    <>
      <span className="sr-only">{value}</span>
      <span
        aria-hidden="true"
        className="countup"
        data-countup={value}
        // Reserve the final width so nothing beside the number moves while it counts.
        style={{ minWidth: `${String(value).length}ch` }}
      >
        {value}
      </span>
    </>
  );
}

// Stagger for [data-reveal] children: style={revealDelay(index)}
export function revealDelay(index: number, step = 90): CSSProperties {
  return { "--reveal-delay": `${index * step}ms` } as CSSProperties;
}
