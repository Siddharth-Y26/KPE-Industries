import { portfolio } from "@/data/projects";
import { Container } from "./ui/Container";
import { CountUp, revealDelay } from "./ui/CountUp";
import { Eyebrow } from "./ui/SectionHeading";

// The portfolio in numbers. These are counts of what the company profile records,
// not company-wide totals, and the wording says so.
export function Clients() {
  return (
    <section className="relative isolate bg-navy-900 py-20 text-white lg:py-28">
      <div aria-hidden="true" className="blueprint absolute inset-0 -z-10" />
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div data-reveal className="lg:col-span-5">
          <Eyebrow tone="dark">Selected clients &amp; projects</Eyebrow>
          <h2 className="mt-6 flex items-baseline gap-4 font-display font-semibold leading-none tracking-tight">
            <span className="text-8xl text-gold-500 lg:text-9xl">
              <CountUp value={portfolio.total} />
            </span>
            <span className="max-w-[9rem] text-xl leading-tight lg:text-2xl">Clients and Projects on Record</span>
          </h2>
          <p className="mt-8 max-w-md leading-relaxed text-steel-200">{portfolio.note}</p>
        </div>

        <dl className="grid self-end border-t border-navy-700 sm:grid-cols-3 sm:divide-x sm:divide-navy-700 sm:border-t-0 lg:col-span-7">
          {portfolio.breakdown.map((item, index) => (
            <div
              key={item.label}
              data-reveal
              style={revealDelay(index)}
              className="flex flex-col-reverse justify-end border-b border-navy-700 py-7 sm:border-b-0 sm:px-8 sm:py-2 sm:first:pl-0"
            >
              <dt className="mt-3 text-[0.95rem] leading-snug text-steel-200">{item.label}</dt>
              <dd className="font-display text-6xl font-semibold leading-none tracking-tight lg:text-7xl">
                <CountUp value={item.value} />
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
