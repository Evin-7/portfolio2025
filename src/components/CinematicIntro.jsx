"use client";

import { gsap } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";

const firstName = "EVIN";
const lastName = "LEYANDER";

function LetterRun({ text, className }) {
  return (
    <span className={className} aria-hidden="true">
      {Array.from(text).map((letter, index) => (
        <span className="intro-letter" key={`${letter}-${index}`}>{letter}</span>
      ))}
    </span>
  );
}

function markIntroComplete() {
  document.documentElement.dataset.introComplete = "true";
  window.dispatchEvent(new Event("portfolio:intro-complete"));
}

export default function CinematicIntro() {
  const [visible, setVisible] = useState(true);
  const stageRef = useRef(null);
  const timelineRef = useRef(null);
  const finishRef = useRef(null);

  const finish = useCallback(() => {
    if (!visible) return;
    finishRef.current?.();
  }, [visible]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    let completed = false;
    let heroRevealed = false;
    const revealHero = () => {
      if (heroRevealed) return;
      heroRevealed = true;
      markIntroComplete();
    };
    const complete = () => {
      if (completed) return;
      completed = true;
      revealHero();
      setVisible(false);
      finishRef.current = null;
    };
    finishRef.current = complete;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      complete();
      return undefined;
    }

    const header = document.querySelector(".site-header");
    const context = gsap.context(() => {
      const firstLetters = gsap.utils.toArray(".intro-name-first .intro-letter");
      const lastLetters = gsap.utils.toArray(".intro-name-last .intro-letter");
      const panels = gsap.utils.toArray(".intro-panel");

      gsap.set(stage, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", scaleX: 1 });
      gsap.set(".intro-kicker, .intro-index", { autoAlpha: 0, y: 16 });
      gsap.set(".intro-letter", {
        autoAlpha: 0,
        yPercent: 138,
        scaleX: 0.72,
        rotateX: -54,
        transformOrigin: "50% 100%",
      });
      gsap.set(".intro-ripple", { autoAlpha: 0, scale: 0.28 });
      gsap.set(".intro-streak", { scaleX: 0, autoAlpha: 0.9, transformOrigin: "50% 50%" });
      gsap.set(panels, { xPercent: 0, rotate: 0 });
      if (header) gsap.set(header, { autoAlpha: 0, y: -18 });

      const sequence = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: complete });
      timelineRef.current = sequence;

      sequence
        .to(".intro-streak", { scaleX: 1, duration: 0.25, ease: "expo.out" }, 0.02)
        .to(".intro-streak", { scaleX: 0.16, autoAlpha: 0.38, duration: 0.38, ease: "power3.inOut" }, 0.24)
        .to(".intro-ripple", { autoAlpha: 0.42, scale: 1.5, stagger: 0.08, duration: 0.72, ease: "power3.out" }, 0.1)
        .to(".intro-ripple", { autoAlpha: 0, scale: 2.35, stagger: 0.08, duration: 0.38, ease: "power2.in" }, 0.38)
        .to(".intro-index", { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" }, 0.18)
        .to(".intro-kicker", { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 0.3)
        .to(firstLetters, {
          autoAlpha: 1,
          yPercent: 0,
          scaleX: 1,
          rotateX: 0,
          stagger: { each: 0.042, from: "center" },
          duration: 0.78,
          ease: "elastic.out(1, 0.48)",
        }, 0.38)
        .to(lastLetters, {
          autoAlpha: 1,
          yPercent: 0,
          scaleX: 1,
          rotateX: 0,
          stagger: { each: 0.036, from: "center" },
          duration: 0.78,
          ease: "elastic.out(1, 0.5)",
        }, 0.48)
        .to(".intro-name-first", { xPercent: -4, yPercent: -5, rotate: -2, scale: 1.22, duration: 0.46, ease: "power3.in" }, 1.16)
        .to(".intro-name-last", { xPercent: 4, yPercent: 5, rotate: 2, scale: 1.2, duration: 0.46, ease: "power3.in" }, 1.16)
        .to(".intro-kicker, .intro-index", { autoAlpha: 0, y: -14, duration: 0.2, ease: "power2.in" }, 1.26)
        .add(() => {
          revealHero();
          if (header) {
            gsap.to(header, { autoAlpha: 1, y: 0, duration: 0.62, ease: "power3.out", overwrite: true });
          }
        }, 1.58)
        .to(".intro-panel--left", { xPercent: -112, rotate: -5, duration: 0.66, ease: "power4.inOut" }, 1.53)
        .to(".intro-panel--right", { xPercent: 112, rotate: 5, duration: 0.66, ease: "power4.inOut" }, 1.53)
        .to(stage, { clipPath: "inset(47% 0% 47% 0%)", duration: 0.52, ease: "power4.inOut" }, 1.68)
        .to(".intro-streak", { scaleX: 1.4, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 1.68)
        .to(stage, { scaleX: 0, autoAlpha: 0, duration: 0.34, ease: "power3.inOut" }, 2.1);
    }, stage);

    const skipIntro = () => {
      timelineRef.current?.kill();
      if (prefersReducedMotion) {
        complete();
        return;
      }
      gsap.to(stage, {
        clipPath: "inset(48% 0% 48% 0%)",
        scaleX: 0,
        duration: 0.34,
        ease: "power3.inOut",
        onComplete: complete,
      });
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") skipIntro();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      timelineRef.current?.kill();
      timelineRef.current = null;
      finishRef.current = null;
      context.revert();
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="cinematic-intro" ref={stageRef} role="region" aria-label="Portfolio introduction">
      <div className="intro-panel intro-panel--left" aria-hidden="true" />
      <div className="intro-panel intro-panel--right" aria-hidden="true" />
      <span className="intro-ripple intro-ripple--one" aria-hidden="true" />
      <span className="intro-ripple intro-ripple--two" aria-hidden="true" />
      <span className="intro-streak" aria-hidden="true" />
      <p className="intro-index">Independent software engineer <span>·</span> 2026</p>
      <div className="intro-center">
        <p className="intro-kicker">Thoughtful products. Built to move.</p>
        <h1 className="sr-only">Evin Leyander — Software Engineer</h1>
        <div className="intro-name">
          <LetterRun className="intro-name-first" text={firstName} />
          <LetterRun className="intro-name-last" text={lastName} />
        </div>
        <span className="intro-rule" aria-hidden="true" />
      </div>
      <button className="intro-skip" type="button" tabIndex={0} onClick={finish} aria-label="Skip the introduction">
        Skip intro <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
