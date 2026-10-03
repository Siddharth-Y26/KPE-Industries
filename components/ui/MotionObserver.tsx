"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const COUNT_DURATION = 2000;
// Lets the section's fade-in finish first, so the count is seen from its start.
const COUNT_DELAY = 300;
// The most time one frame may advance the count. If the phone stalls for a moment, the
// count pauses and carries on instead of leaping ahead.
const MAX_FRAME_STEP = 34;

// Counts an element's text from 0 to its data-countup value. Plain script rather than
// a CSS counter animation, which iOS browsers do not animate.
function countUp(element: HTMLElement) {
  const target = Number(element.dataset.countup);
  let elapsed = 0;
  let previous: number | null = null;

  const tick = (now: number) => {
    if (previous !== null) elapsed += Math.min(now - previous, MAX_FRAME_STEP);
    previous = now;
    const progress = Math.min(1, elapsed / COUNT_DURATION);
    const eased = 1 - (1 - progress) ** 2;
    element.textContent = String(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(tick);
  };

  window.setTimeout(() => requestAnimationFrame(tick), COUNT_DELAY);
}

// Reveals [data-reveal] elements and runs [data-countup] numbers as they scroll into view.
// Only elements that start below the fold are ever hidden, so nothing flashes on load
// and the page is complete without JavaScript. Does nothing when the visitor has asked
// for reduced motion.
export function MotionObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const reveals = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.remove("reveal-pending");
          reveals.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    // A number starts counting only once it is fully on screen and clear of the bottom
    // edge. Starting as it first peeks in would spend most of the count out of sight.
    const counters = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          counters.unobserve(element);
          element.dataset.counted = "true";
          countUp(element);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 1 },
    );

    for (const element of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.classList.add("reveal-pending");
        reveals.observe(element);
      }
    }

    for (const element of document.querySelectorAll<HTMLElement>("[data-countup]")) {
      if (element.dataset.counted) continue;
      // Start from zero and take over from the CSS fallback that would show the number.
      element.textContent = "0";
      element.classList.add("countup-live");
      counters.observe(element);
    }

    return () => {
      reveals.disconnect();
      counters.disconnect();
    };
  }, [pathname]);

  return null;
}
