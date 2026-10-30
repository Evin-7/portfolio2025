"use client";

import { useEffect, useState } from "react";

const links = [
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Work", "#works"],
  ["Contact", "#contact"],
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-[1000] border-b border-white/10 bg-ink px-5 sm:px-8">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[90rem] items-center justify-between lg:px-12 2xl:px-[clamp(2rem,4vw,6rem)]">
        <a
          href="#home"
          className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-copy transition-colors hover:text-muted"
          onClick={closeMenu}
        >
          Evin Leyander
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {links.map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                className="text-[0.75rem] font-medium tracking-[0.05em] text-muted transition-colors hover:text-copy focus-visible:text-copy"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="flex size-10 flex-col items-center justify-center gap-[5px] rounded-full border border-white/20 text-copy transition-colors hover:bg-white/[0.06] md:hidden"
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="block h-px w-4 bg-current" />
          <span className="block h-px w-4 bg-current" />
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={"mx-auto grid w-full max-w-[90rem] overflow-hidden border-t border-white/10 px-2 transition-[max-height,padding,opacity] duration-200 md:hidden " + (isMenuOpen ? "max-h-72 py-3 opacity-100" : "max-h-0 border-transparent py-0 opacity-0")}
        aria-hidden={!isMenuOpen}
      >
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            onClick={closeMenu}
            tabIndex={isMenuOpen ? 0 : -1}
            className="py-3 text-sm font-medium text-muted transition-colors hover:text-copy focus-visible:text-copy"
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
