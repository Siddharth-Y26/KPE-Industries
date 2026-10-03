import { Phone, Send } from "lucide-react";
import Link from "next/link";
import { enquiryHref, siteConfig } from "@/config/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./ui/WhatsAppIcon";

// Desktop: a floating WhatsApp button.
// Mobile: a fixed bar with Call, WhatsApp and Enquire, so one route to the company is
// always a thumb away. Both hide the WhatsApp action until the number is configured.
export function WhatsAppButton() {
  const whatsapp = whatsappUrl();

  return (
    <>
      {whatsapp ? (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="group fixed bottom-7 right-7 z-30 hidden h-14 items-center gap-3 rounded-full bg-whatsapp pl-4 pr-5 text-white shadow-lg shadow-navy-950/25 transition hover:brightness-110 lg:flex"
        >
          <WhatsAppIcon className="h-6 w-6" />
          <span className="font-display text-sm font-semibold">Chat on WhatsApp</span>
        </a>
      ) : null}

      <nav
        aria-label="Quick contact"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-navy-800 bg-navy-950 pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className={`grid ${whatsapp ? "grid-cols-3" : "grid-cols-2"} divide-x divide-navy-800`}>
          <li>
            <a
              href={siteConfig.contact.phoneHref}
              className="flex h-14 items-center justify-center gap-2 font-display text-sm font-semibold text-white"
            >
              <Phone className="h-4 w-4 text-gold-500" aria-hidden="true" />
              Call
            </a>
          </li>
          {whatsapp ? (
            <li>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 items-center justify-center gap-2 font-display text-sm font-semibold text-white"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#4ade80]" />
                WhatsApp
              </a>
            </li>
          ) : null}
          <li>
            <Link
              href={enquiryHref}
              className="flex h-14 items-center justify-center gap-2 bg-gold-500 font-display text-sm font-semibold text-navy-950"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Enquire
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
