import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CinematicIntro from "../components/CinematicIntro";
import Hero from "../views/Hero";
import Highlights from "../views/Highlights";
import Skills from "../views/Skills";
import Works from "../views/Works";
import Experience from "../views/Experience";
import Contact from "../views/Contact";
import DesktopCursor from "../components/DesktopCursor";

export default function HomePage() {
  return (
    <div className="site-shell min-h-screen">
      <CinematicIntro />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content" tabIndex="-1">
        <Hero />
        <Highlights />
        <Skills />
        <Works />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <DesktopCursor />
    </div>
  );
}
