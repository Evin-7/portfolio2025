import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../views/Hero";
import Highlights from "../views/Highlights";
import Skills from "../views/Skills";
import Works from "../views/Works";
import Experience from "../views/Experience";
import Contact from "../views/Contact";

export default function HomePage() {
  return (
    <div className="site-shell min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Highlights />
        <Skills />
        <Works />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
