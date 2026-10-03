import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { enquiryHref, siteConfig } from "@/config/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { ButtonLink } from "./ui/Button";
import { Container } from "./ui/Container";
import { Photo } from "./ui/Photo";
import { Eyebrow } from "./ui/SectionHeading";
import { WhatsAppIcon } from "./ui/WhatsAppIcon";

const rise = (delay: number) => ({ "--rise-delay": `${delay}ms` }) as CSSProperties;

export function Hero() {
  const whatsapp = whatsappUrl();

  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      <div aria-hidden="true" className="blueprint absolute inset-0 -z-10" />

      <Container className="grid items-center gap-12 pb-36 pt-12 sm:pt-16 lg:grid-cols-12 lg:gap-12 lg:pb-48 lg:pt-20">
        <div className="lg:col-span-7">
          <div className="hero-rise">
            <Eyebrow tone="dark">Power &middot; Steel &middot; Cement &middot; Telecom</Eyebrow>
          </div>

          <h1
            className="hero-rise mt-6 text-[2.5rem] font-semibold leading-[1.03] tracking-tight sm:text-6xl xl:text-[4.4rem]"
            style={rise(80)}
          >
            Powering industrial infrastructure <span className="text-gold-500">with precision.</span>
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
        </div>

        <figure className="hero-rise lg:col-span-5" style={rise(200)}>
          <div className="ticks mx-2.5 lg:mx-0">
            <Photo
              src="hero/transformer-erection"
              alt="Engineer on a ladder working on a power transformer during erection"
              sizes="(min-width: 1024px) 36vw, 92vw"
              priority
              className="aspect-[4/3] lg:aspect-[5/6]"
            />
            <span className="tick-end" aria-hidden="true" />
          </div>
          <figcaption className="mt-5 flex items-center gap-3 font-display text-xs font-medium uppercase tracking-[0.2em] text-steel-300">
            <span aria-hidden="true" className="h-px w-8 bg-steel-400" />
            Transformer erection
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
