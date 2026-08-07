<template>
  <section
    ref="hero"
    class="hero"
    @pointermove="handlePointerMove"
    @pointerleave="resetPointer"
  >
    <div class="hero-grid" aria-hidden="true"></div>
    <div class="hero-grain" aria-hidden="true"></div>
    <div class="hero-halo halo-left" aria-hidden="true"></div>
    <div class="hero-halo halo-right" aria-hidden="true"></div>

    <div class="hero-shell site-container">
      <div class="hero-copy">
        <p class="hero-eyebrow"><span></span>Independent software engineer</p>
        <h1>
          <span class="hero-title-line">Products that stay</span>
          <em class="hero-title-line">sharp under pressure.</em>
        </h1>
        <p class="hero-intro">
          I turn complex product ideas into thoughtful web experiences and
          dependable software systems.
        </p>

        <div class="hero-actions">
          <a class="hero-button hero-button-primary interactive" href="#works">
            View selected work <span aria-hidden="true">↗</span>
          </a>
          <a class="hero-button hero-button-secondary interactive" href="#contact">
            Start a project
          </a>
        </div>

        <div class="hero-meta" aria-label="Professional focus">
          <div>
            <strong>01</strong>
            <span>Web platforms</span>
          </div>
          <div>
            <strong>02</strong>
            <span>Product systems</span>
          </div>
          <div>
            <strong>03</strong>
            <span>Focused delivery</span>
          </div>
        </div>
      </div>

      <div class="hero-visual-scroll">
        <div class="hero-visual" aria-hidden="true">
          <div class="visual-aura"></div>
          <div class="visual-system">
          <svg
            class="fracture-map"
            viewBox="0 0 600 620"
            fill="none"
            preserveAspectRatio="none"
          >
            <path d="M31 48L230 205L184 389L468 574" />
            <path d="M230 205L526 62" />
            <path d="M230 205L449 302L578 456" />
            <path d="M184 389L18 495" />
            <path d="M184 389L349 498L543 608" />
            <path d="M449 302L493 175" />
            <path d="M349 498L394 616" />
            <circle cx="230" cy="205" r="5" />
            <circle cx="184" cy="389" r="4" />
          </svg>

          <div class="glass-plane glass-plane-back"></div>
          <div class="glass-plane glass-plane-left"></div>
          <div class="glass-plane glass-plane-right"></div>

          <div class="shard-ui shard-ui-main">
            <div class="panel-topline">
              <span>01 / Selected build</span>
              <span class="panel-live"><i></i> Live systems</span>
            </div>
            <div class="panel-main">
              <p>Build clarity.</p>
              <h2>Thoughtful interfaces for ambitious ideas.</h2>
              <div class="panel-rule"></div>
              <div class="panel-stats">
                <div><span>Design</span><strong>Intent</strong></div>
                <div><span>Code</span><strong>Structure</strong></div>
              </div>
            </div>
          </div>

          <div class="shard-ui shard-ui-top">
            <span class="shard-label">System / 07</span>
            <strong>Break the ordinary.</strong>
            <span class="shard-detail">Sharp ideas, structured well.</span>
          </div>

          <div class="shard-ui shard-ui-side">
            <span class="shard-label">Signal</span>
            <div class="signal-bars"><i></i><i></i><i></i><i></i></div>
            <strong>Clarity</strong>
          </div>

          <div class="shard-ui shard-ui-bottom">
            <span>From concept</span>
            <strong>to impact.</strong>
          </div>

            <div class="glass-chip chip-index">2026</div>
            <div class="glass-shard shard-top"></div>
            <div class="glass-shard shard-bottom"></div>
            <div class="visual-crosshair crosshair-top"></div>
            <div class="visual-crosshair crosshair-bottom"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="hero-scroll-index" aria-hidden="true">
      <span>01</span>
      <i></i>
      <span>04</span>
    </div>

    <a class="scroll-prompt interactive" href="#about">
      <span class="scroll-line"></span>
      <span>Scroll to explore</span>
    </a>
  </section>
