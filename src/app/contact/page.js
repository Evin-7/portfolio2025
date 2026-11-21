import BreadcrumbTrail from "../../components/BreadcrumbTrail";
import PortfolioPageShell from "../../components/PortfolioPageShell";
import Contact from "../../views/Contact";
import { createPageMetadata } from "../../lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Contact Evin Leyander | Software Development and Engineering Roles",
  description: "Contact software engineer Evin Leyander in Kerala, India, about remote freelance projects, software engineering roles, or product collaborations.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PortfolioPageShell>
      <div className="page-container content-page contact-route-page">
        <BreadcrumbTrail items={[{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }]} />
        <header className="content-page-intro">
          <p className="section-kicker">Contact</p>
          <h1>Contact Evin Leyander</h1>
          <p className="content-page-lead">
            For remote freelance projects, software engineering roles, or product collaborations, send a short note about your team, product, and what you want to build.
          </p>
          <a className="contact-route-email" href="mailto:yjevin75@gmail.com">yjevin75@gmail.com <span aria-hidden="true">↗</span></a>
        </header>
      </div>
      <Contact />
    </PortfolioPageShell>
  );
}
