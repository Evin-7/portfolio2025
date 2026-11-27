"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const INTRO_SESSION_KEY = "evin-portfolio-liquid-intro-v1";

function announceProgress(progress) {
  window.dispatchEvent(new CustomEvent("portfolio:intro-progress", { detail: { progress } }));
}

function markIntroComplete() {
  document.documentElement.dataset.introComplete = "true";
  announceProgress(1);
  window.dispatchEvent(new Event("portfolio:intro-reveal"));
  window.dispatchEvent(new Event("portfolio:intro-complete"));
}

export default function CinematicIntro() {
  const [visible, setVisible] = useState(true);
  const stageRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    let completed = false;
    let disposed = false;
    let context = null;
    const header = document.querySelector(".site-header");

    const complete = () => {
      if (completed) return;
      completed = true;
      try {
        sessionStorage.setItem(INTRO_SESSION_KEY, "true");
      } catch {
        // The animation should still finish if storage is unavailable.
      }
      markIntroComplete();
      setVisible(false);
    };

    let alreadyPlayed = false;
    try {
      alreadyPlayed = sessionStorage.getItem(INTRO_SESSION_KEY) === "true";
    } catch {
      alreadyPlayed = false;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || alreadyPlayed) {
      complete();
      return undefined;
    }

    context = gsap.context(() => {
      gsap.set(stage, { autoAlpha: 1 });
      gsap.set(".intro-mark-wrap", { autoAlpha: 0, y: 14, scale: 0.88, filter: "blur(9px)" });
      if (header) gsap.set(header, { autoAlpha: 0, y: -18 });

      const introMark = stage.querySelector(".intro-mark-wrap");
      const navbarMark = header?.querySelector(".brand-mark-frame");
      const introRect = introMark?.getBoundingClientRect();
      const navbarRect = navbarMark?.getBoundingClientRect();
      const logoTravel = introRect && navbarRect
        ? {
          x: navbarRect.left + navbarRect.width / 2 - (introRect.left + introRect.width / 2),
          y: navbarRect.top + navbarRect.height / 2 - (introRect.top + introRect.height / 2),
          scale: Math.min(navbarRect.width / introRect.width, navbarRect.height / introRect.height),
        }
        : { x: 0, y: -14, scale: 0.82 };

      const sequence = gsap.timeline({
        defaults: { overwrite: "auto" },
        onUpdate: () => announceProgress(timelineRef.current?.progress() ?? 0),
        onComplete: complete,
      });
      timelineRef.current = sequence;

      sequence
        .to({}, { duration: 0.64 })
        .to({}, { duration: 0.82 })
        .to(".intro-mark-wrap", {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.74,
          ease: "power3.out",
        }, 2.24)
        .fromTo(".intro-logo-sweep", { xPercent: -130, autoAlpha: 0 }, {
          xPercent: 130,
          autoAlpha: 0.88,
          duration: 0.94,
          ease: "power2.inOut",
        }, 2.62)
        .to(".intro-mark-wrap", { scale: 1.035, duration: 0.65, ease: "sine.inOut" }, 3.24)
        .to(".intro-mark-wrap", { scale: 0.97, duration: 0.65, ease: "power2.inOut" }, 3.89)
        .add(() => {
          window.dispatchEvent(new Event("portfolio:intro-reveal"));
          if (header) gsap.to(header, { autoAlpha: 1, y: 0, duration: 0.62, ease: "power3.out", overwrite: true });
        }, 4.22)
        .to(".intro-mark-wrap", { ...logoTravel, autoAlpha: 0, duration: 0.72, ease: "power3.inOut" }, 4.22)
        .to(stage, { autoAlpha: 0, duration: 0.78, ease: "power2.inOut" }, 4.22);
    }, stage);

    return () => {
      disposed = true;
      timelineRef.current?.kill();
      timelineRef.current = null;
      context?.revert();
      if (!completed && disposed) announceProgress(1);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="cinematic-intro" ref={stageRef} aria-hidden="true">
      <div className="intro-mark-wrap">
        <Image
          className="intro-mark"
          src="/el-monogram-intro.png"
          alt=""
          width={783}
          height={509}
          priority
          sizes="(max-width: 620px) 56vw, 44vw"
        />
        <span className="intro-logo-sweep" />
      </div>
    </div>
  );
}
