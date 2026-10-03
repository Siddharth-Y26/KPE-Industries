import { siteConfig } from "@/config/site";

// Returns null while the WhatsApp number is unconfirmed, so callers render nothing.
// The message is always the generic one: form contents never go into a URL.
export function whatsappUrl(): string | null {
  const { number, message } = siteConfig.whatsapp;
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