</template>

<script setup>
import { ref } from "vue";

const hero = ref(null);

const handlePointerMove = (event) => {
  if (
    !hero.value ||
    !window.matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)"
    ).matches
  ) {
    return;
  }

  const rect = hero.value.getBoundingClientRect();
  const pointerX = (event.clientX - rect.left) / rect.width - 0.5;
  const pointerY = (event.clientY - rect.top) / rect.height - 0.5;

  hero.value.style.setProperty("--visual-x", `${pointerX * 12}px`);
  hero.value.style.setProperty("--visual-y", `${pointerY * 10}px`);
  hero.value.style.setProperty("--visual-rotate-x", `${pointerY * -4}deg`);
  hero.value.style.setProperty("--visual-rotate-y", `${pointerX * 5}deg`);
};

const resetPointer = () => {
  if (!hero.value) return;

  hero.value.style.setProperty("--visual-x", "0px");
  hero.value.style.setProperty("--visual-y", "0px");
  hero.value.style.setProperty("--visual-rotate-x", "0deg");
  hero.value.style.setProperty("--visual-rotate-y", "0deg");
};
</script>

<style scoped>
.hero {
  --visual-x: 0px;
  --visual-y: 0px;
  --visual-rotate-x: 0deg;
  --visual-rotate-y: 0deg;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: max(44rem, 100svh);
  padding: clamp(8.2rem, 12vw, 10.5rem) 0 4rem;
  background:
    radial-gradient(circle at 75% 49%, rgba(226, 193, 106, 0.12), transparent 19rem),
    radial-gradient(circle at 4% 98%, rgba(124, 87, 21, 0.22), transparent 26rem),
    linear-gradient(122deg, #060706 0%, #0a0b0a 46%, #11110f 100%);
}

.hero::before,
.hero::after {
  position: absolute;
  z-index: -1;
  content: "";
  pointer-events: none;
}

.hero::before {
  inset: 0;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: min(25vw, 24rem) 100%;
  opacity: 0.35;
  mask-image: linear-gradient(90deg, black, transparent 84%);
}

.hero::after {
  right: 0;
  bottom: 0;
  left: 0;
  height: 11rem;
  background: linear-gradient(transparent, var(--bg-primary));
}

.hero-shell {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(26rem, 0.98fr);
  gap: clamp(2.5rem, 7vw, 7.5rem);
  align-items: center;
}

.hero-copy {
  position: relative;
  z-index: 2;
  max-width: 43rem;
}

.hero-visual-scroll {
  position: relative;
  min-width: 0;
  transform-origin: 68% 50%;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.72rem;
  color: var(--gold-light);
  font-size: 0.69rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  animation: soft-rise 700ms cubic-bezier(0.2, 0.75, 0.2, 1) 90ms both;
}

.hero-eyebrow span {
  width: 2.7rem;
  height: 1px;
  background: currentColor;
}

.hero h1 {
  max-width: 9.6ch;
  margin-top: 1.25rem;
  color: #f6f5f1;
  font-size: clamp(3.25rem, 6.05vw, 6.15rem);
  font-weight: 600;
  letter-spacing: -0.078em;
  line-height: 0.91;
}

.hero-title-line {
  display: block;
  animation: title-reveal 850ms cubic-bezier(0.2, 0.75, 0.2, 1) both;
}

.hero-title-line:first-child {
  animation-delay: 150ms;
}

.hero h1 em {
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 400;
  letter-spacing: -0.085em;
  color: var(--gold-light);
  animation-delay: 260ms;
}

.hero-intro {
  max-width: 31rem;
  margin-top: 1.65rem;
  color: #b9b7af;
  font-size: clamp(0.95rem, 1.1vw, 1.06rem);
  line-height: 1.75;
  animation: soft-rise 720ms cubic-bezier(0.2, 0.75, 0.2, 1) 380ms both;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2.05rem;
  animation: soft-rise 720ms cubic-bezier(0.2, 0.75, 0.2, 1) 460ms both;
}

.hero-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  min-height: 3.25rem;
  padding: 0.75rem 1.2rem;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-decoration: none;
  transition: transform 220ms ease, background-color 220ms ease, border-color 220ms ease,
    box-shadow 220ms ease;
}

