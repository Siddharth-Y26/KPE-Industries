"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const COUNT_DURATION = 1600;

// Counts an element's text from 0 to its data-countup value. Plain script rather than
// a CSS counter animation, which iOS browsers do not animate.
function countUp(element: HTMLElement) {
  const target = Number(element.dataset.countup);
  const start = performance.now();
  const tick = (now: number) => {
    const progress = Math.min(1, (now - start) / COUNT_DURATION);
    const eased = 1 - Math.pow(1 - progress, 4);
    element.textContent = String(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
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

    const options = { rootMargin: "0px 0px -8% 0px", threshold: 0.05 };

    const reveals = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.remove("reveal-pending");
        reveals.unobserve(entry.target);
      }
    }, options);

    const counters = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        counters.unobserve(element);
        element.dataset.counted = "true";
        countUp(element);
      }
    }, options);

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
