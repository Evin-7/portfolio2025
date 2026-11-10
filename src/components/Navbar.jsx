"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  ["Home", "home"],
  ["About", "about"],
  ["Skills", "skills"],
  ["Projects", "works"],
  ["Experience", "experience"],
  ["Contact", "contact"],
];

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m10 6-7 8 7 8M18 6l7 8-7 8M16 3l-4 22" />
    </svg>
  );
}

function DownloadIcon() {
  return <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 17v3h16v-3" /></svg>;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const toggleRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const sections = links.map(([, id]) => document.getElementById(id)).filter(Boolean);
    if (!sections.length || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActiveId(visible[0].target.id);
    }, { rootMargin: "-18% 0px -62% 0px", threshold: [0, 0.1, 0.25, 0.5] });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const firstLink = menuRef.current?.querySelector("a");
    firstLink?.focus();

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);
  const renderLink = ([label, id]) => (
    <a
      href={`#${id}`}
      key={id}
      onClick={closeMenu}
      aria-current={activeId === id ? "location" : undefined}
      className="nav-link"
    >
      {label}
    </a>
  );

  return (
    <header className="site-header">
      <div className="page-container nav-row">
        <a href="#home" className="brand-lockup" onClick={closeMenu} aria-label="Evin Leyander, home">
          <BrandMark />
          <span className="brand-name">Evin Leyander</span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(renderLink)}
        </nav>

        <div className="nav-actions">
          <a href="/resume" className="button button--outline"><DownloadIcon />Download Resume</a>
        </div>

        <button
          className="menu-toggle"
          ref={toggleRef}
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className={isMenuOpen ? "menu-toggle-lines is-open" : "menu-toggle-lines"} aria-hidden="true"><span /><span /></span>
        </button>
      </div>

      <nav
        id="mobile-navigation"
        ref={menuRef}
        className="mobile-panel"
        data-open={isMenuOpen}
        aria-label="Mobile navigation"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        {links.map(renderLink)}
        <a href="/resume" className="mobile-resume" onClick={closeMenu}><DownloadIcon />Download Resume</a>
      </nav>
    </header>
  );
}
