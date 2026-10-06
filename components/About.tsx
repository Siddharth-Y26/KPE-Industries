import { ArrowRight } from "lucide-react";
import { about } from "@/data/company";
import { ButtonLink } from "./ui/Button";
import { Container } from "./ui/Container";
import { revealDelay } from "./ui/CountUp";
import { Photo } from "./ui/Photo";
import { Eyebrow } from "./ui/SectionHeading";

// `full` is the About page version: no "more" link, and the "how we work" paragraph is shown.
export function About({ full = false }: { full?: boolean }) {
  return (
    <section className="py-20 lg:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div data-reveal className="lg:col-span-6">
            <Eyebrow>Who we are</Eyebrow>
            <h2 className="mt-5 text-3xl font-semibold leading-[1.06] tracking-tight text-navy-900 sm:text-5xl lg:text-[3.4rem]">
              {about.heading}
            </h2>
            <div className="ticks mx-2.5 mt-12 lg:mx-0 lg:mr-10">
              <Photo
                src="about/switchgear-line-up"
                alt="An engineer at a switchgear line-up in a substation control room"
                sizes="(min-width: 1024px) 44vw, 92vw"
                className="aspect-[4/3]"
                position="50% 30%"
              />
              <span className="tick-end" aria-hidden="true" />
            </div>
          </div>

          <div data-reveal className="lg:col-span-5 lg:col-start-8 lg:pt-14" style={revealDelay(1)}>
            <p className="text-xl leading-relaxed text-navy-900 sm:text-2xl sm:leading-relaxed">{about.summary}</p>
            <p className="mt-6 text-lg leading-relaxed text-steel-500">{about.whatWeDo}</p>
            {full ? <p className="mt-4 text-lg leading-relaxed text-steel-500">{about.howWeWork}</p> : null}

            <ul className="mt-9 grid gap-x-6 border-t border-steel-100 sm:grid-cols-2">
              {about.scope.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 border-b border-steel-100 py-3.5 font-display text-[0.95rem] font-medium text-navy-900"
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-gold-500" />
                  {item}
                </li>
              ))}
            </ul>

            {full ? null : (
              <ButtonLink href="/about" variant="outline" className="mt-9">
                More about KPE
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            )}
          </div>
        </div>

        <ul data-reveal className="mt-20 grid gap-px bg-steel-100 sm:grid-cols-3 lg:mt-28">
          {about.principles.map((principle, index) => (
            <li key={principle.title} className="bg-white py-8 sm:px-8 sm:first:pl-0">
              <p className="font-display text-sm font-semibold text-gold-700">0{index + 1}</p>
              <h3 className="mt-4 text-2xl font-semibold text-navy-900">{principle.title}</h3>
              <p className="mt-3 leading-relaxed text-steel-500">{principle.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
