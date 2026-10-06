import { About } from "@/components/About";
import { Credentials } from "@/components/Credentials";
import { MissionVision } from "@/components/MissionVision";
import { CtaBand, PageHeader } from "@/components/PageHeader";
import { WhyChoose } from "@/components/WhyChoose";
import { about } from "@/data/company";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About",
  description:
    "About Krishna Power & Engineers: an engineering company in Lucknow providing electrical and power infrastructure solutions for the power, cement and steel industries.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader label="About" title="Krishna Power & Engineers">
        <p>{about.summary}</p>
      </PageHeader>
      <About full />
      <MissionVision />
      <WhyChoose />
      <Credentials />
      <CtaBand />
    </>
  );
}
