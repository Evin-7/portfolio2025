import Image from "next/image";
import Link from "next/link";
import BreadcrumbTrail from "../../components/BreadcrumbTrail";
import PortfolioPageShell from "../../components/PortfolioPageShell";
import { projects } from "../../data/projects";
import { createPageMetadata } from "../../lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Software Projects by Evin Leyander | Web and Mobile Apps",
  description: "Browse web applications, mobile apps, booking platforms, SaaS products, and other selected work by software engineer Evin Leyander.",
  path: "/projects",
});

const featuredSlugs = [
  "mezeh",
  "mezeh-mobile-app",
  "mezeh-catering",
  "sitecore",
  "ontix",
  "peniel-tech",
  "st-george-csi-church",
];

const orderedProjects = [
  ...featuredSlugs.map((slug) => projects.find((project) => project.slug === slug)).filter(Boolean),
  ...projects.filter((project) => !featuredSlugs.includes(project.slug)),
];

function ProjectCard({ project, index }) {
  return (
    <article className="project-index-card" id={project.slug} aria-labelledby={`${project.slug}-title`}>
      <a className="project-index-image" href={project.links[0].href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.name} in a new tab`}>
        <Image
          src={project.image}
          alt={`${project.name} project preview`}
          width={project.image.width}
          height={project.image.height}
          sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 620px"
          priority={index < 2}
        />
      </a>
      <div className="project-index-copy">
        <p className="project-index-kicker">Selected project · {String(index + 1).padStart(2, "0")}</p>
        <h2 id={`${project.slug}-title`}>{project.name}</h2>
        <p>{project.description}</p>
        <p className="project-index-technologies"><strong>Technologies:</strong> {project.technologies.join(" · ")}</p>
        <div className="project-index-links">
          {project.links.map((link) => (
            <a href={link.href} key={link.href} target="_blank" rel="noopener noreferrer">{link.label} <span aria-hidden="true">↗</span></a>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  return (
    <PortfolioPageShell>
      <div className="page-container content-page projects-index-page">
        <BreadcrumbTrail items={[{ name: "Home", href: "/" }, { name: "Projects", href: "/projects" }]} />
        <header className="content-page-intro">
          <p className="section-kicker">Selected work</p>
          <h1>Web and mobile products, built for real workflows.</h1>
          <p className="content-page-lead">
            A portfolio index of customer-facing apps, booking and ordering experiences, SaaS tools, operations software, and mobile products. Each entry lists the project summary, technologies, and public link available in the original portfolio.
          </p>
        </header>
        <div className="project-index-list">
          {orderedProjects.map((project, index) => <ProjectCard project={project} index={index} key={project.slug} />)}
        </div>
        <section className="content-cta" aria-labelledby="projects-contact-title">
          <div>
            <p className="section-kicker">Have a product in mind?</p>
            <h2 id="projects-contact-title">Talk through the scope and next step.</h2>
          </div>
          <Link className="button button--primary" href="/contact">Contact Evin Leyander</Link>
        </section>
      </div>
    </PortfolioPageShell>
  );
}
