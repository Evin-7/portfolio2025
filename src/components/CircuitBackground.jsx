"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export default function CircuitBackground() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 4500], [0, reduceMotion ? 0 : 84]);
  const scrollShade = useTransform(scrollY, [0, 900, 2200, 4500], [0.02, 0.03, 0.06, 0.14]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute -inset-24 mix-blend-screen will-change-transform"
        style={{ y: parallaxY }}
        initial={reduceMotion ? false : { opacity: 0.34, scale: 1.02 }}
        animate={reduceMotion ? undefined : { opacity: [0.34, 0.44, 0.34], scale: [1.02, 1, 1.02] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src="/hero-circuit.svg" alt="" fill priority sizes="100vw" className="object-cover object-center" />
      </motion.div>
      <div className="hero-circuit-left-quiet" />
      <div className="hero-circuit-right-quiet" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/14 to-ink/82" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(10,13,18,0.46)_86%)]" />
      <motion.div className="absolute inset-0 bg-ink" style={{ opacity: scrollShade }} />
    </div>
  );
}
