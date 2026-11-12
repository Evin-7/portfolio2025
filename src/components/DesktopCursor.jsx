"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function DesktopCursor() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(-80);
  const pointerY = useMotionValue(-80);
  const x = useSpring(pointerX, { stiffness: 520, damping: 38, mass: 0.35 });
  const y = useSpring(pointerY, { stiffness: 520, damping: 38, mass: 0.35 });
  const [enabled, setEnabled] = useState(false);
  const [pointerActive, setPointerActive] = useState(false);
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState("default");
  const labelRef = useRef("");
  const magneticRef = useRef(null);
  const liquidRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const resetElement = (element, properties) => {
      if (!element) return;
      properties.forEach((property) => element.style.removeProperty(property));
    };
    const resetTargets = () => {
      resetElement(magneticRef.current, ["--magnetic-x", "--magnetic-y"]);
      resetElement(liquidRef.current, ["--liquid-x", "--liquid-y"]);
      magneticRef.current = null;
      liquidRef.current = null;
    };
    const syncPointerSupport = () => {
      const supported = finePointer.matches && !reduceMotion;
      setEnabled(supported);
      if (!supported) {
        setPointerActive(false);
        resetTargets();
      }
    };
    const onPointerMove = (event) => {
      if (!finePointer.matches || reduceMotion) return;
      document.documentElement.dataset.customCursor = "true";
      setPointerActive(true);
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);

      const origin = event.target instanceof Element ? event.target : null;
      const nextMode = origin?.closest('[data-liquid="featured"]') ? "project" : "default";
      setMode((current) => current === nextMode ? current : nextMode);
      const interactive = origin?.closest("[data-cursor-label], a, button");
      const nextLabel = interactive?.getAttribute("data-cursor-label") || (interactive ? "OPEN" : "");
      if (nextLabel !== labelRef.current) {
        labelRef.current = nextLabel;
        setLabel(nextLabel);
      }

      const magnetic = origin?.closest("[data-magnetic]");
      if (magneticRef.current !== magnetic) {
        resetElement(magneticRef.current, ["--magnetic-x", "--magnetic-y"]);
        magneticRef.current = magnetic;
      }
      if (magnetic) {
        const bounds = magnetic.getBoundingClientRect();
        const offsetX = clamp((event.clientX - bounds.left - bounds.width / 2) * 0.12, -9, 9);
        const offsetY = clamp((event.clientY - bounds.top - bounds.height / 2) * 0.12, -7, 7);
        magnetic.style.setProperty("--magnetic-x", `${offsetX.toFixed(1)}px`);
        magnetic.style.setProperty("--magnetic-y", `${offsetY.toFixed(1)}px`);
      }

      const liquidContainer = origin?.closest("[data-liquid]");
      const liquid = liquidContainer?.querySelector(".project-preview") ?? liquidContainer;
      if (liquidRef.current !== liquid) {
        resetElement(liquidRef.current, ["--liquid-x", "--liquid-y"]);
        liquidRef.current = liquid;
      }
      if (liquid) {
        const bounds = liquid.getBoundingClientRect();
        liquid.style.setProperty("--liquid-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
        liquid.style.setProperty("--liquid-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
      }
    };
    const stopPointer = (event) => {
      if (event.relatedTarget) return;
      setPointerActive(false);
      setMode("default");
      document.documentElement.dataset.customCursor = "false";
      if (labelRef.current) {
        labelRef.current = "";
        setLabel("");
      }
      resetTargets();
    };
    const onKeyDown = () => {
      setPointerActive(false);
      setMode("default");
      document.documentElement.dataset.customCursor = "false";
      resetTargets();
    };
    const onWindowBlur = () => {
      setPointerActive(false);
      setMode("default");
      document.documentElement.dataset.customCursor = "false";
      resetTargets();
    };

    syncPointerSupport();
    finePointer.addEventListener("change", syncPointerSupport);
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", stopPointer);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("blur", onWindowBlur);

    return () => {
      finePointer.removeEventListener("change", syncPointerSupport);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", stopPointer);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("blur", onWindowBlur);
      resetTargets();
    };
  }, [pointerX, pointerY, reduceMotion]);

  useEffect(() => {
    const root = document.documentElement;
    if (enabled) root.dataset.customCursor = "true";
    else delete root.dataset.customCursor;
    return () => delete root.dataset.customCursor;
  }, [enabled]);

  return (
    <motion.div
      className="custom-cursor"
      aria-hidden="true"
      data-enabled={enabled}
      data-active={pointerActive}
      data-mode={mode}
      style={{ x, y }}
    >
      <span className="custom-cursor-ring" />
      <AnimatePresence mode="wait">
        {label && (
          <motion.span
            className="custom-cursor-label"
            key={label}
            initial={{ opacity: 0, scale: 0.82, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -4 }}
            transition={{ duration: 0.16 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
