import Link from "next/link";
import BreadcrumbTrail from "../../components/BreadcrumbTrail";
import PortfolioPageShell from "../../components/PortfolioPageShell";
import { experience } from "../../data/experience";
import { createPageMetadata, PROFILE } from "../../lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "About Evin Leyander | Software Engineer in Kerala, India",
  description: "Meet Evin Leyander, a software engineer in Kerala, India, working across web products, mobile apps, and full-stack development.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PortfolioPageShell>
      <div className="page-container content-page">
        <BreadcrumbTrail items={[{ name: "Home", href: "/" }, { name: "About", href: "/about" }]} />
        <header className="content-page-intro">
          <p className="section-kicker">About</p>
          <h1>Evin Leyander</h1>
          <p className="content-page-lead">
            Full stack software engineer based in Kerala, India. I work across web products, mobile apps, and API-connected workflows with React, Next.js, Vue.js, TypeScript, Node.js, and React Native.
          </p>
          <div className="content-page-actions">
            <Link className="button button--primary" href="/projects">Explore projects</Link>
            <Link className="button button--outline" href="/contact">Contact Evin</Link>
          </div>
        </header>

        <section className="content-section" aria-labelledby="about-focus-title">
          <p className="section-kicker">How I work</p>
          <h2 id="about-focus-title">From interface to integration</h2>
          <p>
            My work has included customer ordering and booking journeys, internal operations tools, SaaS workflows, and mobile companion apps. I contribute across interface implementation, backend and third-party integrations, and product features that connect those parts.
          </p>
          <p>
            The projects on this portfolio show a mix of React, Next.js, Vue.js, TypeScript, Node.js, React Native, API integrations, and database-backed product work. For a remote project or engineering role, send a short note about the product and the team you are building with.
          </p>
        </section>

        <section className="content-section" aria-labelledby="about-experience-title">
          <p className="section-kicker">Experience</p>
          <h2 id="about-experience-title">Product engineering across three teams</h2>
          <ol className="content-timeline">
            {experience.map((item) => (
              <li key={item.company}>
                <div className="content-timeline-heading">
                  <h3>{item.role}</h3>
                  <span>{item.period}</span>
                </div>
                <p><strong>{item.company}</strong> · {item.location}</p>
                <p>{item.focus}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="content-section content-facts" aria-label="Education and working location">
          <article>
            <p className="section-kicker">Education</p>
            <h2>Information Technology</h2>
            <p>Amal Jyothi College of Engineering · 2018–2022</p>
          </article>
          <article>
            <p className="section-kicker">Based in</p>
            <h2>Kerala, India</h2>
            <p>Remote collaboration for software products and engineering teams.</p>
          </article>
        </section>

        <section className="content-cta" aria-labelledby="about-next-title">
          <div>
            <p className="section-kicker">Next step</p>
            <h2 id="about-next-title">See the work or start a conversation.</h2>
          </div>
          <div className="content-page-actions">
            <Link className="button button--outline" href="/projects">Selected projects</Link>
            <Link className="button button--primary" href="/contact">Contact Evin Leyander</Link>
          </div>
        </section>
      </div>
    </PortfolioPageShell>
  );
}
