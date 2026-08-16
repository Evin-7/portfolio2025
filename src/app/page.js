import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CircuitBackground from "../components/CircuitBackground";
import Hero from "../views/Hero";
import Highlights from "../views/Highlights";
import About from "../views/About";
import Skills from "../views/Skills";
import Works from "../views/Works";
import Contact from "../views/Contact";

export default function HomePage() {
  return (
    <div className="app relative isolate min-h-screen">
      <CircuitBackground />
      <div className="relative z-10">
        <div className="page-shell">
          <Navbar />
          <main className="content-shell">
            <section id="home">
              <Hero />
            </section>
            <Highlights />
            <section id="about">
              <About />
            </section>
            <section id="skills">
              <Skills />
            </section>
            <section id="works">
              <Works />
            </section>
            <section id="contact">
              <Contact />
            </section>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
