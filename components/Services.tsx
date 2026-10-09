import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { services } from "@/data/services";
import { Container } from "./ui/Container";
import { revealDelay } from "./ui/CountUp";
import { Photo } from "./ui/Photo";
import { SectionHeading } from "./ui/SectionHeading";

// Home page: four cards that link to the Services page.
export function Services() {
  return (
    <section className="bg-mist py-20 lg:py-32">
      <Container>
        <SectionHeading eyebrow="What we do" title="Our Core Services">
          <p>Four areas of work, delivered by experienced and skilled engineers.</p>
        </SectionHeading>

        <ul className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {services.map((service, index) => (
            <li key={service.slug} data-reveal style={revealDelay(index % 2)}>
              <article className="group relative flex h-full flex-col border border-steel-100 bg-white transition-shadow duration-300 hover:shadow-xl hover:shadow-navy-950/10">
                <Photo
                  src={service.image}
                  alt={service.imageAlt}
                  sizes="(min-width: 1024px) 46vw, 92vw"
                  className="aspect-[5/2]"
                />
                <div className="flex flex-1 flex-col p-7 lg:p-9">
                  <h3 className="text-2xl font-semibold tracking-tight text-navy-900 lg:text-[1.75rem]">
                    <Link href={`/services#${service.slug}`} className="after:absolute after:inset-0">
                      {service.name}
                    </Link>
                  </h3>
                  <p className="mt-3 leading-relaxed text-steel-500">{service.summary}</p>

                  <ul className="mt-6 grid gap-x-6 gap-y-2 border-t border-steel-100 pt-6 sm:grid-cols-2">
                    {service.capabilities.map((capability) => (
                      <li key={capability} className="flex gap-2.5 text-[0.95rem] leading-snug text-ink">
                        <span aria-hidden="true" className="mt-[0.5em] h-1.5 w-1.5 shrink-0 bg-gold-500" />
                        {capability}
                      </li>
                    ))}
                  </ul>

                  <p
                    aria-hidden="true"
                    className="mt-auto flex items-center gap-2 pt-8 font-display text-sm font-semibold text-navy-700 transition-colors group-hover:text-navy-900"
                  >
                    Explore Service
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
