import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { enquiryHref, siteConfig } from "@/config/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { EnquiryForm } from "./EnquiryForm";
import { ButtonLink } from "./ui/Button";
import { Container } from "./ui/Container";
import { SectionHeading } from "./ui/SectionHeading";
import { WhatsAppIcon } from "./ui/WhatsAppIcon";

// The enquiry form with the direct routes beside it. This is the section every
// "Enquire Now" button on the site points at.
export function Enquiry() {
  const whatsapp = whatsappUrl();
  const { contact } = siteConfig;

  return (
    <section id="enquiry" className="bg-mist py-20 lg:py-32">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow="Enquire now" title="Have a project in mind? Let's talk.">
            <p>Tell us about your requirement and our team will get in touch with you.</p>
          </SectionHeading>

          <div data-reveal className="mt-10 grid gap-3">
            {whatsapp ? (
              <ButtonLink href={whatsapp} variant="whatsapp" size="lg" className="w-full justify-start">
                <WhatsAppIcon />
                WhatsApp Us
              </ButtonLink>
            ) : null}
            <ButtonLink href={contact.phoneHref} variant="navy" size="lg" className="w-full justify-start">
              <Phone className="h-5 w-5 text-gold-500" aria-hidden="true" />
              Call {contact.phoneDisplay}
            </ButtonLink>
          </div>
        </div>

        <div data-reveal className="lg:col-span-7 lg:col-start-6">
          <EnquiryForm />
        </div>
      </Container>
    </section>
  );
}

// Address, phone and email. No embedded map: a link costs nothing and loads nothing.
export function Contact() {
  const whatsapp = whatsappUrl();
  const { contact } = siteConfig;

  return (
    <section id="contact" className="py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow="Contact" title="Contact our team" />

        <div data-reveal className="mt-12 grid gap-px border border-steel-100 bg-steel-100 md:grid-cols-3">
          <div className="bg-white p-7 lg:p-9">
            <MapPin className="h-7 w-7 text-navy-700" strokeWidth={1.5} aria-hidden="true" />
            <h3 className="mt-6 font-display text-xs font-semibold uppercase tracking-[0.2em] text-steel-500">
              Registered office
            </h3>
            <address className="mt-3 text-lg not-italic leading-relaxed text-navy-900">
              {siteConfig.name}
              <br />
              {contact.address.line1}
              <br />
              {contact.address.line2}
              <br />
              {contact.address.city}, {contact.address.state} {contact.address.postalCode}
            </address>
            <a
              href={contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center gap-1.5 font-display text-sm font-semibold text-navy-700 underline underline-offset-4 hover:text-navy-900"
            >
              View on Google Maps
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="bg-white p-7 lg:p-9">
            <Phone className="h-7 w-7 text-navy-700" strokeWidth={1.5} aria-hidden="true" />
            <h3 className="mt-6 font-display text-xs font-semibold uppercase tracking-[0.2em] text-steel-500">Phone</h3>
            <a
              href={contact.phoneHref}
              className="mt-3 block font-display text-2xl font-semibold text-navy-900 hover:text-navy-700"
            >
              {contact.phoneDisplay}
            </a>
            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold text-navy-700 underline underline-offset-4 hover:text-navy-900"
              >
                <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
                Chat on WhatsApp
              </a>
            ) : null}
          </div>

          <div className="bg-white p-7 lg:p-9">
            <Mail className="h-7 w-7 text-navy-700" strokeWidth={1.5} aria-hidden="true" />
            <h3 className="mt-6 font-display text-xs font-semibold uppercase tracking-[0.2em] text-steel-500">Email</h3>
            <a
              href={`mailto:${contact.email}`}
              className="mt-3 block break-all font-display text-xl font-semibold text-navy-900 hover:text-navy-700 lg:text-2xl"
            >
              {contact.email}
            </a>
            <ButtonLink href={enquiryHref} className="mt-6">
              Enquire Now
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
