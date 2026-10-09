import { Handshake, HeartHandshake, Scale, ShieldCheck } from "lucide-react";
import { mission, values, vision } from "@/data/company";
import { Container } from "./ui/Container";
import { revealDelay } from "./ui/CountUp";
import { Eyebrow } from "./ui/SectionHeading";

const icons = {
  humanity: HeartHandshake,
  honesty: Scale,
  safety: ShieldCheck,
  commitment: Handshake,
};

export function MissionVision() {
  return (
    <section className="bg-navy-900 py-20 text-white lg:py-32">
      <Container>
        <div data-reveal>
          <Eyebrow tone="dark">Mission, vision &amp; values</Eyebrow>
          <h2 className="sr-only">Mission, Vision and Values</h2>
        </div>

        <div className="mt-10 grid border-y border-navy-700 lg:grid-cols-2 lg:divide-x lg:divide-navy-700">
          {[
            { label: "Our mission", text: mission },
            { label: "Our vision", text: vision },
          ].map((item, index) => (
            <div key={item.label} data-reveal style={revealDelay(index)} className="border-navy-700 py-10 max-lg:last:border-t lg:px-12 lg:py-14 lg:first:pl-0">
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-gold-500">{item.label}</h3>
              <p className="mt-6 font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl sm:leading-snug lg:text-[2.1rem] lg:leading-[1.25]">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <ul className="mt-12 grid gap-y-2 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:divide-x lg:divide-navy-700">
          {values.map((value, index) => {
            const Icon = icons[value.icon];
            return (
              <li key={value.title} data-reveal style={revealDelay(index)} className="py-7 sm:pr-8 lg:px-8 lg:py-2 lg:first:pl-0">
                <Icon className="h-8 w-8 text-gold-500" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-7 text-xl font-semibold">{value.title}</h3>
                <p className="mt-2.5 leading-relaxed text-steel-200">{value.text}</p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
