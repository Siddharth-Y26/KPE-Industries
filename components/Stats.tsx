import { heroStats } from "@/data/company";
import { Container } from "./ui/Container";
import { CountUp } from "./ui/CountUp";

// Sits half over the hero. Only the three figures the company profile states.
export function Stats() {
  return (
    <section aria-label="Key figures" className="relative z-10 -mt-24 lg:-mt-28">
      <Container>
        <dl
          data-reveal
          className="grid divide-y divide-steel-100 border border-steel-100 bg-white shadow-xl shadow-navy-950/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
        >
          {heroStats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse px-7 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-11">
              <dt className="mt-3 text-[0.8rem] font-medium uppercase leading-snug tracking-[0.14em] text-steel-500">
                {stat.label}
                {stat.note ? <span className="normal-case tracking-normal text-steel-500"> {stat.note}</span> : null}
              </dt>
              <dd className="flex items-baseline gap-2 font-display font-semibold leading-none text-navy-900">
                <span className="text-6xl tracking-tight lg:text-7xl">
                  <CountUp value={stat.value} />
                </span>
                {stat.unit ? <span className="text-2xl text-gold-600 lg:text-3xl">{stat.unit}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
