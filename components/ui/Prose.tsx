import type { ReactNode } from "react";
import { Container } from "./Container";

// Long-form text for the privacy policy and disclaimer.
export function Prose({ children }: { children: ReactNode }) {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="max-w-3xl text-lg leading-relaxed text-steel-600 [&_a]:font-medium [&_a]:text-navy-700 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-navy-900 [&_h2:first-child]:mt-0 [&_li]:mt-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </Container>
    </section>
  );
}
