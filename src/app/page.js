import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CinematicIntro from "../components/CinematicIntro";
import LiquidGlassBackground from "../components/LiquidGlassBackground";
import Hero from "../views/Hero";
import Highlights from "../views/Highlights";
import Skills from "../views/Skills";
import Works from "../views/Works";
import Experience from "../views/Experience";
import Meeting from "../views/Meeting";
import Contact from "../views/Contact";
import PointerEffects from "../components/PointerEffects";
import { PROFILE } from "../lib/siteMetadata";
import JsonLd from "../components/JsonLd";

const homepageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${PROFILE.url}/#website`,
      url: PROFILE.url,
      name: "Evin Leyander Portfolio",
      publisher: { "@id": `${PROFILE.url}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${PROFILE.url}/#profile`,
      url: PROFILE.url,
      name: "Evin Leyander | Full Stack Software Engineer",
      isPartOf: { "@id": `${PROFILE.url}/#website` },
      mainEntity: { "@id": `${PROFILE.url}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${PROFILE.url}/#person`,
      name: PROFILE.name,
      url: PROFILE.url,
      jobTitle: PROFILE.jobTitle,
      description: PROFILE.description,
      sameAs: PROFILE.sameAs,
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={homepageJsonLd} />
      <div className="site-shell min-h-screen">
        <LiquidGlassBackground />
        <CinematicIntro />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Navbar />
        <main id="main-content" tabIndex="-1">
          <Hero />
          <Highlights />
          <Skills />
          <Works />
          <Experience />
          <Meeting />
          <Contact />
        </main>
        <Footer />
        <PointerEffects />
      </div>
    </>
  );
}
