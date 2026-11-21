import Link from "next/link";
import { notFound } from "next/navigation";
import BreadcrumbTrail from "../../../components/BreadcrumbTrail";
import JsonLd from "../../../components/JsonLd";
import PortfolioPageShell from "../../../components/PortfolioPageShell";
import { projects } from "../../../data/projects";
import { getService, services } from "../../../data/services";
import { createPageMetadata, PROFILE, SITE_URL } from "../../../lib/siteMetadata";

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return createPageMetadata({
    title: `${service.title} | Evin Leyander`,
    description: service.description,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const relatedProjects = service.projectSlugs
    .map((projectSlug) => projects.find((project) => project.slug === projectSlug))
    .filter(Boolean);
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.description,
    url: `${SITE_URL}/services/${service.slug}`,
    provider: { "@id": `${SITE_URL}/#person`, name: PROFILE.name },
  };

  return (
    <PortfolioPageShell>
      <JsonLd data={serviceJsonLd} />
      <div className="page-container content-page service-detail-page">
        <BreadcrumbTrail items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: service.name, href: `/services/${service.slug}` },
        ]} />
        <header className="content-page-intro">
          <p className="section-kicker">Software development service</p>
          <h1>{service.title}</h1>
          <p className="content-page-lead">{service.intro}</p>
          <div className="content-page-actions">
            <Link className="button button--primary" href="/contact">Discuss this service</Link>
            <Link className="button button--outline" href="/projects">See selected work</Link>
          </div>
        </header>

        <section className="content-section" aria-labelledby="service-capabilities-title">
          <p className="section-kicker">Scope</p>
          <h2 id="service-capabilities-title">Ways I can contribute</h2>
          <ul className="content-check-list">
            {service.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
          </ul>
        </section>

        <section className="content-section" aria-labelledby="service-stack-title">
          <p className="section-kicker">Technology</p>
          <h2 id="service-stack-title">A stack shaped around the product</h2>
          <p>{service.technologies.join(" · ")}</p>
        </section>

        <section className="content-section" aria-labelledby="service-projects-title">
          <p className="section-kicker">Relevant projects</p>
          <h2 id="service-projects-title">Related selected work</h2>
          <ul className="related-project-list">
            {relatedProjects.map((project) => (
              <li key={project.slug}>
                <a href={`/projects#${project.slug}`}>{project.name}<span aria-hidden="true">↗</span></a>
                <p>{project.description}</p>
              </li>
            ))}
          </ul>
          <p className="content-note">The project summaries and technology lists are published as shown in the portfolio. They do not imply a particular individual contribution beyond the experience described on this site.</p>
        </section>

        <section className="content-cta" aria-labelledby="service-cta-title">
          <div>
            <p className="section-kicker">Next step</p>
            <h2 id="service-cta-title">Tell me about the product and the work ahead.</h2>
          </div>
          <Link className="button button--primary" href="/contact">Contact Evin Leyander</Link>
        </section>
      </div>
    </PortfolioPageShell>
  );
}
