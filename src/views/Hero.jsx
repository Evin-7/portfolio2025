"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

const containerClass = "mx-auto w-full max-w-[90rem] px-5 sm:px-8 md:px-12 lg:px-20 2xl:max-w-none 2xl:px-[clamp(6rem,7vw,13.75rem)]";

const sequence = [
  { key: "eyebrow", text: "Available for new projects", speed: 28 },
  { key: "headline", text: "Full-stack.\nBuilt to ship.", speed: 24 },
  { key: "role", text: "Currently shipping interfaces", speed: 34 },
];

const completeText = Object.fromEntries(sequence.map(({ key, text }) => [key, text]));

function TypedSegments({ value, segments }) {
  let offset = 0;

  return segments.map(({ text, className = "" }, index) => {
    const visible = value.slice(offset, offset + text.length);
    offset += text.length;

    if (!visible) return null;

    return (
      <span className={className} key={`${text}-${index}`}>
        {visible}
      </span>
    );
  });
}

function usePieceMotion(assembly, reduceMotion, start, duration, from, to = {}) {
  const progress = useTransform(assembly, [start, Math.min(start + duration, 1)], [0, 1]);
  const initial = reduceMotion ? {} : from;

  return {
    x: useTransform(progress, [0, 1], [initial.x ?? to.x ?? 0, to.x ?? 0]),
    y: useTransform(progress, [0, 1], [initial.y ?? to.y ?? 0, to.y ?? 0]),
    rotate: useTransform(progress, [0, 1], [initial.rotate ?? to.rotate ?? 0, to.rotate ?? 0]),
    scale: useTransform(progress, [0, 1], [initial.scale ?? to.scale ?? 1, to.scale ?? 1]),
    opacity: useTransform(progress, [0, 1], [initial.opacity ?? to.opacity ?? 1, to.opacity ?? 1]),
  };
}

