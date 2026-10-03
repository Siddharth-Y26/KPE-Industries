import { About } from "@/components/About";
import { Capabilities } from "@/components/Capabilities";
import { Clients } from "@/components/Clients";
import { Contact, Enquiry } from "@/components/Contact";
import { Credentials } from "@/components/Credentials";
import { Hero } from "@/components/Hero";
import { MissionVision } from "@/components/MissionVision";
import { Process } from "@/components/Process";
import { Projects } from "@/components/Projects";
import { Services } from "@/components/Services";
import { Stats } from "@/components/Stats";
import { WhyChoose } from "@/components/WhyChoose";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <MissionVision />
      <Services />
      <Capabilities />
      <Process />
      <WhyChoose />
      <Projects />
      <Clients />
      <Credentials />
      <Enquiry />
      <Contact />
    </>
  );
}
