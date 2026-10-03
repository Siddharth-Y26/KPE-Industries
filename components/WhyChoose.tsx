import { BadgeCheck, IndianRupee, Timer, Users } from "lucide-react";
import { reasons } from "@/data/company";
import { Container } from "./ui/Container";
import { SectionHeading } from "./ui/SectionHeading";

const icons = {
  team: Users,
  time: Timer,
  quality: BadgeCheck,
  price: IndianRupee,
};

export function WhyChoose() {
  return (
    <section className="py-20 lg:py-32">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <SectionHeading eyebrow="Why KPE" title="Why clients choose KPE" className="lg:col-span-4" />

        <ul data-reveal className="grid gap-px border border-steel-100 bg-steel-100 sm:grid-cols-2 lg:col-span-8">
          {reasons.map((reason) => {
            const Icon = icons[reason.icon];
            return (
              <li key={reason.title} className="flex gap-5 bg-white p-7 lg:p-9">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-mist">
                  <Icon className="h-6 w-6 text-navy-700" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-navy-900">{reason.title}</h3>
                  <p className="mt-2 leading-relaxed text-steel-500">{reason.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
