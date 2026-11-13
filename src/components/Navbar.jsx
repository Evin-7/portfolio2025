"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const links = [
  ["Home", "home"],
  ["Skills", "skills"],
  ["Projects", "works"],
  ["Experience", "experience"],
  ["Contact", "contact"],
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const activeLockRef = useRef(false);
  const unlockTimerRef = useRef(null);

  const lockActiveItem = useCallback((id) => {
    if (!links.some(([, linkId]) => linkId === id)) return false;
    activeLockRef.current = true;
    setActiveId(id);
    if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
    unlockTimerRef.current = window.setTimeout(() => {
      activeLockRef.current = false;
      unlockTimerRef.current = null;
    }, 1800);
    return true;
  }, []);

  useEffect(() => {
    const sectionIds = links.map(([, id]) => id);
    const getTarget = (id) => document.getElementById(id);
    const activateHash = () => {
      const id = window.location.hash.slice(1);
      if (!lockActiveItem(id)) updateFromScroll();
    };
    const restoreHashPosition = () => {
      const id = window.location.hash.slice(1);
      if (!lockActiveItem(id)) {
        updateFromScroll();
        return;
      }

      // Browsers restore the previous scroll position during history traversal,
      // which can leave the URL hash and active navigation item out of sync.
      // Re-align only on popstate; normal link clicks use native hash scrolling.
      window.requestAnimationFrame(() => {
        const target = getTarget(id);
        if (!target) return;
        const header = document.querySelector(".site-header");
        const headerHeight = header?.getBoundingClientRect().height ?? 0;
        const anchorGap = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--anchor-gap")) || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - anchorGap;
        window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
      });
    };
    const updateFromScroll = () => {
      if (activeLockRef.current) return;
      const header = document.querySelector(".site-header");
      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      const anchorGap = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--anchor-gap")) || 64;
      const activationLine = headerHeight + anchorGap + 2;
      const targets = sectionIds.map(getTarget).filter(Boolean);
      if (!targets.length) return;

      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        setActiveId(targets[targets.length - 1].id);
        return;
      }

      const current = targets.filter((target) => target.getBoundingClientRect().top <= activationLine).at(-1);
      setActiveId((current ?? targets[0]).id);
    };
    const releaseLock = () => {
      if (!activeLockRef.current) return;
      activeLockRef.current = false;
      if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
      updateFromScroll();
    };

    const initialUpdate = window.requestAnimationFrame(() => {
      const hashId = window.location.hash.slice(1);
      if (!lockActiveItem(hashId)) updateFromScroll();
    });
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("hashchange", activateHash);
    window.addEventListener("popstate", restoreHashPosition);
    window.addEventListener("scrollend", releaseLock);
    window.addEventListener("resize", updateFromScroll);
    return () => {
      window.cancelAnimationFrame(initialUpdate);
      window.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("hashchange", activateHash);
      window.removeEventListener("popstate", restoreHashPosition);
      window.removeEventListener("scrollend", releaseLock);
      window.removeEventListener("resize", updateFromScroll);
      if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
    };
  }, [lockActiveItem]);

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
  const handleAnchorClick = (id) => {
    lockActiveItem(id);
    closeMenu();
  };
  const renderLink = ([label, id]) => (
    <a
      href={`#${id}`}
      key={id}
      onClick={() => handleAnchorClick(id)}
      aria-current={activeId === id ? "location" : undefined}
      className="nav-link"
      data-cursor-label={label.toUpperCase()}
    >
      {label}
    </a>
  );

  return (
    <header className="site-header">
      <div className="page-container nav-row">
        <a href="#home" className="brand-lockup" onClick={() => handleAnchorClick("home")} aria-label="Evin Leyander, home" data-magnetic data-cursor-label="HOME">
          <span className="brand-mark-frame" aria-hidden="true">
            <Image className="brand-mark-image" src="/el-monogram-neon.png" alt="" width={120} height={80} priority />
          </span>
          <span className="brand-name">Evin Leyander</span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(renderLink)}
        </nav>

        <button
          className="menu-toggle"
          ref={toggleRef}
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          data-cursor-label={isMenuOpen ? "CLOSE" : "MENU"}
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
      </nav>
    </header>
  );
}
