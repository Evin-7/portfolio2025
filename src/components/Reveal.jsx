"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const directions = {
  up: { x: 0, y: 24 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
};

const revealVariants = {
  rise: { initial: { opacity: 0 }, animate: { opacity: 1 } },
  soft: { initial: { opacity: 0, scale: 0.975, filter: "blur(5px)" }, animate: { opacity: 1, scale: 1, filter: "blur(0px)" } },
  mask: { initial: { opacity: 0, clipPath: "inset(0 0 18% 0 round 16px)" }, animate: { opacity: 1, clipPath: "inset(0 0 0% 0 round 16px)" } },
};

export default function Reveal({ as = "div", children, className = "", id, delay = 0, direction = "up", variant = "rise" }) {
  const reduceMotion = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const elementRef = useRef(null);
  const isInView = useInView(elementRef, { once: true, amount: 0.18 });
  const offset = directions[direction] ?? directions.up;
  const animation = revealVariants[variant] ?? revealVariants.rise;
  const MotionElement = as === "li" ? motion.li : motion.div;
  const isVisible = reduceMotion || !hydrated || isInView;
  const target = isVisible
    ? { ...animation.animate, x: 0, y: 0 }
    : { ...animation.initial, ...offset };

  useEffect(() => setHydrated(true), []);

  return (
    <MotionElement
      ref={elementRef}
      className={`motion-reveal ${className}`.trim()}
      id={id}
      initial={false}
      animate={target}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionElement>
  );
}