.hero-button:hover,
.hero-button:focus-visible {
  transform: translateY(-2px);
}

.hero-button:focus-visible,
.scroll-prompt:focus-visible {
  outline: 2px solid var(--gold-light);
  outline-offset: 4px;
}

.hero-button-primary {
  background: linear-gradient(120deg, #e5cd82, #c39d42);
  color: #171308;
  box-shadow: 0 0.8rem 2.4rem rgba(192, 156, 66, 0.18);
}

.hero-button-primary:hover,
.hero-button-primary:focus-visible {
  box-shadow: 0 1.2rem 2.7rem rgba(192, 156, 66, 0.3);
}

.hero-button-primary span {
  transition: transform 220ms ease;
}

.hero-button-primary:hover span,
.hero-button-primary:focus-visible span {
  transform: translate(2px, -2px);
}

.hero-button-secondary {
  border-color: rgba(232, 218, 178, 0.24);
  background: rgba(255, 255, 255, 0.025);
  color: #e5e0d6;
}

.hero-button-secondary:hover,
.hero-button-secondary:focus-visible {
  border-color: rgba(232, 218, 178, 0.54);
  background: rgba(255, 255, 255, 0.075);
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.1rem 1.8rem;
  margin-top: clamp(2.9rem, 5vw, 4.75rem);
  animation: soft-rise 720ms cubic-bezier(0.2, 0.75, 0.2, 1) 560ms both;
}

.hero-meta div {
  display: grid;
  gap: 0.27rem;
}

.hero-meta strong {
  color: rgba(229, 205, 130, 0.88);
  font-size: 0.63rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.hero-meta span {
  color: #88877f;
  font-size: 0.72rem;
}

.hero-visual {
  position: relative;
  min-height: clamp(30rem, 48vw, 39rem);
  animation: visual-enter 1000ms cubic-bezier(0.2, 0.75, 0.2, 1) 120ms both;
  perspective: 1400px;
}

.hero-visual::after {
  position: absolute;
  z-index: 0;
  inset: 6% 3% 4%;
  content: "";
  border: 1px solid rgba(233, 210, 142, 0.12);
  clip-path: polygon(18% 0, 100% 12%, 82% 100%, 0 77%);
  opacity: 0.72;
  transform: rotate(-5deg);
  animation: visual-trace 11s ease-in-out infinite;
  pointer-events: none;
}

.visual-aura {
  position: absolute;
  inset: 8% -16% 0 -12%;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(220, 184, 89, 0.14), transparent 65%);
  filter: blur(4px);
  opacity: 0.8;
  animation: aura-breathe 7s ease-in-out infinite;
}

.visual-system {
  position: absolute;
  z-index: 1;
  inset: 0;
  transform: translate3d(var(--visual-x), var(--visual-y), 0)
    rotateX(var(--visual-rotate-x)) rotateY(var(--visual-rotate-y));
  transform-style: preserve-3d;
  transition: transform 280ms cubic-bezier(0.2, 0.75, 0.2, 1);
}

.fracture-map {
  position: absolute;
  z-index: 4;
  inset: 2.5% 0 0;
  width: 100%;
  height: 96%;
  overflow: visible;
  pointer-events: none;
  animation: fracture-pulse 6s ease-in-out infinite;
}

.fracture-map path {
  stroke: rgba(246, 234, 198, 0.62);
  stroke-width: 1.15;
  vector-effect: non-scaling-stroke;
  filter: drop-shadow(0 0 4px rgba(234, 211, 144, 0.3));
}

.fracture-map circle {
  fill: #ead390;
  filter: drop-shadow(0 0 7px rgba(234, 211, 144, 0.9));
}

.glass-plane,
.glass-shard,
.shard-ui,
.glass-chip {
  position: absolute;
  overflow: hidden;
  border: 1px solid rgba(255, 249, 227, 0.18);
  background: linear-gradient(125deg, rgba(255, 255, 255, 0.19), rgba(255, 255, 255, 0.025) 45%, rgba(231, 191, 95, 0.08));
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.18), 0 2.2rem 4.7rem rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(15px) saturate(0.8);
  -webkit-backdrop-filter: blur(15px) saturate(0.8);
}

