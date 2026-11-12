import PrivacyChoicesButton from "./PrivacyChoicesButton";

const footerLinks = [
  ["GitHub", "https://github.com/Evin-7"],
  ["LinkedIn", "https://www.linkedin.com/in/evin-leyander-536a70236/"],
  ["Email", "mailto:yjevin75@gmail.com"],
  ["Back to top ↑", "#home"],
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container footer-row">
        <a className="footer-brand" href="#home" aria-label="Evin Leyander, back to top">
          <strong>Evin Leyander</strong>
          <span>Full Stack Software Engineer</span>
        </a>
        <nav className="footer-links" aria-label="Footer navigation">
          {footerLinks.map(([label, href]) => (
            <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>{label}</a>
          ))}
          <a href="/privacy">Privacy</a>
          <PrivacyChoicesButton />
        </nav>
      </div>
      <div className="page-container footer-copyright">© {new Date().getFullYear()} Evin Leyander</div>
    </footer>
  );
}
