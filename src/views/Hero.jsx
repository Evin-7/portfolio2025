"use client";

import { useEffect, useState } from "react";
import CircuitBackground from "../components/CircuitBackground";

const containerClass = "mx-auto w-full max-w-[90rem] px-5 sm:px-8 md:px-12 lg:px-20 2xl:max-w-none 2xl:px-[clamp(6rem,7vw,13.75rem)]";

const sequence = [
  { key: "eyebrow", text: "Available for new projects", speed: 28 },
  { key: "headline", text: "Full-stack.\nBuilt to ship.", speed: 24 },
  { key: "role", text: "Currently shipping interfaces", speed: 34 },
  {
    key: "intro",
    text: "Clear interfaces. Reliable systems. Shipped end to end.",
    speed: 20,
  },
];

const completeText = Object.fromEntries(sequence.map(({ key, text }) => [key, text]));
const totalCharacters = sequence.reduce((total, item) => total + item.text.length, 0);

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

export default function Hero() {
  const [typed, setTyped] = useState({ eyebrow: "", headline: "", role: "", intro: "" });
  const [phase, setPhase] = useState(0);

  const downloadResume = () => {
    window.location.assign("/resume");
  };

  const typedCharacters = sequence.reduce((total, item) => total + typed[item.key].length, 0);
  const progress = Math.min(100, Math.round((typedCharacters / totalCharacters) * 100));
  const isLoading = phase < sequence.length;

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

  const introSegments = [
    { text: "Clear interfaces", className: "font-semibold text-copy" },
    { text: ". Reliable systems. Shipped end to end." },
  ];

  return (
    <section className="relative isolate flex min-h-[max(44rem,100svh)] items-center overflow-hidden bg-ink pb-16 pt-[clamp(7.7rem,12vw,10rem)] text-center font-mono">
      <CircuitBackground />
      <div className="absolute -right-40 -top-72 -z-10 size-[min(48rem,70vw)] rounded-full bg-[radial-gradient(ellipse,rgba(212,175,55,0.13),transparent_68%)] blur-xl" aria-hidden="true" />
      <div className="absolute -bottom-88 -left-68 -z-10 size-[min(48rem,70vw)] rounded-full bg-[radial-gradient(ellipse,rgba(125,211,252,0.08),transparent_68%)] blur-xl" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-52 bg-gradient-to-b from-transparent to-ink" aria-hidden="true" />

      <div className={`${containerClass} relative z-10 flex justify-center`}>
        <div className="w-full max-w-[52rem]">
          <p className="m-0 min-h-5 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-amber">
            <span className="size-[0.45rem] animate-[status-pulse_2s_ease-in-out_infinite] rounded-full bg-amber shadow-[0_0_0.65rem_0.12rem_rgba(212,175,55,0.7)]" aria-hidden="true" />
            <span>{typed.eyebrow}</span>
            {phase === 0 ? <span className="animate-[cursor-blink_1s_step-end_infinite] text-cyan" aria-hidden="true">_</span> : null}
          </p>

          <h1 className="relative mx-auto mt-5 min-h-[2.1em] max-w-[24ch] text-[clamp(1.7rem,5vw,4.65rem)] font-bold leading-[1.04] tracking-[-0.07em] text-copy">
            <span className="invisible block whitespace-pre-line" aria-hidden="true">{completeText.headline}</span>
            <span className="absolute inset-x-0 top-0 whitespace-pre-line">
              <TypedSegments value={typed.headline} segments={headlineSegments} />
              {phase === 1 ? <span className="animate-[cursor-blink_1s_step-end_infinite] text-cyan" aria-hidden="true">_</span> : null}
            </span>
          </h1>

          <p className="m-0 mt-6 inline-flex min-h-6 items-baseline justify-center gap-2 text-[clamp(0.86rem,1.4vw,1.05rem)] leading-normal text-muted">
            <span>{typed.role}</span>
            <span className="animate-[cursor-blink_1s_step-end_infinite] text-cyan" aria-hidden="true">_</span>
          </p>

          <p className="mx-auto mt-6 min-h-[5rem] max-w-[39rem] text-base leading-7 text-muted sm:min-h-[4rem]">
            <TypedSegments value={typed.intro} segments={introSegments} />
          </p>

          <div className={`mx-auto mt-2 w-[min(18rem,72vw)] transition duration-500 ${isLoading ? "opacity-100" : "pointer-events-none opacity-0"}`} role="progressbar" aria-label="Loading hero content" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
            <div className="mb-2 flex items-center justify-between text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-amber">
              <span>Loading</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-line/80">
              <div className="h-full rounded-full bg-amber shadow-[0_0_0.8rem_rgba(212,175,55,0.55)] transition-[width] duration-100" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className={`mt-8 flex flex-wrap justify-center gap-3 transition duration-500 ${phase >= 4 ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}>
            <a href="#works" className="inline-flex min-h-12 items-center gap-2 rounded-md bg-amber px-5 py-3 text-[0.76rem] font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-amber-light focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-cyan">
              View selected work <span aria-hidden="true">→</span>
            </a>
            <a href="#contact" className="inline-flex min-h-12 items-center rounded-md border border-line px-5 py-3 text-[0.76rem] font-semibold text-copy transition hover:-translate-y-0.5 hover:border-cyan hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-cyan">
              Start a project
            </a>
          </div>

          <div className={`mt-9 flex flex-wrap justify-center gap-x-8 gap-y-4 transition duration-500 ${phase >= 4 ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}>
            <div className="grid gap-1">
              <strong className="text-[0.73rem] font-semibold text-copy">4+ yrs</strong>
              <span className="text-[0.62rem] text-muted">production apps</span>
            </div>
            <div className="grid gap-1">
              <strong className="text-[0.73rem] font-semibold text-copy">20+</strong>
              <span className="text-[0.62rem] text-muted">projects shipped</span>
            </div>
            <div className="grid gap-1 max-[420px]:hidden">
              <strong className="text-[0.73rem] font-semibold text-copy">Remote</strong>
              <span className="text-[0.62rem] text-muted">worldwide</span>
            </div>
            <button type="button" onClick={downloadResume} className="inline-flex min-h-10 cursor-pointer items-center self-center rounded-md border border-amber/60 bg-amber/10 px-4 py-2 text-[0.68rem] font-semibold text-amber transition hover:-translate-y-0.5 hover:bg-amber hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-cyan">
              Resume
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
