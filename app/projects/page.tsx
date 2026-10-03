import { Clients } from "@/components/Clients";
import { CtaBand, PageHeader } from "@/components/PageHeader";
import { Projects, WorkInHand } from "@/components/Projects";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Industrial electrical projects by Krishna Power & Engineers, including power plant projects of 80 MW and 40 MW, steel plant projects and work in hand.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHeader label="Projects" title="Projects and work in hand">
        <p>Industrial project highlights, work currently in hand, and our portfolio in numbers.</p>
      </PageHeader>
      <Projects full />
      <WorkInHand />
      <Clients />
      <CtaBand />
    </>
  );
}
