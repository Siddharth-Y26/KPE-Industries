import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { enquiryHref, siteConfig } from "@/config/site";
import { heroSlides } from "@/data/company";
import { whatsappUrl } from "@/lib/whatsapp";
import { HeroSlideshow } from "./HeroSlideshow";
import { ButtonLink } from "./ui/Button";
import { Photo } from "./ui/Photo";
import { Eyebrow } from "./ui/SectionHeading";
import { WhatsAppIcon } from "./ui/WhatsAppIcon";

const rise = (delay: number) => ({ "--rise-delay": `${delay}ms` }) as CSSProperties;

export function Hero() {
  const whatsapp = whatsappUrl();

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

        <div className="hero-rise mt-9 flex flex-col gap-3 sm:flex-row" style={rise(240)}>
          <ButtonLink href="/services" size="lg">
            Explore Our Services
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href={enquiryHref} variant="outline-light" size="lg">
            Send an Enquiry
          </ButtonLink>
        </div>

        {whatsapp ? (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-rise mt-5 inline-flex min-h-11 items-center gap-2.5 text-[0.95rem] font-medium text-steel-200 hover:text-white"
            style={rise(320)}
          >
            <WhatsAppIcon className="h-[1.15rem] w-[1.15rem] text-[#4ade80]" />
            Chat on WhatsApp
          </a>
        ) : null}
      </HeroSlideshow>
    </section>
  );
}