function SourceGlassVisual({ assembly, reduceMotion }) {
  const main = usePieceMotion(assembly, reduceMotion, 0, 0.14, { y: 18, scale: 0.94, opacity: 0.88 }, { opacity: 1 });
  const back = usePieceMotion(assembly, reduceMotion, 0.06, 0.24, { x: 45, y: -29, scale: 0.84, opacity: 0.24 }, { opacity: 0.58 });
  const top = usePieceMotion(assembly, reduceMotion, 0.1, 0.2, { x: 38, y: -37, scale: 0.82, opacity: 0.38 }, { opacity: 1 });
  const left = usePieceMotion(assembly, reduceMotion, 0.14, 0.24, { x: -53, y: 29, scale: 0.82, opacity: 0.3 }, { opacity: 0.8 });
  const side = usePieceMotion(assembly, reduceMotion, 0.2, 0.24, { x: -40, y: 29, scale: 0.84, opacity: 0.38 }, { opacity: 1 });
  const right = usePieceMotion(assembly, reduceMotion, 0.25, 0.24, { x: 51, y: 26, scale: 0.8, opacity: 0.3 }, { opacity: 0.72 });
  const chip = usePieceMotion(assembly, reduceMotion, 0.28, 0.2, { x: -32, y: -29, scale: 0.78, opacity: 0.34 }, { opacity: 1 });
  const bottom = usePieceMotion(assembly, reduceMotion, 0.32, 0.2, { x: 38, y: 32, scale: 0.82, opacity: 0.34 }, { opacity: 1 });
  const shard = usePieceMotion(assembly, reduceMotion, 0.35, 0.28, { x: 32, y: -22, scale: 0.8, opacity: 0.3 }, { opacity: 1 });
  const crosshair = usePieceMotion(assembly, reduceMotion, 0.25, 0.3, { x: -16, y: 19, opacity: 0.3 }, { opacity: 1 });
  const fractureOpacity = useTransform(assembly, [0.04, 0.56], [0.46, 1]);

  return (
    <div className="relative mx-auto w-full max-w-[31rem] animate-[hero-reveal_0.9s_ease-out_both] lg:mx-0" aria-hidden="true">
      <div className="hero-solid-visual">
        <div className="hero-solid-aura" />
        <div className="hero-solid-beam hero-solid-beam-one" />
        <div className="hero-solid-beam hero-solid-beam-two" />

        <div className="hero-solid-system">
          <motion.svg className="hero-solid-fracture-map" viewBox="0 0 600 620" fill="none" preserveAspectRatio="none" style={{ opacity: fractureOpacity }}>
            <path d="M31 48L230 205L184 389L468 574" />
            <path d="M230 205L526 62" />
            <path d="M230 205L449 302L578 456" />
            <path d="M184 389L18 495" />
            <path d="M184 389L349 498L543 608" />
            <path d="M449 302L493 175" />
            <path d="M349 498L394 616" />
            <circle cx="230" cy="205" r="5" />
            <circle cx="184" cy="389" r="4" />
          </motion.svg>

          <motion.div className="hero-solid-glass-plane hero-solid-glass-plane-back" style={back} />
          <motion.div className="hero-solid-glass-plane hero-solid-glass-plane-left" style={left} />
          <motion.div className="hero-solid-glass-plane hero-solid-glass-plane-right" style={right} />

          <motion.div className="hero-solid-shard-ui hero-solid-shard-ui-main" style={main}>
            <div className="hero-solid-panel-topline"><span className="hero-solid-panel-live"><i /> Live</span></div>
            <div className="hero-solid-panel-main">
              <p>Clear.</p>
              <h2>Ship it.</h2>
              <div className="hero-solid-panel-rule" />
              <div className="hero-solid-panel-stats">
                <div><span>Design</span><strong>Clear</strong></div>
                <div><span>Code</span><strong>Solid</strong></div>
              </div>
            </div>
          </motion.div>

          <motion.div className="hero-solid-shard-ui hero-solid-shard-ui-top" style={top}>
            <strong>Make it clear.</strong>
            <span className="hero-solid-shard-detail">Built to last.</span>
          </motion.div>

          <motion.div className="hero-solid-shard-ui hero-solid-shard-ui-side" style={side}>
            <span className="hero-solid-shard-label">Signal</span>
            <div className="hero-solid-signal-bars"><i /><i /><i /><i /></div>
            <strong>Clarity</strong>
          </motion.div>

          <motion.div className="hero-solid-shard-ui hero-solid-shard-ui-bottom" style={bottom}>
            <span>From idea</span>
            <strong>To shipped.</strong>
          </motion.div>

          <motion.div className="hero-solid-glass-shard hero-solid-shard-top" style={shard} />
          <motion.div className="hero-solid-glass-shard hero-solid-shard-bottom" style={shard} />
          <motion.div className="hero-solid-visual-crosshair hero-solid-crosshair-bottom" style={crosshair} />
        </div>
      </div>

    </div>
  );
}

const ambientShards = [
  { left: "3.5%", top: "9%", width: "3.2rem", height: "1.5rem", clipPath: "polygon(13% 0, 100% 17%, 81% 100%, 0 76%)", travelX: "63vw", travelY: "30svh", start: 0, rotate: -21 },
  { left: "30%", top: "17%", width: "1.25rem", height: "3.5rem", clipPath: "polygon(0 12%, 82% 0, 100% 86%, 20% 100%)", travelX: "38vw", travelY: "21svh", start: 0.04, rotate: 18 },
  { left: "4%", top: "56%", width: "2rem", height: "2.8rem", clipPath: "polygon(4% 0, 100% 22%, 78% 100%, 0 76%)", travelX: "61vw", travelY: "-14svh", start: 0.08, rotate: 28 },
  { left: "auto", right: "7%", top: "auto", bottom: "12%", width: "3.1rem", height: "1.25rem", clipPath: "polygon(13% 0, 100% 17%, 81% 100%, 0 76%)", travelX: "-24vw", travelY: "-28svh", start: 0.12, rotate: -14 },
  { left: "44%", top: "78%", width: "1.45rem", height: "3rem", clipPath: "polygon(0 12%, 82% 0, 100% 86%, 20% 100%)", travelX: "25vw", travelY: "-26svh", start: 0.02, rotate: 32 },
  { left: "auto", right: "5%", top: "16%", width: "1.5rem", height: "2.2rem", clipPath: "polygon(13% 0, 100% 17%, 81% 100%, 0 76%)", travelX: "-18vw", travelY: "22svh", start: 0.1, rotate: -31 },
  { left: "auto", right: "3%", top: "48%", width: "2.7rem", height: "1.2rem", clipPath: "polygon(13% 0, 100% 17%, 81% 100%, 0 76%)", travelX: "-23vw", travelY: "0svh", start: 0.06, rotate: 16 },
  { left: "59%", top: "7%", width: "2.2rem", height: "1.1rem", clipPath: "polygon(13% 0, 100% 17%, 81% 100%, 0 76%)", travelX: "11vw", travelY: "32svh", start: 0.14, rotate: 25 },
  { left: "8%", top: "72%", width: "1.1rem", height: "1.1rem", clipPath: "polygon(13% 0, 100% 17%, 81% 100%, 0 76%)", travelX: "60vw", travelY: "-24svh", start: 0.1, rotate: -18 },
];

