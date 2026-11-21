import Link from "next/link";
import PortfolioPageShell from "../components/PortfolioPageShell";

export default function NotFound() {
  return (
    <PortfolioPageShell>
      <div className="page-container content-page not-found-page">
        <p className="section-kicker">404 / Page not found</p>
        <h1>This page isn’t here.</h1>
        <p className="content-page-lead">The link may be outdated or the address may be mistyped. You can return to Evin Leyander’s portfolio or browse the selected work.</p>
        <div className="content-page-actions">
          <Link className="button button--primary" href="/">Portfolio home</Link>
          <Link className="button button--outline" href="/projects">Browse projects</Link>
        </div>
      </div>
    </PortfolioPageShell>
  );
}
