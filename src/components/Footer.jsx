import { siGithub } from "simple-icons";

const footerLinkClass = "inline-flex min-w-0 items-center justify-center gap-2 rounded-full border border-white/15 px-3 py-2 text-left text-xs text-muted no-underline transition-colors hover:border-white/40 hover:text-copy sm:px-4 sm:text-sm";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink py-8 sm:py-10">
      <div className="page-container">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <a href="#home" className="text-xs font-semibold uppercase tracking-[0.16em] text-copy" aria-label="Back to top">
              Evin Leyander
            </a>
            <span className="text-subtle" aria-hidden="true">·</span>
            <p className="m-0 text-xs text-muted">© {new Date().getFullYear()}</p>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:flex-wrap">
            <a href="mailto:yjevin75@gmail.com" className={footerLinkClass}>
              <span aria-hidden="true">✉</span>
              <span>Email</span>
            </a>
            <a href="https://github.com/Evin-7" target="_blank" rel="noopener noreferrer" className={footerLinkClass}>
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true"><path d={siGithub.path} /></svg>
              <span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer" className={footerLinkClass}>
              <span className="font-semibold" aria-hidden="true">in</span>
              <span>LinkedIn</span>
            </a>
            <a href="tel:+917510255897" className={footerLinkClass}>
              <span aria-hidden="true">☎</span>
              <span>+91 7510255897</span>
            </a>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-[11px] leading-5 text-subtle md:text-left">
          Approximate city, region, and country are inferred from your IP address and emailed to the site owner for visitor insights. This site does not request precise GPS location.
        </p>
      </div>
    </footer>
  );
}