function AmbientGlassFragments({ assembly, reduceMotion }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] hidden lg:block" aria-hidden="true">
      {ambientShards.map((shard) => <AmbientGlassShard key={`${shard.left}-${shard.top}`} shard={shard} assembly={assembly} reduceMotion={reduceMotion} />)}
    </div>
  );
}

function AmbientGlassShard({ shard, assembly, reduceMotion }) {
  const end = Math.min(shard.start + 0.58, 1);
  const x = useTransform(assembly, [shard.start, end], ["0px", reduceMotion ? "0px" : shard.travelX]);
  const y = useTransform(assembly, [shard.start, end], ["0px", reduceMotion ? "0px" : shard.travelY]);
  const scale = useTransform(assembly, [shard.start, end], [1, reduceMotion ? 1 : 0.78]);
  const opacity = useTransform(assembly, [shard.start, end], reduceMotion ? [0, 0] : [0.9, 0.66]);

  return (
    <motion.div
      className="absolute"
      style={{ left: shard.left, right: shard.right, top: shard.top, bottom: shard.bottom, width: shard.width, height: shard.height, x, y, scale, rotate: shard.rotate, opacity }}
    >
      <div className="hero-source-scatter-piece" style={{ clipPath: shard.clipPath }} />
    </motion.div>
  );
}

