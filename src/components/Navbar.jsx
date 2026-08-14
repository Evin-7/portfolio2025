"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import logoMark from "../assets/icons/peniel-mark.svg";

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
    <nav className="fixed inset-x-0 top-0 z-[1000] px-3 pt-3 font-mono sm:px-5 sm:pt-4">
      <div className="relative mx-auto flex h-14 w-full max-w-[90rem] items-center justify-center rounded-2xl border border-white/15 bg-[linear-gradient(110deg,rgba(10,13,18,0.94),rgba(255,255,255,0.08))] shadow-[0_1.25rem_3rem_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:h-16">
        <a
          href="#home"
          className="absolute left-3 flex items-center rounded-lg border border-white/15 bg-white/[0.035] p-0.5 transition hover:-translate-y-px hover:border-amber/70 hover:bg-amber/[0.08] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-amber-light sm:left-5"
          onClick={closeMenu}
        >
          <Image src={logoMark} alt="Evin logo" className="block size-[32px]" priority />
        </a>

        <ul className="absolute right-5 hidden items-center gap-14 md:flex lg:right-8 lg:gap-20">
          {links.map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                className="relative text-[0.77rem] font-semibold tracking-[0.04em] text-muted transition hover:text-amber-light focus-visible:text-amber-light focus-visible:outline-none after:absolute after:inset-x-0 after:-bottom-2 after:h-px after:origin-center after:scale-x-0 after:bg-amber after:transition-transform hover:after:scale-x-100 focus-visible:after:scale-x-100"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="absolute right-3 flex size-10 flex-col justify-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.035] p-2.5 md:hidden sm:right-5"
          type="button"
          aria-label="Toggle navigation menu"
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="block h-px w-full bg-copy" />
          <span className="block h-px w-full bg-copy" />
          <span className="block h-px w-full bg-copy" />
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`mx-auto mt-2 grid w-full max-w-[90rem] overflow-hidden rounded-2xl border border-white/15 bg-[linear-gradient(110deg,rgba(10,13,18,0.96),rgba(255,255,255,0.07))] px-5 font-mono shadow-[0_1.25rem_3rem_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-[max-height,padding,opacity] duration-200 md:hidden ${isMenuOpen ? "max-h-72 py-3 opacity-100" : "max-h-0 border-transparent py-0 opacity-0"}`}
        aria-hidden={!isMenuOpen}
      >
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            onClick={closeMenu}
            tabIndex={isMenuOpen ? 0 : -1}
            className="py-3 text-[0.8rem] font-semibold tracking-[0.05em] text-muted transition hover:text-amber-light focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-amber-light"
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
