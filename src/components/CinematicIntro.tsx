"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import LiquidIntroCanvas from "./LiquidIntroCanvas";

const INTRO_SESSION_KEY = "evin-portfolio-membrane-intro-v1";
const INTRO_DURATION = 2.88;

type ProgressUniform = { value: number };

type IntroLifecycle = {
  completed: boolean;
  disposed: boolean;
  started: boolean;
  revealed: boolean;
  complete: ((reveal?: boolean) => void) | null;
  revealHero: (() => void) | null;
};

function announceHeroReveal(header: Element | null): gsap.core.Tween | null {
  document.documentElement.dataset.introComplete = "true";
  window.dispatchEvent(new Event("portfolio:intro-reveal"));
  if (header) {
    return gsap.to(header, {
      autoAlpha: 1,
      y: 0,
      duration: 0.48,
      ease: "power2.out",
      overwrite: true,
    });
  }
  return null;
}

export default function CinematicIntro() {
  const [visible, setVisible] = useState(true);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const markRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const headerTweenRef = useRef<gsap.core.Tween | null>(null);
  const playRef = useRef(false);
  const lifecycleRef = useRef<IntroLifecycle>({
    completed: false,
    disposed: false,
    started: false,
    revealed: false,
    complete: null,
    revealHero: null,
  });

  const startAnimation = useCallback((progressUniform: ProgressUniform) => {
    const lifecycle = lifecycleRef.current;
    if (lifecycle.disposed || lifecycle.completed || lifecycle.started) return;

    const stage = stageRef.current;
    const mark = markRef.current;
    if (!stage || !mark) {
      lifecycle.complete?.(true);
      return;
    }

    lifecycle.started = true;
    gsap.set(mark, { autoAlpha: 0 });

    const sequence = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => lifecycle.complete?.(false),
    });
    timelineRef.current = sequence;

    sequence
      .to(progressUniform, { value: 1, duration: INTRO_DURATION, ease: "none" }, 0)
      .to(mark, { autoAlpha: 1, duration: 0.64, ease: "sine.inOut" }, 1.62)
      .add(() => lifecycle.revealHero?.(), INTRO_DURATION)
      .to(stage, { autoAlpha: 0, duration: 0.4, ease: "power1.out" }, INTRO_DURATION);
  }, []);

  const failAnimation = useCallback(() => {
    lifecycleRef.current.complete?.(true);
  }, []);

  useEffect(() => {
    const lifecycle = lifecycleRef.current;
    const stage = stageRef.current;
    const header = document.querySelector(".site-header");
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let alreadyPlayed = false;

    lifecycle.disposed = false;
    lifecycle.revealHero = () => {
      if (lifecycle.revealed) return;
      lifecycle.revealed = true;
      headerTweenRef.current = announceHeroReveal(header);
    };
    lifecycle.complete = (reveal = true) => {
      if (lifecycle.completed) return;
      lifecycle.completed = true;
      playRef.current = false;
      try {
        sessionStorage.setItem(INTRO_SESSION_KEY, "true");
      } catch {
        // The hero still appears when session storage is unavailable.
      }

      if (reveal && !lifecycle.revealed) lifecycle.revealHero?.();
      document.documentElement.dataset.introComplete = "true";
      window.dispatchEvent(new Event("portfolio:intro-complete"));
      setVisible(false);
    };

    try {
      alreadyPlayed = sessionStorage.getItem(INTRO_SESSION_KEY) === "true";
    } catch {
      alreadyPlayed = false;
    }

    if (motionPreference.matches || alreadyPlayed) {
      lifecycle.complete(true);
      return () => {
        lifecycle.disposed = true;
      };
    }

    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      if (event.matches) lifecycle.complete?.(true);
    };
    motionPreference.addEventListener("change", handleMotionPreference);

    gsap.set(stage, { autoAlpha: 1 });
    if (header) gsap.set(header, { autoAlpha: 0, y: -16 });
    playRef.current = true;

    return () => {
      lifecycle.disposed = true;
      motionPreference.removeEventListener("change", handleMotionPreference);
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      timelineRef.current?.kill();
      timelineRef.current = null;
      headerTweenRef.current?.kill();
      headerTweenRef.current = null;
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="cinematic-intro fixed inset-0 z-[1100] isolate overflow-hidden bg-[#010705] pointer-events-none"
      ref={stageRef}
      aria-hidden="true"
    >
      <div className="intro-backdrop" />
      <LiquidIntroCanvas enabledRef={playRef} onReady={startAnimation} onFailure={failAnimation} />
      <div className="intro-mark-wrap" ref={markRef}>
        <Image
          className="intro-mark"
          src="/el-monogram-intro.png"
          alt=""
          width={783}
          height={509}
          priority
          sizes="28vmin"
        />
      </div>
    </div>
  );
}