export default function Hero() {
  const [typed, setTyped] = useState({ eyebrow: "", headline: "", role: "" });
  const [phase, setPhase] = useState(0);
  const sceneRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress: sceneScrollProgress } = useScroll({ target: sceneRef, offset: ["start start", "end start"] });
  const smoothSceneProgress = useSpring(sceneScrollProgress, { stiffness: 180, damping: 36, mass: 0.45 });
  // Finish the assembly before the pinned hero releases, leaving a short hold
  // so the next section only arrives after the pieces are fully combined.
  const assembly = useTransform(smoothSceneProgress, [0, 0.58, 0.68, 1], reduceMotion ? [1, 1, 1, 1] : [0, 1, 1, 1]);

  const downloadResume = () => {
    window.location.assign("/resume");
  };

  const isReady = phase >= sequence.length;

  useEffect(() => {
    let active = true;
    let intervalId = null;
    let timeoutId = null;

    const showEverything = () => {
      setTyped(completeText);
      setPhase(sequence.length);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showEverything();
      return () => undefined;
    }

    const typeNext = (index) => {
      if (!active) return;

      if (index >= sequence.length) {
        setPhase(sequence.length);
        return;
      }

      const item = sequence[index];
      let characterIndex = 0;
      setPhase(index);

      intervalId = window.setInterval(() => {
        if (!active) return;

        characterIndex += 1;
        setTyped((current) => ({
          ...current,
          [item.key]: item.text.slice(0, characterIndex),
        }));

        if (characterIndex >= item.text.length) {
          window.clearInterval(intervalId);
          timeoutId = window.setTimeout(() => typeNext(index + 1), 150);
        }
      }, item.speed);
    };

    typeNext(0);

    return () => {
      active = false;
      if (intervalId) window.clearInterval(intervalId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  const headlineSegments = [
    { text: "Full-stack.\n", className: "text-amber" },
    { text: "Built to ship.", className: "text-copy" },
  ];

  return (
    <section ref={sceneRef} className="relative isolate min-h-[145svh] overflow-x-clip bg-ink/90 font-mono text-left lg:h-[170svh]">
      <div className="relative sticky top-0 flex min-h-[100svh] items-center overflow-hidden pb-12 pt-[clamp(7.4rem,11vw,10rem)]">
        <div className="pointer-events-none absolute -right-24 top-[13%] -z-10 size-[min(42rem,66vw)] rounded-full bg-[radial-gradient(ellipse,rgba(212,175,55,0.15),transparent_68%)] blur-2xl" aria-hidden="true" />
        <div className="pointer-events-none absolute right-[5%] top-[10%] -z-10 hidden select-none font-mono text-[clamp(18rem,38vw,38rem)] font-black leading-none tracking-[-0.18em] text-white/[0.025] lg:block" aria-hidden="true">EL</div>
        <AmbientGlassFragments assembly={assembly} reduceMotion={reduceMotion} />

        <div className={`${containerClass} relative z-10`}>
        <div className="mb-8 flex items-center gap-4 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted sm:mb-10">
          <div className="flex items-center gap-2 text-amber">
            <span className="size-1.5 animate-[status-pulse_2s_ease-in-out_infinite] rounded-full bg-amber shadow-[0_0_0.65rem_0.12rem_rgba(212,175,55,0.7)]" aria-hidden="true" />
            <span>{typed.eyebrow}</span>
            {phase === 0 ? <span className="animate-[cursor-blink_1s_step-end_infinite] text-cyan" aria-hidden="true">_</span> : null}
          </div>
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.78fr)] lg:gap-[clamp(4rem,9vw,10rem)]">
          <div className="lg:-translate-y-8 2xl:-translate-y-12">
            <p className="mb-5 flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
              <span className="h-px w-8 bg-amber" aria-hidden="true" />
              Software engineer / product builder
            </p>

            <h1 className="relative min-h-[2.08em] max-w-[24ch] text-[clamp(1.7rem,5vw,4.65rem)] font-bold leading-[1.04] tracking-[-0.07em] text-copy">
              <span className="invisible block whitespace-pre-line" aria-hidden="true">{completeText.headline}</span>
              <span className="absolute inset-x-0 top-0 whitespace-pre-line">
                <TypedSegments value={typed.headline} segments={headlineSegments} />
                {phase === 1 ? <span className="animate-[cursor-blink_1s_step-end_infinite] text-cyan" aria-hidden="true">_</span> : null}
              </span>
            </h1>

            <p className="mt-7 min-h-6 text-[clamp(0.84rem,1.35vw,1rem)] leading-normal text-muted">
              {typed.role}
              {phase === 2 ? <span className="animate-[cursor-blink_1s_step-end_infinite] text-cyan" aria-hidden="true">_</span> : null}
            </p>

            <div className={`mt-8 flex flex-wrap gap-3 transition duration-500 ${isReady ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}>
              <a href="#works" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-amber px-6 py-3 text-[0.72rem] font-bold text-ink shadow-[0_0_2rem_rgba(212,175,55,0.16)] transition hover:-translate-y-1 hover:bg-amber-light focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-cyan">
                View selected work <span aria-hidden="true">↗</span>
              </a>
              <a href="#contact" className="inline-flex min-h-12 items-center rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-[0.72rem] font-bold text-copy backdrop-blur-sm transition hover:-translate-y-1 hover:border-cyan hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-cyan">
                Start a project
              </a>
            </div>

            <div className={`mt-11 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-5 transition duration-500 ${isReady ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}>
              <div className="grid gap-1">
                <strong className="font-mono text-xl font-semibold tracking-[-0.06em] text-copy">4+</strong>
                <span className="text-[0.6rem] uppercase tracking-[0.1em] text-muted">years shipping</span>
              </div>
              <div className="grid gap-1">
                <strong className="font-mono text-xl font-semibold tracking-[-0.06em] text-copy">20+</strong>
                <span className="text-[0.6rem] uppercase tracking-[0.1em] text-muted">products built</span>
              </div>
              <div className="grid gap-1">
                <strong className="font-mono text-xl font-semibold tracking-[-0.06em] text-copy">∞</strong>
                <span className="text-[0.6rem] uppercase tracking-[0.1em] text-muted">curiosity</span>
              </div>
              <button type="button" onClick={downloadResume} className="inline-flex min-h-10 cursor-pointer items-center rounded-full border border-amber/50 bg-amber/10 px-4 py-2 text-[0.66rem] font-bold text-amber transition hover:-translate-y-0.5 hover:bg-amber hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-cyan">
                Download résumé
              </button>
            </div>
          </div>

          <div className="lg:-translate-y-8 2xl:-translate-y-12">
            <SourceGlassVisual assembly={assembly} reduceMotion={reduceMotion} />
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
