import { FileCheck } from "lucide-react";
import { credentials } from "@/data/company";
import { Container } from "./ui/Container";
import { SectionHeading } from "./ui/SectionHeading";

// Shows only what data/company.ts marks as publishable. "status" entries show that
// the registration exists without printing the number.
export function Credentials() {
  const visible = credentials.filter((credential) => credential.display !== "hidden");

  return (
    <section id="credentials" className="py-20 lg:py-32">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <SectionHeading eyebrow="Compliance" title="Registrations & credentials" className="lg:col-span-4">
          <p>Statutory registrations held by the firm. Further details are available on request.</p>
        </SectionHeading>

        <dl data-reveal className="grid gap-px border border-steel-100 bg-steel-100 sm:grid-cols-2 lg:col-span-8">
          {visible.map((credential) => (
            <div key={credential.label} className="bg-white p-7 lg:p-8">
              <dt className="flex items-center gap-3 font-display text-xs font-semibold uppercase tracking-[0.18em] text-steel-500">
                <FileCheck className="h-6 w-6 shrink-0 text-navy-700" strokeWidth={1.5} aria-hidden="true" />
                {credential.label}
              </dt>
              <dd className="mt-3 break-words pl-9 font-display text-xl font-semibold text-navy-900">
                {credential.display === "full" ? credential.value : credential.statusText}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