.glass-plane::after,
.glass-shard::after,
.shard-ui::before {
  position: absolute;
  content: "";
  pointer-events: none;
}

.glass-plane::after,
.glass-shard::after {
  inset: 0;
  background: linear-gradient(118deg, transparent 21%, rgba(255, 255, 255, 0.21) 36%, transparent 51%);
  opacity: 0.7;
  transform: translateX(-130%);
  animation: glint 8s ease-in-out infinite;
}

.glass-plane-back {
  z-index: 1;
  top: 6%;
  right: 6%;
  width: 78%;
  height: 62%;
  clip-path: polygon(19% 0, 100% 10%, 87% 77%, 28% 100%, 0 55%);
  opacity: 0.58;
  animation: plane-drift-back 9s ease-in-out infinite;
}

.glass-plane-left {
  z-index: 3;
  bottom: 4%;
  left: -3%;
  width: 42%;
  height: 48%;
  clip-path: polygon(0 7%, 100% 0, 76% 77%, 16% 100%);
  opacity: 0.8;
  animation: plane-drift-left 8s ease-in-out -1.2s infinite;
}

.glass-plane-right {
  z-index: 2;
  right: -2%;
  bottom: 2%;
  width: 34%;
  height: 44%;
  clip-path: polygon(25% 0, 100% 32%, 89% 100%, 0 76%);
  background: linear-gradient(145deg, rgba(230, 194, 105, 0.14), rgba(255, 255, 255, 0.04));
  opacity: 0.72;
  animation: plane-drift-right 10s ease-in-out -2s infinite;
}

.shard-ui {
  z-index: 5;
  color: #f1eee5;
  transform: translateZ(32px);
}

.shard-ui::before {
  inset: 0;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0.15),
    transparent 28%,
    transparent 70%,
    rgba(239, 211, 131, 0.08)
  );
}

.shard-ui-main {
  top: 20%;
  right: 11%;
  width: min(68%, 23rem);
  height: 51%;
  min-height: 16.5rem;
  padding: clamp(1.2rem, 2.6vw, 1.85rem);
  clip-path: polygon(13% 0, 100% 8%, 85% 100%, 0 82%);
  background:
    radial-gradient(circle at 85% 10%, rgba(238, 208, 123, 0.2), transparent 22%),
    linear-gradient(135deg, rgba(35, 36, 31, 0.88), rgba(18, 19, 17, 0.68));
}

.shard-ui-top {
  top: 6%;
  right: 7%;
  display: grid;
  gap: 0.34rem;
  width: 42%;
  min-height: 7.2rem;
  padding: 1.1rem 1.2rem 1.4rem;
  clip-path: polygon(14% 0, 100% 17%, 88% 100%, 0 73%);
  background: linear-gradient(132deg, rgba(45, 45, 37, 0.86), rgba(23, 23, 20, 0.74));
  animation: shard-ui-top-drift 7s ease-in-out -0.8s infinite;
}

