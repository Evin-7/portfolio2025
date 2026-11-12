"use client";

import { AnimatePresence, motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";

const criticalImages = ["/midnight-halftone-convergence.png"];

function waitForImage(src, signal) {
  return new Promise((resolve) => {
    const image = new window.Image();
    let timeout;
    let settled = false;
    const finish = (loaded) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      signal.removeEventListener("abort", onAbort);
      image.onload = null;
      image.onerror = null;
      resolve(loaded);
    };
    const onAbort = () => finish(false);

    timeout = window.setTimeout(() => finish(false), 6800);
    signal.addEventListener("abort", onAbort, { once: true });
    if (signal.aborted) return finish(false);
    image.onload = () => finish(true);
    image.onerror = () => finish(false);
    image.src = src;
    if (image.complete) finish(image.naturalWidth > 0);
  });
}

function waitForPageLoad(signal) {
  if (document.readyState === "complete") return Promise.resolve(true);
  return new Promise((resolve) => {
    let settled = false;
    const finish = (loaded) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      window.removeEventListener("load", onLoad);
      signal.removeEventListener("abort", onAbort);
      resolve(loaded);
    };
    const onLoad = () => finish(true);
    const onAbort = () => finish(false);
    const timeout = window.setTimeout(() => finish(false), 6800);
    window.addEventListener("load", onLoad, { once: true });
    signal.addEventListener("abort", onAbort, { once: true });
    if (signal.aborted) finish(false);
  });
}

function waitForFonts(signal) {
  if (!document.fonts?.ready) return Promise.resolve(true);
  return new Promise((resolve) => {
    let settled = false;
    const finish = (loaded) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      signal.removeEventListener("abort", onAbort);
      resolve(loaded);
    };
    const onAbort = () => finish(false);
    const timeout = window.setTimeout(() => finish(false), 6800);
    signal.addEventListener("abort", onAbort, { once: true });
    if (signal.aborted) return finish(false);
    document.fonts.ready.then(() => finish(true), () => finish(false));
  });
}

export default function CinematicIntro() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [blocking, setBlocking] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Preparing your experience");
  const progressSpring = useSpring(0, { stiffness: 95, damping: 24, mass: 0.7 });
  const displayedProgress = useTransform(progressSpring, (value) => Math.round(value));

  useEffect(() => {
    progressSpring.set(progress);
  }, [progress, progressSpring]);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(false);
      return undefined;
    }

    let cancelled = false;
    let readinessCount = 0;
    let failSafeTimer;
    let exitTimer;
    const readinessController = new AbortController();
    const startedAt = performance.now();
    const markReady = () => {
      readinessCount += 1;
      setProgress(Math.min(92, 8 + readinessCount * 28));
      setStatus(readinessCount === 1 ? "Setting the stage" : "Almost there");
    };

    setProgress(8);
    const readiness = [
      waitForFonts(readinessController.signal),
      ...criticalImages.map((src) => waitForImage(src, readinessController.signal)),
      waitForPageLoad(readinessController.signal),
    ].map((task) => task.then((isReady) => {
      if (cancelled) return false;
      if (isReady) markReady();
      return isReady;
    }));

    const finish = (degraded = false) => {
      if (cancelled) return;
      window.clearTimeout(failSafeTimer);
      if (degraded) {
        setStatus("A visual detail is unavailable; showing the rest of the portfolio");
      } else {
        setProgress(100);
        setStatus("Ready to explore");
      }
      const visibleFor = performance.now() - startedAt;
      exitTimer = window.setTimeout(() => setVisible(false), Math.max(0, 1250 - visibleFor) + 320);
    };

    Promise.all(readiness).then((results) => {
      if (cancelled) return;
      finish(!results.every(Boolean));
    });

    failSafeTimer = window.setTimeout(() => {
      if (cancelled) return;
      setStatus("You can start exploring while the last details load");
      exitTimer = window.setTimeout(() => setVisible(false), 850);
    }, 7000);

    return () => {
      cancelled = true;
      readinessController.abort();
      window.clearTimeout(failSafeTimer);
      window.clearTimeout(exitTimer);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!blocking) return undefined;
    const previousOverflow = document.body.style.overflow;
    const app = document.querySelector(".site-shell");
    const wasInert = app?.inert ?? false;
    document.body.style.overflow = "hidden";
    if (app) app.inert = true;
    return () => {
      document.body.style.overflow = previousOverflow;
      if (app) app.inert = wasInert;
    };
  }, [blocking]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        setBlocking(false);
        document.documentElement.dataset.introComplete = "true";
        window.dispatchEvent(new Event("portfolio:intro-complete"));
      }}
    >
      {visible && (
        <motion.div
          className="intro-loader"
          role="status"
          aria-live="polite"
          aria-label={`Loading portfolio, ${progress}%`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion
            ? { opacity: 0, transition: { duration: 0.01 } }
            : {
              opacity: 0,
              clipPath: "inset(0 0 100% 0)",
              transition: { duration: 0.62, ease: [0.76, 0, 0.24, 1] },
            }}
        >
          <div className="intro-loader-content">
            <motion.svg
              className="intro-monogram"
              viewBox="0 0 64 64"
              fill="none"
              aria-hidden="true"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.path
                d="M28 15H12v34h16M12 32h13M38 15v34h15"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduceMotion ? false : { pathLength: 0, opacity: 0.4 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
            </motion.svg>

            <motion.p
              className="intro-loader-kicker"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.45 }}
            >
              Portfolio · 2026
            </motion.p>

            <motion.h1
              className="intro-loader-name"
              initial={reduceMotion ? false : { opacity: 0, y: 26, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.3, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            >
              <span>Evin</span> Leyander
            </motion.h1>

            <div className="intro-loader-progress" aria-hidden="true">
              <motion.span
                className="intro-loader-progress-fill"
                style={{ scaleX: progressSpring }}
              />
              <span className="intro-loader-count"><motion.span>{displayedProgress}</motion.span>%</span>
            </div>
            <span className="intro-loader-status">{status}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
