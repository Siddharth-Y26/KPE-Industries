import { Capabilities } from "@/components/Capabilities";
import { CtaBand, PageHeader } from "@/components/PageHeader";
import { Process } from "@/components/Process";
import { WhyChoose } from "@/components/WhyChoose";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Capabilities",
  description:
    "Electrical and instrumentation capabilities of Krishna Power & Engineers: TG sets up to 25 MW, transformers, panels and bus duct, cabling and earthing, and O&M support.",
  path: "/capabilities",
});

export default function CapabilitiesPage() {
  return (
    <>
      <PageHeader label="Capabilities" title="Electrical & instrumentation capabilities">
        <p>Erection, testing and commissioning, from concept through to operation and maintenance support.</p>
      </PageHeader>
      <Capabilities />
      <Process />
      <WhyChoose />
      <CtaBand />
    </>
  );
}