.shard-ui-side {
  bottom: 11%;
  left: 6%;
  display: grid;
  align-content: center;
  gap: 0.72rem;
  width: 32%;
  min-height: 8.75rem;
  padding: 1.2rem 1rem 1.25rem 1.45rem;
  clip-path: polygon(0 8%, 100% 0, 76% 100%, 13% 83%);
  background: linear-gradient(144deg, rgba(57, 54, 42, 0.86), rgba(21, 21, 18, 0.76));
  animation: shard-ui-side-drift 8s ease-in-out -2.4s infinite;
}

.shard-ui-bottom {
  right: 5%;
  bottom: 0;
  display: grid;
  gap: 0.14rem;
  width: 38%;
  min-height: 5.65rem;
  padding: 1.25rem 1.15rem 1rem;
  clip-path: polygon(22% 0, 100% 25%, 74% 100%, 0 79%);
  background: linear-gradient(134deg, rgba(58, 52, 37, 0.8), rgba(20, 20, 17, 0.76));
  animation: shard-ui-bottom-drift 9s ease-in-out -4s infinite;
}

.shard-label,
.shard-detail {
  position: relative;
  z-index: 1;
  color: rgba(232, 217, 177, 0.66);
  font-size: 0.54rem;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.shard-ui-top strong,
.shard-ui-side strong,
.shard-ui-bottom strong,
.shard-ui-bottom span {
  position: relative;
  z-index: 1;
}

.shard-ui-top strong {
  max-width: 9ch;
  color: #eee8d9;
  font-size: clamp(1rem, 1.75vw, 1.3rem);
  font-weight: 500;
  letter-spacing: -0.055em;
  line-height: 0.96;
}

.shard-ui-side strong {
  color: #e8d180;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.28rem;
  font-style: italic;
  font-weight: 400;
}

.shard-ui-bottom span {
  color: #9c998e;
  font-size: 0.62rem;
  letter-spacing: 0.08em;
}

.shard-ui-bottom strong {
  color: #eee7d6;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: -0.04em;
}

.signal-bars {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: end;
  gap: 0.22rem;
  height: 1.8rem;
}

.signal-bars i {
  display: block;
  width: 0.22rem;
  background: linear-gradient(#ead28b, rgba(234, 210, 139, 0.26));
}

.signal-bars i:nth-child(1) { height: 34%; }
.signal-bars i:nth-child(2) { height: 66%; }
.signal-bars i:nth-child(3) { height: 46%; }
.signal-bars i:nth-child(4) { height: 100%; }

.panel-topline,
.panel-main {
  position: relative;
  z-index: 1;
}

.panel-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: rgba(228, 217, 181, 0.75);
  font-size: 0.57rem;
  font-weight: 700;
  letter-spacing: 0.125em;
  text-transform: uppercase;
}

.panel-live {
  display: inline-flex;
  align-items: center;
  gap: 0.38rem;
  color: #e2c670;
}

.panel-live i {
  width: 0.34rem;
  height: 0.34rem;
  border-radius: 50%;
  background: #d7bc5f;
  box-shadow: 0 0 0 0.28rem rgba(215, 188, 95, 0.11);
}

.panel-main {
  display: flex;
  flex-direction: column;
  height: calc(100% - 1.2rem);
  padding-top: clamp(2.6rem, 5vw, 4.6rem);
}

.panel-main p {
  color: #e5cb7d;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.25rem, 2.4vw, 1.8rem);
  font-style: italic;
}

.panel-main h2 {
  max-width: 11ch;
  margin-top: 0.4rem;
  color: #f1eee5;
  font-size: clamp(1.35rem, 2.45vw, 2.05rem);
  font-weight: 500;
  letter-spacing: -0.065em;
  line-height: 0.98;
}

.panel-rule {
  width: 100%;
  height: 1px;
  margin-top: auto;
  background: linear-gradient(90deg, rgba(229, 203, 125, 0.75), rgba(229, 203, 125, 0.08));
}

.panel-stats {
  display: flex;
  gap: 2rem;
  padding-top: 0.9rem;
}

.panel-stats div {
  display: grid;
  gap: 0.22rem;
}

.panel-stats span {
  color: #96948d;
  font-size: 0.59rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.panel-stats strong {
  color: #e6e1d3;
  font-size: 0.72rem;
  font-weight: 600;
}

.glass-chip {
  z-index: 6;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: #e8e1ce;
  font-size: 0.66rem;
  letter-spacing: 0.05em;
  transform: translateZ(48px);
}

.chip-index {
  top: 6%;
  left: 4%;
  justify-content: center;
  width: 4.1rem;
  height: 3rem;
  clip-path: polygon(0 0, 100% 17%, 82% 100%, 10% 79%);
  color: #e2c670;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.glass-shard {
  z-index: 5;
  background: linear-gradient(125deg, rgba(255, 255, 255, 0.2), rgba(226, 190, 98, 0.07));
  animation: loose-shard-drift 8.5s ease-in-out infinite;
}

.shard-top {
  top: 4%;
  right: 2%;
  width: 9rem;
  height: 6.3rem;
  clip-path: polygon(12% 0, 100% 20%, 79% 100%, 0 64%);
  animation-delay: -2.8s;
}

.shard-bottom {
  right: 14%;
  bottom: -1%;
  width: 6.6rem;
  height: 5.3rem;
  clip-path: polygon(21% 0, 100% 16%, 75% 100%, 0 72%);
  animation-delay: -5.6s;
}

.visual-crosshair {
  position: absolute;
  z-index: 7;
  width: 1.75rem;
  height: 1.75rem;
  border: 1px solid rgba(239, 216, 146, 0.48);
  border-radius: 50%;
  transform: translateZ(60px);
}

.visual-crosshair::before,
.visual-crosshair::after {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2.45rem;
  height: 1px;
  content: "";
  background: rgba(239, 216, 146, 0.35);
  transform: translate(-50%, -50%);
}

.visual-crosshair::after {
  transform: translate(-50%, -50%) rotate(90deg);
}

.crosshair-top {
  top: 25%;
  left: 8%;
}

.crosshair-bottom {
  right: 2%;
  bottom: 24%;
  transform: scale(0.62) translateZ(60px);
}

.hero-grid {
  position: absolute;
  z-index: -1;
  inset: 0;
  pointer-events: none;
  background-image: linear-gradient(rgba(234, 211, 144, 0.075) 1px, transparent 1px),
    linear-gradient(90deg, rgba(234, 211, 144, 0.075) 1px, transparent 1px);
  background-position: center;
  background-size: 6rem 6rem;
  mask-image: radial-gradient(ellipse at 72% 50%, black, transparent 67%);
  opacity: 0.48;
  animation: grid-drift 22s linear infinite;
}

.hero-grain {
  position: absolute;
  z-index: -1;
  inset: 0;
  pointer-events: none;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E");
}

.hero-halo {
  position: absolute;
  z-index: -1;
  width: 22rem;
  height: 22rem;
  border: 1px solid rgba(232, 207, 133, 0.075);
  border-radius: 50%;
  pointer-events: none;
  animation: halo-turn 18s linear infinite;
}

.halo-left {
  top: 15%;
  left: -14rem;
}

.halo-right {
  right: -12rem;
  bottom: -12rem;
  width: 35rem;
  height: 35rem;
}

.scroll-prompt {
  position: absolute;
  z-index: 3;
  bottom: 1.45rem;
  left: max(1.25rem, calc((100vw - 90rem) / 2 + 1.5rem));
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  color: #99978e;
  font-size: 0.63rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-decoration: none;
  text-transform: uppercase;
  transition: color 200ms ease, transform 200ms ease;
  animation: scroll-hint 2.8s ease-in-out 1.2s infinite;
}

.hero-scroll-index {
  position: absolute;
  z-index: 3;
  right: max(1.25rem, calc((100vw - 90rem) / 2 + 1.5rem));
  bottom: 1.45rem;
  display: grid;
  justify-items: center;
  gap: 0.45rem;
  color: rgba(218, 207, 173, 0.65);
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.hero-scroll-index i {
  display: block;
  width: 1px;
  height: 3.35rem;
  background: linear-gradient(
    to bottom,
    var(--gold-light),
    rgba(229, 203, 125, 0.12)
  );
  transform-origin: top;
}

.scroll-prompt:hover {
  color: var(--gold-light);
  transform: translateX(4px);
}

.scroll-line {
  display: block;
  width: 2rem;
  height: 1px;
  background: currentColor;
}

@keyframes soft-rise {
  from {
    opacity: 0;
    transform: translateY(1.15rem);
  }
}

@keyframes title-reveal {
  from {
    opacity: 0;
    clip-path: inset(0 0 105% 0);
    transform: translateY(1.2rem);
  }
}

@keyframes visual-enter {
  from {
    opacity: 0;
    transform: translate3d(1.4rem, 1rem, 0) scale(0.96);
  }
}

@keyframes visual-trace {
  0%,
  100% {
    opacity: 0.24;
    transform: rotate(-5deg) scale(0.96);
  }
  50% {
    opacity: 0.82;
    transform: rotate(-2deg) scale(1.02);
  }
}

@keyframes glint {
  15%,
  100% {
    transform: translateX(130%);
  }
}

@keyframes aura-breathe {
  50% {
    opacity: 1;
    transform: scale(1.09);
  }
}

@keyframes fracture-pulse {
  50% {
    opacity: 0.68;
    transform: scale(1.012);
  }
}

@keyframes plane-drift-back {
  0%,
  100% {
    transform: rotate(7deg) translate3d(0, 0, -20px);
  }
  50% {
    transform: rotate(5deg) translate3d(0.25rem, -0.45rem, -20px);
  }
}

@keyframes plane-drift-left {
  0%,
  100% {
    transform: rotate(-5deg) translate3d(0, 0, 16px);
  }
  50% {
    transform: rotate(-3deg) translate3d(-0.3rem, -0.5rem, 16px);
  }
}

@keyframes plane-drift-right {
  0%,
  100% {
    transform: rotate(10deg) translate3d(0, 0, -6px);
  }
  50% {
    transform: rotate(12deg) translate3d(0.25rem, -0.4rem, -6px);
  }
}

@keyframes shard-ui-top-drift {
  0%,
  100% {
    transform: translate3d(0, 0, 22px) rotate(2deg);
  }
  50% {
    transform: translate3d(0.25rem, -0.35rem, 22px) rotate(0.8deg);
  }
}

@keyframes shard-ui-side-drift {
  0%,
  100% {
    transform: translate3d(0, 0, 44px) rotate(-5deg);
  }
  50% {
    transform: translate3d(-0.3rem, 0.3rem, 44px) rotate(-3.4deg);
  }
}

@keyframes shard-ui-bottom-drift {
  0%,
  100% {
    transform: translate3d(0, 0, 54px) rotate(4deg);
  }
  50% {
    transform: translate3d(0.35rem, -0.25rem, 54px) rotate(2.7deg);
  }
}

@keyframes loose-shard-drift {
  0%,
  100% {
    transform: translate3d(0, 0, 56px) rotate(0deg);
  }
  50% {
    transform: translate3d(0.4rem, -0.5rem, 56px) rotate(3deg);
  }
}

@keyframes grid-drift {
  to {
    background-position: 6rem 6rem;
  }
}

@keyframes halo-turn {
  to {
    rotate: 1turn;
  }
}

@keyframes scroll-hint {
  50% {
    transform: translateX(0.35rem);
  }
}

@keyframes hero-copy-exit {
  to {
    opacity: 0.08;
    transform: translate3d(0, -16vh, 0);
  }
}

@keyframes hero-visual-exit {
  to {
    opacity: 0.16;
    transform: translate3d(7vw, -9vh, 0) scale(1.12);
  }
}

@keyframes hero-grid-exit {
  to {
    opacity: 0;
    transform: scale(1.08);
  }
}

@keyframes scroll-index-fill {
  from {
    transform: scaleY(0.12);
  }
  to {
    transform: scaleY(1);
  }
}

@supports (animation-timeline: view()) {
  @media (min-width: 769px) {
    .hero-copy {
      animation: hero-copy-exit linear both;
      animation-timeline: view();
      animation-range: exit 0% exit 100%;
    }

    .hero-visual-scroll {
      animation: hero-visual-exit linear both;
      animation-timeline: view();
      animation-range: exit 0% exit 100%;
    }

    .hero-grid {
      animation: grid-drift 22s linear infinite, hero-grid-exit linear both;
      animation-timeline: auto, view();
      animation-range: normal, exit 0% exit 100%;
    }

    .hero-scroll-index i {
      animation: scroll-index-fill linear both;
      animation-timeline: view();
      animation-range: entry 0% exit 85%;
    }
  }
}

@media (min-width: 1536px) {
  .scroll-prompt {
    left: clamp(6rem, 7vw, 13.75rem);
  }

  .hero-scroll-index {
    right: clamp(6rem, 7vw, 13.75rem);
  }
}

@media (max-width: 1023px) {
  .hero {
    min-height: auto;
    padding-bottom: 5.2rem;
  }

  .hero-shell {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .hero-copy {
    max-width: 42rem;
  }

  .hero-visual {
    width: min(100%, 39rem);
    min-height: 33rem;
    margin: -1rem auto 0;
  }

  .scroll-prompt {
    display: none;
  }

  .hero-scroll-index {
    display: none;
  }
}

@media (max-width: 640px) {
  .hero {
    min-height: auto;
    padding-top: 7.7rem;
    padding-bottom: 2.4rem;
  }

  .hero h1 {
    max-width: 9.4ch;
    font-size: clamp(3.1rem, 15vw, 4.15rem);
  }

  .hero-intro {
    max-width: 31ch;
  }

  .hero-meta {
    gap: 0.9rem 1.15rem;
    margin-top: 2.7rem;
  }

  .hero-meta div:last-child {
    display: none;
  }

  .hero-visual {
    min-height: 26.5rem;
    margin-top: -0.5rem;
  }

  .shard-ui-main {
    top: 20%;
    right: 5%;
    width: 82%;
    height: 56%;
    min-height: 15rem;
  }

  .shard-ui-top {
    top: 6%;
    right: 3%;
    width: 45%;
    min-height: 6.2rem;
    padding: 0.95rem 1rem 1.2rem;
  }

  .shard-ui-side {
    bottom: 10%;
    left: 2%;
    width: 35%;
    min-height: 8rem;
  }

  .shard-ui-bottom {
    right: 1%;
    bottom: 0;
    width: 41%;
    min-height: 5rem;
    padding: 1rem 0.9rem 0.75rem;
  }

  .panel-main {
    padding-top: 2.7rem;
  }

  .glass-plane-back {
    right: 0;
    width: 86%;
  }

  .glass-plane-left {
    left: -7%;
    width: 47%;
  }

  .glass-plane-right,
  .shard-top,
  .crosshair-bottom {
    display: none;
  }

  .chip-index {
    top: 4%;
    left: 2%;
  }

  .shard-bottom {
    right: 7%;
    bottom: 4%;
  }

  .crosshair-top {
    top: 21%;
    left: 4%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-eyebrow,
  .hero-title-line,
  .hero-intro,
  .hero-actions,
  .hero-meta,
  .hero-visual,
  .visual-aura,
  .fracture-map,
  .hero-grid,
  .hero-halo,
  .scroll-prompt,
  .glass-plane,
  .shard-ui,
  .glass-shard,
  .glass-plane::after,
  .glass-shard::after {
    animation: none !important;
  }

  .visual-system {
    transition: none;
  }
}
</style>
