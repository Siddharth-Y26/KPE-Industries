import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { enquiryHref, navigation, siteConfig } from "@/config/site";
import { Logo } from "./Logo";
import { ButtonLink } from "./ui/Button";
import { Container } from "./ui/Container";

const socialLabels: Record<keyof typeof siteConfig.social, string> = {
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
};

export function Footer() {
  const { contact, social } = siteConfig;
  const socialLinks = (Object.keys(social) as (keyof typeof social)[]).filter((key) => social[key]);

  return (
    // The bottom padding on small screens keeps the fixed contact bar off the content.
    <footer className="bg-navy-950 pb-14 text-steel-200 lg:pb-0">
      <Container className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="lg:col-span-4">
          <Link href="/" aria-label={`${siteConfig.name} home`} className="inline-block">
            <Logo tone="dark" />
          </Link>
          <p className="mt-6 max-w-sm leading-relaxed text-steel-300">{siteConfig.tagline}</p>
          <ButtonLink href={enquiryHref} className="mt-8">
            Send an Enquiry
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>

        <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-6">
          <h2 className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-white">Navigation</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 lg:grid-cols-1">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex min-h-10 items-center text-steel-300 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <h2 className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-white">Contact</h2>
          <ul className="mt-5 grid gap-4 text-steel-300">
            <li>
              <a href={contact.phoneHref} className="flex items-start gap-3 hover:text-white">
                <Phone className="mt-1 h-4 w-4 shrink-0 text-gold-500" aria-hidden="true" />
                {contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="flex items-start gap-3 break-all hover:text-white">
                <Mail className="mt-1 h-4 w-4 shrink-0 text-gold-500" aria-hidden="true" />
                {contact.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold-500" aria-hidden="true" />
              <address className="not-italic leading-relaxed">
                {contact.address.line1}, {contact.address.line2}
                <br />
                {contact.address.city}, {contact.address.state} {contact.address.postalCode}
              </address>
            </li>
          </ul>
          {socialLinks.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {socialLinks.map((key) => (
                <li key={key}>
                  <a href={social[key]} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    {socialLabels[key]}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>

      <div className="border-t border-navy-800">
        <Container className="flex flex-col gap-3 py-6 text-sm text-steel-300 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {siteConfig.name}. All rights reserved.</p>
          <ul className="flex gap-6">
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/disclaimer" className="hover:text-white">
                Website Disclaimer
              </Link>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}
