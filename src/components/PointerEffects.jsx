"use client";

import { useEffect } from "react";
import { useReducedMotion } from "motion/react";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function PointerEffects() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let magneticTarget = null;
    let liquidTarget = null;

    const resetElement = (element, properties) => {
      if (!element) return;
      properties.forEach((property) => element.style.removeProperty(property));
    };

    const resetTargets = () => {
      resetElement(magneticTarget, ["--magnetic-x", "--magnetic-y"]);
      resetElement(liquidTarget, ["--liquid-x", "--liquid-y"]);
      magneticTarget = null;
      liquidTarget = null;
    };

    const syncPointerSupport = () => {
      if (!finePointer.matches || reduceMotion) resetTargets();
    };

    const onPointerMove = (event) => {
      if (!finePointer.matches || reduceMotion) return;

      const origin = event.target instanceof Element ? event.target : null;
      const magnetic = origin?.closest("[data-magnetic]");
      if (magneticTarget !== magnetic) {
        resetElement(magneticTarget, ["--magnetic-x", "--magnetic-y"]);
        magneticTarget = magnetic;
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
      if (liquidTarget !== liquid) {
        resetElement(liquidTarget, ["--liquid-x", "--liquid-y"]);
        liquidTarget = liquid;
      }
      if (liquid) {
        const bounds = liquid.getBoundingClientRect();
        liquid.style.setProperty("--liquid-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
        liquid.style.setProperty("--liquid-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
      }
    };

    const clearPointerEffects = (event) => {
      if (event?.relatedTarget) return;
      resetTargets();
    };

    syncPointerSupport();
    finePointer.addEventListener("change", syncPointerSupport);
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", clearPointerEffects);
    window.addEventListener("keydown", clearPointerEffects);
    window.addEventListener("blur", clearPointerEffects);

    return () => {
      finePointer.removeEventListener("change", syncPointerSupport);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", clearPointerEffects);
      window.removeEventListener("keydown", clearPointerEffects);
      window.removeEventListener("blur", clearPointerEffects);
      resetTargets();
    };
  }, [reduceMotion]);

  return null;
}
