import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { enquiryHref } from "@/config/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      <div aria-hidden="true" className="blueprint absolute inset-0 -z-10" />
      <Container className="py-24 lg:py-36">
        <p className="font-display text-8xl font-semibold leading-none tracking-tight text-gold-500 lg:text-9xl">404</p>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight sm:text-5xl">This page could not be found.</h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-steel-200">
          The page may have moved, or the address may be mistyped.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">
            Back to Home
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href={enquiryHref} variant="outline-light" size="lg">
            Send an Enquiry
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
