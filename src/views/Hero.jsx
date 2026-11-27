"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

function HeroWord({ children, className = "", delay, introComplete, reduceMotion }) {
  return (
    <span className="hero-word-mask">
      <motion.span
        className={`hero-word ${className}`}
        initial={reduceMotion ? false : { opacity: 0, y: "105%", filter: "blur(7px)" }}
        animate={reduceMotion || introComplete
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: "105%", filter: "blur(7px)" }}
        transition={{ duration: reduceMotion ? 0 : 0.78, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const [introComplete, setIntroComplete] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const markIntroComplete = () => setIntroComplete(true);
    if (document.documentElement.dataset.introComplete === "true") {
      markIntroComplete();
      return undefined;
    }
    window.addEventListener("portfolio:intro-reveal", markIntroComplete);
    return () => window.removeEventListener("portfolio:intro-reveal", markIntroComplete);
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduceMotion(preference.matches);
    syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => preference.removeEventListener("change", syncPreference);
  }, []);

  return (
    <section
      className="hero-section"
      aria-labelledby="hero-title"
    >
      <div className="page-container hero-grid">
        <div className="hero-copy nav-anchor-target" id="home">
          <motion.p
            className="hero-eyebrow"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={reduceMotion || introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.48, delay: reduceMotion ? 0 : 0.08 }}
          >
            EVIN LEYANDER <span aria-hidden="true">·</span> SOFTWARE ENGINEER
          </motion.p>
          <h1 className="hero-title" id="hero-title">
            <span className="hero-title-line">
              <HeroWord delay={0.18} introComplete={introComplete} reduceMotion={reduceMotion}>Building</HeroWord>
              <HeroWord className="hero-title-accent" delay={0.3} introComplete={introComplete} reduceMotion={reduceMotion}>thoughtful</HeroWord>
            </span>
            <span className="hero-title-line">
              <HeroWord delay={0.42} introComplete={introComplete} reduceMotion={reduceMotion}>digital</HeroWord>
              <HeroWord delay={0.54} introComplete={introComplete} reduceMotion={reduceMotion}>experiences.</HeroWord>
            </span>
          </h1>
          <motion.div
            className="hero-ctas"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={reduceMotion || introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.68 }}
          >
            <a className="button button--primary" href="#works" data-magnetic data-liquid>
              <span className="button-label">View Projects <span aria-hidden="true">→</span></span>
            </a>
            <a className="button button--outline" href="#contact" data-magnetic>
              <span className="button-label"><svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>Get in Touch</span>
            </a>
          </motion.div>
          <motion.p
            className="hero-meta"
            aria-label="Portfolio highlights"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: reduceMotion || introComplete ? 1 : 0 }}
            transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.84 }}
          >
            <span>Web &amp; mobile products</span><span>End-to-end product development</span>
          </motion.p>
        </div>
      </div>
    </section>
  );
}
