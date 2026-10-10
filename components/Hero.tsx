import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { siteConfig } from "@/config/site";
import { heroSlides } from "@/data/company";
import { HeroSlideshow } from "./HeroSlideshow";
import { ButtonLink } from "./ui/Button";
import { Photo } from "./ui/Photo";
import { Eyebrow } from "./ui/SectionHeading";

const rise = (delay: number) => ({ "--rise-delay": `${delay}ms` }) as CSSProperties;

export function Hero() {
  // Site photos in their own colours: the slideshow is where they are meant to be seen.
  const slides = heroSlides.map((slide, index) => ({
    caption: slide.caption,
    photo: (
      <Photo
        src={slide.image}
        alt={slide.alt}
        sizes="(min-width: 1024px) 58vw, 100vw"
        priority={index === 0}
        position={slide.position}
        treatment="natural"
        className="h-full bg-transparent!"
      />
    ),
  }));

  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      <div aria-hidden="true" className="blueprint absolute inset-0 -z-10" />

      <HeroSlideshow slides={slides}>
        <div className="hero-rise">
          <Eyebrow tone="dark">Power &middot; Steel &middot; Cement &middot; Telecom</Eyebrow>
        </div>

        <h1
          className="hero-rise mt-6 text-[2.5rem] font-semibold leading-[1.03] tracking-tight sm:text-6xl xl:text-[4.4rem]"
          style={rise(80)}
        >
          Powering Industrial Infrastructure <span className="text-gold-500">With Precision.</span>
        </h1>

        <p className="hero-rise mt-6 max-w-xl text-lg leading-relaxed text-steel-200 sm:text-xl" style={rise(160)}>
          {siteConfig.tagline}
        </p>

        <div className="hero-rise mt-9 flex flex-col sm:flex-row" style={rise(240)}>
          <ButtonLink href="/services" size="lg">
            Explore Our Services
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </HeroSlideshow>
    </section>
  );
}
