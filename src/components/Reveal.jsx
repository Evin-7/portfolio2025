"use client";

import { motion, useReducedMotion } from "motion/react";

const directions = {
  up: { x: 0, y: 24 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
};

export default function Reveal({ as = "div", children, className = "", id, delay = 0, direction = "up" }) {
  const reduceMotion = useReducedMotion();
  const offset = directions[direction] ?? directions.up;
  const MotionElement = as === "li" ? motion.li : motion.div;

  return (
    <MotionElement
      className={className}
      id={id}
      initial={reduceMotion ? false : { opacity: 0, ...offset }}
      whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionElement>
  );
}
