import { MoonBackdrop } from "@/components/site/moon-backdrop";
import { Preloader } from "@/components/site/preloader";
import { Cursor } from "@/components/site/cursor";
import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero-section";
import { About } from "@/components/site/about";
import { Skills } from "@/components/site/skills";
import { Projects } from "@/components/site/projects";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";

export default function Home() {
  return (
    <>
      <MoonBackdrop />
      <Preloader />
      <Cursor />
      <Nav />
      <main id="main" className="relative z-10 flex-1">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
