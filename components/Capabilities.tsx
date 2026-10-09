import { Cable, CircuitBoard, Gauge, Wrench, Zap } from "lucide-react";
import { capabilities, capabilityPhotos, steelPlantAreas } from "@/data/capabilities";
import { Container } from "./ui/Container";
import { revealDelay } from "./ui/CountUp";
import { Photo } from "./ui/Photo";
import { SectionHeading } from "./ui/SectionHeading";

const icons = {
  tg: Gauge,
  transformer: Zap,
  panels: CircuitBoard,
  cabling: Cable,
  om: Wrench,
};

export function Capabilities() {
  return (
    <section className="py-20 lg:py-32">
      <Container>
        <SectionHeading eyebrow="Capabilities" title="Electrical & Instrumentation Expertise">
          <p>Erection, testing and commissioning of electrical and instrumentation systems, with support for operation and maintenance.</p>
        </SectionHeading>

        <ul data-reveal className="mt-14 grid gap-px border border-steel-100 bg-steel-100 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((capability) => {
            const Icon = icons[capability.icon];
            return (
              <li key={capability.title} className="bg-white p-7 lg:p-9">
                <Icon className="h-8 w-8 text-navy-700" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-6 text-xl font-semibold text-navy-900">{capability.title}</h3>
                <p className="mt-2.5 leading-relaxed text-steel-500">{capability.text}</p>
              </li>
            );
          })}

          <li className="bg-navy-900 p-7 text-white lg:p-9">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-gold-500">
              Steel plant areas covered
            </h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {steelPlantAreas.map((area) => (
                <li key={area} className="border border-navy-700 px-3 py-1.5 font-display text-[0.9rem] font-medium">
                  {area}
                </li>
              ))}
            </ul>
          </li>
        </ul>

        <ul className="mt-6 grid gap-6 sm:grid-cols-3 lg:mt-8 lg:gap-8">
          {capabilityPhotos.map((photo, index) => (
            <li key={photo.image} data-reveal style={revealDelay(index)}>
              <figure>
                <Photo
                  src={photo.image}
                  alt={photo.alt}
                  sizes="(min-width: 640px) 31vw, 92vw"
                  className="aspect-[3/2]"
                />
                <figcaption className="mt-3 font-display text-xs font-medium uppercase tracking-[0.18em] text-steel-500">
                  {photo.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
