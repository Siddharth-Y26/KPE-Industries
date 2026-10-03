import { ArrowRight, MapPin } from "lucide-react";
import { projectHighlights, workInHand, type Project } from "@/data/projects";
import { ButtonLink } from "./ui/Button";
import { Container } from "./ui/Container";
import { revealDelay } from "./ui/CountUp";
import { Photo } from "./ui/Photo";
import { SectionHeading } from "./ui/SectionHeading";

function ProjectMeta({ project, tone = "light" }: { project: Project; tone?: "light" | "dark" }) {
  if (!project.location) return null;
  return (
    <p className={`mt-3 flex items-center gap-2 text-sm ${tone === "dark" ? "text-steel-300" : "text-steel-500"}`}>
      <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
      {project.location}
    </p>
  );
}

// Projects with a stated capacity lead; the rest follow in a grid.
// `full` (Projects page) drops the "view all" link.
export function Projects({ full = false }: { full?: boolean }) {
  const featured = projectHighlights.filter((project) => project.capacity);
  const others = projectHighlights.filter((project) => !project.capacity);

  // The last card stretches across whatever is left of its row (2 columns on tablets,
  // 3 on desktop), so the grid never ends in empty cells.
  const lastSpan = [
    others.length % 2 === 1 ? "sm:max-lg:col-span-2" : "",
    others.length % 3 === 1 ? "lg:col-span-3" : others.length % 3 === 2 ? "lg:col-span-2" : "",
  ].join(" ");

  return (
    <section className="bg-mist py-20 lg:py-32">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="Projects" title="Industrial project highlights">
            <p>Selected industrial electrical projects from our record.</p>
          </SectionHeading>
          {full ? null : (
            <ButtonLink href="/projects" variant="outline" className="shrink-0 self-start lg:self-auto">
              View Projects
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          )}
        </div>

        <ul className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {featured.map((project, index) => (
            <li
              key={project.client}
              data-reveal
              style={revealDelay(index)}
              className="relative isolate overflow-hidden bg-navy-900 p-8 text-white lg:p-12"
            >
              <div aria-hidden="true" className="blueprint absolute inset-0 -z-10" />
              <p className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-steel-300">
                {project.type}
              </p>
              <p className="mt-6 font-display text-7xl font-semibold leading-none tracking-tight text-gold-500 lg:text-8xl">
                {project.capacity}
              </p>
              <h3 className="mt-8 text-2xl font-semibold lg:text-3xl">{project.client}</h3>
              <ProjectMeta project={project} tone="dark" />
            </li>
          ))}
        </ul>

        <ul data-reveal className="mt-6 grid gap-px border border-steel-100 bg-steel-100 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3">
          {others.map((project, index) => (
            <li
              key={project.client}
              className={`flex flex-col bg-white ${index === others.length - 1 ? lastSpan : ""}`}
            >
              {project.image ? (
                <Photo
                  src={project.image}
                  alt={`${project.type} for ${project.client}`}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                  className="aspect-[16/9]"
                />
              ) : null}
              <div className="p-7 lg:p-8">
                <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">
                  {project.sector}
                </p>
                <h3 className="mt-4 text-xl font-semibold leading-snug text-navy-900">{project.client}</h3>
                <p className="mt-2 text-steel-500">{project.type}</p>
                <ProjectMeta project={project} />
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function WorkInHand() {
  return (
    <section id="work-in-hand" className="py-20 lg:py-32">
      <Container>
        <SectionHeading eyebrow="Work in hand" title="Projects under execution">
          <p>Work currently being carried out by our teams.</p>
        </SectionHeading>

        {/* A real table on wide screens; stacked cards on phones, where a table would scroll sideways. */}
        <div data-reveal className="mt-12 hidden md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-navy-900 font-display text-xs font-semibold uppercase tracking-[0.18em] text-steel-500">
                <th scope="col" className="w-16 py-4 pr-4">
                  No.
                </th>
                <th scope="col" className="py-4 pr-6">
                  Work
                </th>
                <th scope="col" className="py-4 pr-6">
                  Client
                </th>
                <th scope="col" className="py-4">
                  Location
                </th>
              </tr>
            </thead>
            <tbody>
              {workInHand.map((item, index) => (
                <tr key={item.work} className="border-b border-steel-100 align-top">
                  <td className="py-6 pr-4 font-display text-sm font-semibold text-gold-700">0{index + 1}</td>
                  <th scope="row" className="py-6 pr-6 font-display text-lg font-semibold text-navy-900">
                    {item.work}
                  </th>
                  <td className="py-6 pr-6 text-steel-500">{item.client}</td>
                  <td className="py-6 text-steel-500">{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="mt-10 grid gap-4 md:hidden">
          {workInHand.map((item, index) => (
            <li key={item.work} data-reveal className="border border-steel-100 p-6">
              <p className="font-display text-sm font-semibold text-gold-700">0{index + 1}</p>
              <h3 className="mt-3 text-lg font-semibold leading-snug text-navy-900">{item.work}</h3>
              <p className="mt-3 text-steel-500">{item.client}</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-steel-500">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.location}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
