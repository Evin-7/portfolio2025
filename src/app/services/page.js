import Link from "next/link";
import BreadcrumbTrail from "../../components/BreadcrumbTrail";
import PortfolioPageShell from "../../components/PortfolioPageShell";
import { services } from "../../data/services";
import { createPageMetadata } from "../../lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Software Development Services | Evin Leyander",
  description: "Remote software development for full-stack web apps, React and Next.js products, and React Native mobile applications.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <PortfolioPageShell>
      <div className="page-container content-page">
        <BreadcrumbTrail items={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }]} />
        <header className="content-page-intro">
          <p className="section-kicker">Services</p>
          <h1>Software development for web and mobile products.</h1>
          <p className="content-page-lead">
            Remote product development from Kerala, India. Explore focused support for full-stack web applications, React and Next.js interfaces, and React Native mobile apps. Project fit and scope are discussed directly before work begins.
          </p>
        </header>
        <div className="service-index-grid">
          {services.map((service, index) => (
            <article className="service-index-card" key={service.slug}>
              <p className="project-index-kicker">0{index + 1} / Service</p>
              <h2>{service.name}</h2>
              <p>{service.intro}</p>
              <ul>
                {service.capabilities.slice(0, 3).map((capability) => <li key={capability}>{capability}</li>)}
              </ul>
              <Link className="text-link" href={`/services/${service.slug}`}>Explore this service <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
        <section className="content-section services-tech" aria-labelledby="service-tech-title">
          <p className="section-kicker">Tools from the portfolio</p>
          <h2 id="service-tech-title">Technologies used across selected work</h2>
          <p>React, Next.js, Vue.js, TypeScript, Node.js, Express.js, React Native, Expo, PostgreSQL, and REST APIs appear across the projects and experience documented on this site.</p>
        </section>
        <section className="content-cta" aria-labelledby="services-contact-title">
          <div>
            <p className="section-kicker">Start with the product</p>
            <h2 id="services-contact-title">Share what you need to build or improve.</h2>
          </div>
          <Link className="button button--primary" href="/contact">Discuss a project</Link>
        </section>
      </div>
    </PortfolioPageShell>
  );
}
