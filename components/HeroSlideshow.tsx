"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Container } from "./ui/Container";

export type HeroSlide = {
  caption: string;
  // A <Photo> that fills its frame.
  photo: ReactNode;
};

// A sideways finger movement of at least this many pixels changes the photo.
const SWIPE_DISTANCE = 48;

const controlButton =
  "flex h-11 w-11 items-center lg:h-10 lg:w-10 justify-center rounded-sm border border-white/30 bg-navy-950/40 text-white transition-colors hover:border-white hover:bg-white hover:text-navy-950";

const twoDigits = (value: number) => String(value).padStart(2, "0");

function subscribeToLoad(onChange: () => void) {
  window.addEventListener("load", onChange);
  return () => window.removeEventListener("load", onChange);
}
const pageHasLoaded = () => document.readyState === "complete";
const notLoaded = () => false;

// The home page slideshow: the photos behind the hero, and the caption and controls
// beside the headline (`children`).
//
// The gold progress bar is the timer. It is a CSS animation, and the next photo is shown
// when it ends, so anything that pauses the bar pauses the slideshow: the pause button,
// the hero being scrolled out of view, and (in globals.css) pointing at or tabbing into
// the controls. Visitors who ask for reduced motion get no animation, so the photos
// change only when they use the controls.
export function HeroSlideshow({ slides, children }: { slides: HeroSlide[]; children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  // Only the first photo is in the exported page, so it is the one that loads first. The
  // rest are added, and the timer starts, once the page has finished loading.
  const loaded = useSyncExternalStore(subscribeToLoad, pageHasLoaded, notLoaded);
  const stage = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const stageId = useId();

  const count = slides.length;
  const go = (to: number) => setIndex((to + count) % count);

  useEffect(() => {
    const element = stage.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") swipeStart.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: PointerEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    if (Math.abs(x) >= SWIPE_DISTANCE && Math.abs(x) > Math.abs(y) * 1.5) go(index + (x < 0 ? 1 : -1));
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") go(index - 1);
    if (event.key === "ArrowRight") go(index + 1);
  };

  return (
    <>
      <div
        ref={stage}
        id={stageId}
        role="group"
        aria-roledescription="carousel"
        aria-label="Photos of our work"
        aria-live={paused ? "polite" : "off"}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          swipeStart.current = null;
        }}
        className="hero-stage relative h-[24rem] touch-pan-y sm:h-[30rem] lg:absolute lg:inset-y-0 lg:right-0 lg:-z-10 lg:h-auto lg:w-[58%] lg:max-w-[72rem]"
      >
        {slides.map((slide, i) =>
          i === 0 || loaded || index !== 0 ? (
            <div
              key={slide.caption}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
              className={`hero-slide ${i === index ? "is-active" : ""}`}
            >
              {slide.photo}
            </div>
          ) : null,
        )}
        {/* Darkens the foot of the photo on wide screens, where the key figures overlap it. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-linear-to-t from-navy-950/80 via-navy-950/10 via-40% to-transparent lg:block"
        />
      </div>

      <Container className="relative -mt-20 grid gap-9 pb-36 lg:mt-0 lg:grid-cols-12 lg:gap-12 lg:pb-48 lg:pt-20">
        <div className="lg:col-span-7">{children}</div>

        <div
          data-paused={paused || !inView ? "" : undefined}
          onKeyDown={onKeyDown}
          className="hero-controls order-first lg:order-none lg:col-span-4 lg:col-start-9 lg:self-end lg:border lg:border-white/15 lg:bg-navy-950/75 lg:px-6 lg:pb-3 lg:pt-5 lg:backdrop-blur-md"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="font-display text-sm font-semibold tabular-nums text-gold-500">
              {twoDigits(index + 1)} <span className="text-steel-200">/ {twoDigits(count)}</span>
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-controls={stageId}
                aria-label="Previous photo"
                className={controlButton}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-controls={stageId}
                aria-label="Next photo"
                className={controlButton}
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setPaused((value) => !value)}
                aria-label={paused ? "Play slideshow" : "Pause slideshow"}
                className={`hero-toggle ${controlButton}`}
              >
                {paused ? (
                  <Play className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Pause className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-3 grid">
            {slides.map((slide, i) => (
              <p
                key={slide.caption}
                aria-hidden={i !== index}
                className={`hero-caption col-start-1 row-start-1 font-display text-xl font-semibold leading-snug sm:text-2xl ${
                  i === index ? "is-active" : ""
                }`}
              >
                {slide.caption}
              </p>
            ))}
          </div>

          <ol className="mt-2 flex gap-1.5">
            {slides.map((slide, i) => (
              <li key={slide.caption} className="flex-1">
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-controls={stageId}
                  aria-current={i === index ? "true" : undefined}
                  aria-label={`Photo ${i + 1} of ${count}: ${slide.caption}`}
                  className="group flex h-8 w-full items-center"
                >
                  <span
                    className={`relative block h-0.5 w-full overflow-hidden transition-colors group-hover:bg-white/70 ${
                      i === index ? "bg-white/70" : "bg-white/30"
                    }`}
                  >
                    {i === index ? (
                      <span
                        key={index}
                        onAnimationEnd={() => go(index + 1)}
                        className={`hero-progress absolute inset-0 bg-gold-500 ${loaded ? "is-timed" : ""}`}
                      />
                    ) : null}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </>
  );
}
