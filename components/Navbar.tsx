"use client";

import { Mail, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { enquiryHref, navigation, siteConfig } from "@/config/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { Logo } from "./Logo";
import { ButtonLink, buttonClass } from "./ui/Button";
import { Container } from "./ui/Container";
import { WhatsAppIcon } from "./ui/WhatsAppIcon";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const whatsapp = whatsappUrl();
  const { contact } = siteConfig;

  // While the menu is open: stop the page behind it from scrolling, and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <div className="hidden bg-navy-950 text-steel-200 lg:block">
        <Container className="flex h-10 items-center text-[0.8rem]">
          <p className="tracking-wide">Electrical, power and telecom infrastructure</p>
        </Container>
      </div>

      <header className="sticky top-0 z-40 border-b border-steel-100 bg-white">
        <Container className="flex h-16 items-center justify-between gap-6 lg:h-[4.75rem]">
          <Link href="/" onClick={close} aria-label={`${siteConfig.name} home`} className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navigation.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative block px-3.5 py-2 font-display text-[0.92rem] font-medium transition-colors ${
                        active ? "text-navy-900" : "text-steel-500 hover:text-navy-900"
                      }`}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-3.5 -bottom-0.5 h-0.5 bg-gold-500 transition-opacity ${
                          active ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {whatsapp ? (
              <ButtonLink href={whatsapp} variant="outline">
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp Us
              </ButtonLink>
            ) : null}
            <ButtonLink href={enquiryHref}>Enquire Now</ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="-mr-2 flex h-11 w-11 items-center justify-center text-navy-900 lg:hidden"
          >
            {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </Container>

        <div
          id="mobile-menu"
          hidden={!open}
          className="absolute inset-x-0 top-full h-[calc(100dvh-4rem)] overflow-y-auto bg-white lg:hidden"
        >
          <Container className="flex min-h-full flex-col pb-8 pt-2">
            <nav aria-label="Mobile">
              <ul>
                {navigation.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href} className="border-b border-steel-100">
                      <Link
                        href={item.href}
                        onClick={close}
                        aria-current={active ? "page" : undefined}
                        className={`flex min-h-14 items-center justify-between font-display text-xl font-semibold ${
                          active ? "text-navy-900" : "text-steel-500"
                        }`}
                      >
                        {item.label}
                        {active ? <span aria-hidden="true" className="h-2 w-2 bg-gold-500" /> : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-8 grid gap-3">
              <Link href={enquiryHref} onClick={close} className={buttonClass("primary", "lg", "w-full")}>
                Enquire Now
              </Link>
              {whatsapp ? (
                <ButtonLink href={whatsapp} variant="whatsapp" size="lg" className="w-full">
                  <WhatsAppIcon />
                  WhatsApp
                </ButtonLink>
              ) : null}
            </div>

            <div className="mt-8 grid gap-3 text-[0.95rem] text-steel-500">
              <a href={contact.phoneHref} className="flex min-h-11 items-center gap-3">
                <Phone className="h-4 w-4 text-navy-700" aria-hidden="true" />
                {contact.phoneDisplay}
              </a>
              <a href={`mailto:${contact.email}`} className="flex min-h-11 items-center gap-3 break-all">
                <Mail className="h-4 w-4 shrink-0 text-navy-700" aria-hidden="true" />
                {contact.email}
              </a>
            </div>
          </Container>
        </div>
      </header>
    </>
  );
}
