import Image from "next/image";
import logoMark from "../assets/icons/peniel-mark.svg";
import { siGithub } from "simple-icons";

const footerLinkClass = "inline-flex items-center gap-2 rounded-full border border-amber/20 bg-panel px-3 py-2 text-[0.82rem] text-copy no-underline transition hover:text-amber hover:shadow-[0_0_22px_rgba(212,175,55,0.15)]";

export default function Footer() {
  return (
    <footer className="border-t border-white/15 bg-[linear-gradient(110deg,rgba(10,13,18,0.94),rgba(255,255,255,0.08))] px-5 py-8 shadow-[0_1.25rem_3rem_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:py-10">
      <div className="mx-auto flex w-full max-w-[90rem] flex-col items-start gap-5 sm:px-3 md:flex-row md:items-center md:justify-between lg:px-8">
        <a href="#home" className="inline-flex" aria-label="Back to top">
          <Image src={logoMark} alt="Evin logo" className="block size-[34px]" />
        </a>

        <div className="flex flex-wrap gap-3">
          <a href="mailto:yjevin75@gmail.com" className={footerLinkClass}>
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-amber text-[0.68rem] font-bold leading-none text-ink" aria-hidden="true">✉</span>
            <span>Email</span>
          </a>
          <a href="https://github.com/Evin-7" target="_blank" rel="noopener noreferrer" className={footerLinkClass}>
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-amber text-ink" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="size-4 fill-current"><path d={siGithub.path} /></svg>
            </span>
            <span>GitHub</span>
          </a>
          <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer" className={footerLinkClass}>
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-amber text-[0.68rem] font-bold leading-none text-ink" aria-hidden="true">in</span>
            <span>LinkedIn</span>
          </a>
          <a href="tel:+917510255897" className={footerLinkClass}>
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-amber text-[0.68rem] font-bold leading-none text-ink" aria-hidden="true">☎</span>
            <span>+91 7510255897</span>
          </a>
        </div>

        <p className="m-0 text-[0.85rem] text-muted">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
