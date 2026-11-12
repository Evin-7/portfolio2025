import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
      <a className="skip-link" href="#main-content">Skip to content</a>
      <svg className="motion-filter-defs" aria-hidden="true" focusable="false">
        <defs>
          <filter id="portfolio-liquid-warp" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.032" numOctaves="1" seed="4" result="ripple" />
            <feDisplacementMap in="SourceGraphic" in2="ripple" scale="8" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
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
