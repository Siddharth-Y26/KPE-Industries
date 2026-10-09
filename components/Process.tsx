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
                className="group relative pb-11 pl-8 last:pb-0 lg:pb-0 lg:pl-0 lg:pr-8"
              >
                {last ? null : (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-[0.4375rem] left-[calc(0.4375rem-0.5px)] top-[1.3125rem] w-px bg-navy-700 lg:bottom-auto lg:left-3.5 lg:right-0 lg:top-[calc(0.4375rem-0.5px)] lg:h-px lg:w-auto"
                  />
                )}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[0.4375rem] block h-3.5 w-3.5 border border-gold-500 transition-colors duration-300 group-hover:bg-gold-500 lg:static"
                />
                <h3 className="text-xl font-semibold lg:mt-7 lg:text-2xl">{step.title}</h3>
                <p className="mt-2.5 leading-relaxed text-steel-200">{step.text}</p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
