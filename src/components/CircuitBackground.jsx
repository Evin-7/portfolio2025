"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export default function CircuitBackground() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1100], [0, reduceMotion ? 0 : 220]);
  const scrollShade = useTransform(scrollY, [0, 500, 1000], [0.04, 0.3, 0.82]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute -inset-8 will-change-transform"
        style={{ y: parallaxY }}
        initial={reduceMotion ? false : { opacity: 0.32, scale: 1.02 }}
        animate={reduceMotion ? undefined : { opacity: [0.32, 0.4, 0.32], scale: [1.02, 1, 1.02] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src="/hero-circuit.png" alt="" fill priority sizes="100vw" className="object-cover object-center brightness-[1.08]" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/58 via-ink/18 to-ink/86" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(10,13,18,0.46)_86%)]" />
      <motion.div className="absolute inset-0 bg-ink" style={{ opacity: scrollShade }} />
    </div>
  );
}
