import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../views/Hero";
import Highlights from "../views/Highlights";
import About from "../views/About";
import Skills from "../views/Skills";
import Works from "../views/Works";
import Contact from "../views/Contact";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <main>
        <section id="home" className="scroll-mt-24">
          <Hero />
        </section>
        <Highlights />
        <section id="about" className="scroll-mt-24">
          <About />
        </section>
        <section id="skills" className="scroll-mt-24">
          <Skills />
        </section>
        <section id="works" className="scroll-mt-24">
          <Works />
        </section>
        <section id="contact" className="scroll-mt-24">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  );
}
