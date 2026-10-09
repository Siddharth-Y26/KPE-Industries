import { ArrowUpRight, Building2, Mail, MapPin, Phone } from "lucide-react";
import { cityLine, enquiryHref, siteConfig } from "@/config/site";
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

// Both addresses, both phone numbers and the email. No embedded map: a link costs
// nothing and loads nothing.
export function Contact() {
  const whatsapp = whatsappUrl();
  const { contact } = siteConfig;
  const [emailName, emailDomain] = contact.email.split("@");

  return (
    <section id="contact" className="py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow="Contact" title="Contact our team" />

        <div data-reveal className="mt-12 grid gap-px border border-steel-100 bg-steel-100 md:grid-cols-2">
          <div className="bg-white p-7 lg:p-9">
            <MapPin className="h-7 w-7 text-navy-700" strokeWidth={1.5} aria-hidden="true" />
            <h3 className="mt-6 font-display text-xs font-semibold uppercase tracking-[0.2em] text-steel-500">
              Current office
            </h3>
            <address className="mt-3 text-lg not-italic leading-relaxed text-navy-900">
              {siteConfig.name}
              <br />
              {contact.office.line1}
              <br />
              {contact.office.line2}
              <br />
              {cityLine(contact.office)}
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
            <Building2 className="h-7 w-7 text-navy-700" strokeWidth={1.5} aria-hidden="true" />
            <h3 className="mt-6 font-display text-xs font-semibold uppercase tracking-[0.2em] text-steel-500">
              Registered office
            </h3>
            <address className="mt-3 text-lg not-italic leading-relaxed text-navy-900">
              {siteConfig.name}
              <br />
              {contact.registeredOffice.line1}
              <br />
              {contact.registeredOffice.line2}
              <br />
              {cityLine(contact.registeredOffice)}
            </address>
          </div>

          <div className="bg-white p-7 lg:p-9">
            <Phone className="h-7 w-7 text-navy-700" strokeWidth={1.5} aria-hidden="true" />
            <h3 className="mt-6 font-display text-xs font-semibold uppercase tracking-[0.2em] text-steel-500">Phone</h3>
            <dl className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-steel-500">Enquiries</dt>
                <dd>
                  <a
                    href={contact.phoneHref}
                    className="font-display text-2xl font-semibold text-navy-900 hover:text-navy-700"
                  >
                    {contact.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-steel-500">Emergency</dt>
                <dd>
                  <a
                    href={contact.emergencyPhoneHref}
                    className="font-display text-2xl font-semibold text-navy-900 hover:text-navy-700"
                  >
                    {contact.emergencyPhoneDisplay}
                  </a>
                </dd>
              </div>
            </dl>
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
              className="mt-3 block break-words font-display text-lg font-semibold text-navy-900 hover:text-navy-700 sm:text-xl lg:text-2xl"
            >
              {/* On a narrow phone the address may wrap, and then it wraps before the @. */}
              {emailName}
              <wbr />@{emailDomain}
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
