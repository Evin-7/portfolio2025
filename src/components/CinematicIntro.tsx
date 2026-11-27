"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import LiquidIntroSvg, { INTRO_ART_DURATION } from "./LiquidIntroSvg";

const INTRO_SESSION_KEY = "evin-portfolio-emerald-intro-v2";
const INTRO_DURATION = INTRO_ART_DURATION;

type ProgressUniform = { value: number; render: () => void };

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
      .to(progressUniform, { value: 1, duration: INTRO_DURATION, ease: "none", onUpdate: progressUniform.render }, 0)
      .to(mark, { autoAlpha: 1, duration: 0.52, ease: "sine.inOut" }, 1.43)
      .add(() => lifecycle.revealHero?.(), INTRO_DURATION)
      .to(stage, { autoAlpha: 0, duration: 0.35, ease: "power1.out" }, INTRO_DURATION);
  }, []);

  const failAnimation = useCallback(() => {
    const lifecycle = lifecycleRef.current;
    const stage = stageRef.current;
    const mark = markRef.current;
    if (lifecycle.disposed || lifecycle.completed) return;
    if (!stage || !mark) {
      lifecycle.complete?.(true);
      return;
    }

    lifecycle.started = true;
    gsap.set(stage, { autoAlpha: 1 });
    gsap.set(mark, { autoAlpha: 1 });
    timelineRef.current = gsap.timeline({ onComplete: () => lifecycle.complete?.(true) })
      .to(stage, { autoAlpha: 0, delay: 0.55, duration: 0.35, ease: "power1.out" });
  }, []);

  useEffect(() => {
    const lifecycle = lifecycleRef.current;
    const stage = stageRef.current;
    const header = document.querySelector(".site-header");
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;
    let scrollLocked = false;
    const restorePageScroll = () => {
      if (!scrollLocked) return;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      scrollLocked = false;
    };
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
      restorePageScroll();
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

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    scrollLocked = true;

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
      restorePageScroll();
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
      <LiquidIntroSvg enabledRef={playRef} onReady={startAnimation} onFailure={failAnimation} />
      <div className="intro-mark-wrap" ref={markRef}>
        <Image
          className="intro-mark"
          src="/el-monogram-intro.png"
          alt=""
          width={783}
          height={509}
          priority
          sizes="24vmin"
        />
      </div>
    </div>
  );
}
