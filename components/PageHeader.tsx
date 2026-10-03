import { ArrowRight, ChevronRight, Phone } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { enquiryHref, siteConfig } from "@/config/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { ButtonLink } from "./ui/Button";
import { Container } from "./ui/Container";
import { WhatsAppIcon } from "./ui/WhatsAppIcon";

// The navy band at the top of every page except Home. Holds the page's single h1.
export function PageHeader({ title, label, children }: { title: string; label: string; children?: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      <div aria-hidden="true" className="blueprint absolute inset-0 -z-10" />
      <Container className="py-14 sm:py-20 lg:py-24">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.2em] text-steel-300">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5 text-gold-500" />
            </li>
            <li aria-current="page" className="text-white">
              {label}
            </li>
          </ol>
        </nav>
        <h1 className="hero-rise mt-7 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {children ? (
          <div className="hero-rise mt-6 max-w-2xl text-lg leading-relaxed text-steel-200 sm:text-xl">{children}</div>
        ) : null}
      </Container>
    </section>
  );
}

// Closing call to action for pages that do not end with the enquiry form. Gold, so it
// stands apart from the navy sections above it and the navy footer below.
export function CtaBand() {
  const whatsapp = whatsappUrl();

  return (
    <section className="bg-gold-500 text-navy-950">
      <Container className="flex flex-col gap-9 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
        <div data-reveal className="max-w-2xl">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Have a project in mind? Let&rsquo;s talk.
          </h2>
          <p className="mt-4 text-lg text-navy-900">
            Tell us about your requirement and our team will get in touch with you.
          </p>
        </div>
        <div data-reveal className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <ButtonLink href={enquiryHref} variant="navy" size="lg">
            Discuss Your Project
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
          {whatsapp ? (
            <ButtonLink href={whatsapp} variant="outline-dark" size="lg">
              <WhatsAppIcon />
              WhatsApp Us
            </ButtonLink>
          ) : (
            <ButtonLink href={siteConfig.contact.phoneHref} variant="outline-dark" size="lg">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {siteConfig.contact.phoneDisplay}
            </ButtonLink>
          )}
        </div>
      </Container>
    </section>
  );
}
