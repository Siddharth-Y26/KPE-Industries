import { ArrowRight } from "lucide-react";
import { CtaBand, PageHeader } from "@/components/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { enquiryHref } from "@/config/site";
import { services } from "@/data/services";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Electrical engineering services from Krishna Power & Engineers: power plants, steel industries, power distribution and telecom infrastructure.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader label="Services" title="Our core services">
        <p>Power plants, steel industries, power distribution and telecom.</p>
      </PageHeader>

      <nav aria-label="Services on this page" className="border-b border-steel-100 bg-white">
        <Container>
          <ul className="-mx-5 flex gap-1 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            {services.map((service) => (
              <li key={service.slug} className="shrink-0">
                <a
                  href={`#${service.slug}`}
                  className="flex min-h-14 items-center px-4 font-display text-sm font-semibold text-steel-500 hover:text-navy-900 first:pl-0"
                >
                  {service.name}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      {services.map((service, index) => (
        <section
          key={service.slug}
          id={service.slug}
          className={`py-16 lg:py-28 ${index % 2 === 1 ? "bg-mist" : "bg-white"}`}
        >
          <Container className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <div data-reveal className={`lg:col-span-5 ${index % 2 === 1 ? "lg:order-2 lg:col-start-8" : ""}`}>
              <div className="ticks mx-2.5 lg:mx-0">
                <Photo
                  src={service.image}
                  alt={service.imageAlt}
                  sizes="(min-width: 1024px) 38vw, 92vw"
                  className="aspect-[4/3]"
                />
                <span className="tick-end" aria-hidden="true" />
              </div>
            </div>

            <div data-reveal className={`lg:col-span-6 ${index % 2 === 1 ? "lg:order-1" : "lg:col-start-7"}`}>
              <h2 className="text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl lg:text-5xl">
                {service.name}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-steel-500">{service.summary}</p>

              <h3 className="mt-10 font-display text-xs font-semibold uppercase tracking-[0.2em] text-steel-500">
                Scope of work
              </h3>
              <ul className="mt-4 grid border-t border-steel-200 sm:grid-cols-2 sm:gap-x-8">
                {service.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="flex gap-3 border-b border-steel-200 py-3.5 font-display font-medium leading-snug text-navy-900"
                  >
                    <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 bg-gold-500" />
                    {capability}
                  </li>
                ))}
              </ul>

              <ButtonLink href={enquiryHref} variant="navy" className="mt-9">
                Discuss Your Project
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </Container>
        </section>
      ))}

      <CtaBand />
    </>
  );
}
