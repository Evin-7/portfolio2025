"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

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
  const sectionRef = useRef(null);
  const [introComplete, setIntroComplete] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothPointerX = useSpring(pointerX, { stiffness: 75, damping: 22, mass: 0.8 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 75, damping: 22, mass: 0.8 });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const parallaxX = useTransform(smoothPointerX, [-1, 1], [-13, 13]);
  const pointerParallaxY = useTransform(smoothPointerY, [-1, 1], [-9, 9]);
  const scrollParallax = useTransform(scrollYProgress, [0, 1], [0, 38]);
  const parallaxY = useTransform(() => pointerParallaxY.get() + scrollParallax.get());

  useEffect(() => {
    const markIntroComplete = () => setIntroComplete(true);
    if (document.documentElement.dataset.introComplete === "true") {
      markIntroComplete();
      return undefined;
    }
    window.addEventListener("portfolio:intro-complete", markIntroComplete);
    return () => window.removeEventListener("portfolio:intro-complete", markIntroComplete);
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduceMotion(preference.matches);
    syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => preference.removeEventListener("change", syncPreference);
  }, []);

  const moveParallaxWithPointer = (event) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
  };

  const resetParallaxPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      className="hero-section"
      ref={sectionRef}
      aria-labelledby="hero-title"
      onPointerMove={moveParallaxWithPointer}
      onPointerLeave={resetParallaxPointer}
    >
      <motion.div
        className="hero-parallax-layer"
        aria-hidden="true"
        style={{ x: reduceMotion ? 0 : parallaxX, y: reduceMotion ? 0 : parallaxY }}
      />
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
          <h1 className="hero-title" id="hero-title" aria-label="Building thoughtful digital experiences.">
            <span className="hero-title-line" aria-hidden="true">
              <HeroWord delay={0.18} introComplete={introComplete} reduceMotion={reduceMotion}>Building</HeroWord>
              <HeroWord className="hero-title-accent" delay={0.3} introComplete={introComplete} reduceMotion={reduceMotion}>thoughtful</HeroWord>
            </span>
            <span className="hero-title-line" aria-hidden="true">
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
            <a className="button button--primary" href="#works" data-magnetic data-liquid data-cursor-label="VIEW">
              <span className="button-label">View Projects <span aria-hidden="true">→</span></span>
            </a>
            <a className="button button--outline" href="#contact" data-magnetic data-cursor-label="SAY HI">
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
            <span>50+ projects</span><span>End-to-end product development</span>
          </motion.p>
        </div>
      </div>
      <div className="hero-scroll-cue" aria-hidden="true"><span />Scroll to explore</div>
    </section>
  );
}
