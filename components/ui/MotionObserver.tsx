"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Reveals [data-reveal] elements as they scroll into view.
// Only elements that start below the fold are ever hidden, so nothing flashes on
// load and the page is complete without JavaScript. Does nothing when the visitor
// has asked for reduced motion.
export function MotionObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          element.classList.remove("reveal-pending");
          observer.unobserve(element);
          // Restart any count-up inside so it runs as the numbers come into view.
          for (const counter of element.querySelectorAll<HTMLElement>(".countup")) {
            counter.style.animation = "none";
            void counter.offsetWidth;
            counter.style.animation = "";
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    for (const element of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.classList.add("reveal-pending");
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
