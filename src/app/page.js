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
    <div className="app">
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
  );
}
