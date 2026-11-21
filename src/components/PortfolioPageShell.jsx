import Image from "next/image";
import Link from "next/link";

const pageLinks = [
  ["About", "/about"],
  ["Projects", "/projects"],
  ["Services", "/services"],
];

export function PortfolioPageHeader() {
  return (
    <header className="site-header page-route-header">
      <div className="page-container page-route-header__row">
        <Link href="/" className="brand-lockup" aria-label="Evin Leyander, portfolio home">
          <span className="brand-mark-frame" aria-hidden="true">
            <Image className="brand-mark-image" src="/el-monogram-neon.png" alt="" width={120} height={80} />
          </span>
          <span className="brand-name">Evin Leyander</span>
        </Link>
        <nav className="page-route-nav" aria-label="Portfolio pages">
          {pageLinks.map(([label, href]) => <Link className="nav-link" key={href} href={href}>{label}</Link>)}
          <Link className="button button--primary page-route-contact" href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}

export function PortfolioPageFooter() {
  return (
    <footer className="site-footer">
      <div className="page-container footer-row">
        <Link className="footer-brand" href="/">
          <strong>Evin Leyander</strong>
          <span>Full Stack Software Engineer · Kerala, India</span>
        </Link>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link href="/about">About</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/services">Services</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
      <div className="page-container footer-copyright">© {new Date().getFullYear()} Evin Leyander</div>
    </footer>
  );
}

export default function PortfolioPageShell({ children }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <PortfolioPageHeader />
      <main id="main-content" className="portfolio-page-content">{children}</main>
      <PortfolioPageFooter />
    </>
  );
}
