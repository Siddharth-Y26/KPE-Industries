import { processSteps } from "@/data/company";
import { Container } from "./ui/Container";
import { revealDelay } from "./ui/CountUp";
import { SectionHeading } from "./ui/SectionHeading";

// A timeline that runs left to right on desktop and top to bottom on mobile.
// Each stage reveals in turn as the section scrolls into view.
export function Process() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 py-20 text-white lg:py-32">
      <div aria-hidden="true" className="blueprint absolute inset-0 -z-10" />
      <Container>
        <SectionHeading eyebrow="How we deliver" title="From Concept to Commissioning" tone="dark">
          <p>Our professionals handle project execution from concept to commissioning, and operation and maintenance.</p>
        </SectionHeading>

        <ol className="mt-16 grid lg:mt-20 lg:grid-cols-5">
          {processSteps.map((step, index) => {
            const last = index === processSteps.length - 1;
            return (
              <li
                key={step.title}
                data-reveal
                style={revealDelay(index, 140)}
                className="group relative pb-11 pl-[4.5rem] last:pb-0 lg:pb-0 lg:pl-0 lg:pr-8"
              >
                {last ? null : (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-[1.4rem] top-12 w-px bg-navy-700 lg:bottom-auto lg:left-12 lg:right-0 lg:top-[1.4rem] lg:h-px lg:w-auto"
                  />
                )}
                <span className="absolute left-0 top-0 flex h-[2.85rem] w-[2.85rem] items-center justify-center border border-gold-500 font-display text-sm font-semibold text-gold-500 transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-navy-950 lg:static">
                  0{index + 1}
                </span>
                <h3 className="pt-1.5 text-xl font-semibold lg:mt-8 lg:pt-0 lg:text-2xl">{step.title}</h3>
                <p className="mt-2.5 leading-relaxed text-steel-200">{step.text}</p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
