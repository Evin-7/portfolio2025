<template>
  <section class="hero">
    <div class="hero-grid"></div>
    <div class="hero-motif hero-motif-code" aria-hidden="true">
      <span>01</span>
      <span>&lt;/&gt;</span>
      <span>{ }</span>
    </div>
    <div class="hero-motif hero-motif-dots" aria-hidden="true"></div>
    <div class="hero-motif hero-motif-circuit" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <div class="hero-shell site-container">
      <div class="hero-copy">
        <p class="hero-kicker">Software Engineer</p>
        <h1 class="hero-title">Software Engineer crafting clean, <span>scalable experiences.</span></h1>
        <p class="hero-subtitle">
          Software engineering work with a calm, premium product approach.
        </p>
        <div class="hero-actions">
          <a href="#works" class="hero-button hero-button-primary interactive">View Projects</a>
          <a href="#contact" class="hero-button hero-button-secondary interactive">Contact</a>
        </div>
      </div>

      <div class="hero-stage">
        <div class="hero-orbit hero-orbit-one"></div>
        <div class="hero-orbit hero-orbit-two"></div>
        <div class="hero-pattern hero-pattern-grid"></div>
        <div class="hero-pattern hero-pattern-dots"></div>

        <div class="hero-stage-card hero-card-mini">
          <div class="mini-icon">&lt;/&gt;</div>
          <div class="mini-copy">
            <strong>Clean code.</strong>
            <span>Thoughtful architecture.</span>
          </div>
        </div>

        <div class="hero-stage-card hero-card-code">
          <div class="code-topbar">
            <div class="code-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="code-tab">ship.ts</div>
          </div>
          <div class="code-window">
            <div class="code-line"><span class="line-no">1</span><span class="line-text soft">import { Ship } from "@/domain/ship"</span></div>
            <div class="code-line"><span class="line-no">2</span><span class="line-text soft"></span></div>
            <div class="code-line"><span class="line-no">3</span><span class="line-text">export async function shipOrder(orderId: string) {</span></div>
            <div class="code-line"><span class="line-no">4</span><span class="line-text indent">const order = await getOrder(orderId)</span></div>
            <div class="code-line"><span class="line-no">5</span><span class="line-text indent">if (!order) throw new Error("Order not found")</span></div>
            <div class="code-line"><span class="line-no">6</span><span class="line-text soft"></span></div>
            <div class="code-line"><span class="line-no">7</span><span class="line-text indent">await validate(order)</span></div>
            <div class="code-line"><span class="line-no">8</span><span class="line-text indent">await processPayment(order)</span></div>
            <div class="code-line"><span class="line-no">9</span><span class="line-text indent">await Ship(order)</span></div>
            <div class="code-line"><span class="line-no">10</span><span class="line-text soft"></span></div>
            <div class="code-line"><span class="line-no">11</span><span class="line-text indent">return { success: true }</span></div>
            <div class="code-line"><span class="line-no">12</span><span class="line-text">}</span></div>
          </div>
        </div>

      <div class="hero-stage-card hero-card-dashboard">
          <div class="dash-sidebar">
            <span class="dash-logo" aria-hidden="true">
              <span class="dash-logo-stem"></span>
              <span class="dash-logo-dot"></span>
            </span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="dash-main">
            <div class="dash-search"></div>
            <div class="dash-overview">Overview</div>
            <div class="dash-stats">
              <div class="dash-stat-card">
                <div class="dash-stat-label">Total Users</div>
                <div class="dash-stat-value">24,678</div>
              </div>
              <div class="dash-stat-card">
                <div class="dash-stat-label">Active Now</div>
                <div class="dash-stat-value">1,234</div>
              </div>
              <div class="dash-stat-card">
                <div class="dash-stat-label">Revenue</div>
                <div class="dash-stat-value">$78,540</div>
              </div>
            </div>
            <div class="dash-chart">
              <div class="dash-chart-line"></div>
            </div>
          </div>
        </div>

        <div class="hero-stage-card hero-card-snapshot">
          <div class="snapshot-head">
            <span>Project Snapshot</span>
            <strong>↗</strong>
          </div>
          <div class="snapshot-row">
            <span class="snapshot-icon">⌂</span>
            <div><strong>Ship Clean</strong><small>Design system & apps</small></div>
          </div>
          <div class="snapshot-row">
            <span class="snapshot-icon">⌘</span>
            <div><strong>Tech</strong><small>React, TypeScript, Tailwind</small></div>
          </div>
          <div class="snapshot-row">
            <span class="snapshot-icon">◌</span>
            <div><strong>Role</strong><small>Software Engineer</small></div>
          </div>
          <div class="snapshot-row">
            <span class="snapshot-icon">◴</span>
            <div><strong>Year</strong><small>2026</small></div>
          </div>
        </div>

        <div class="hero-stage-note note-bottom">
          <strong>Built for impact.</strong>
          <span>Designed to scale.</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding: 9rem 0 4.5rem;
  background: var(--bg-primary);
  animation: hero-fade-in 0.35s ease-out both;
}

.hero-shell {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(240px, 300px);
  gap: 2.2rem;
  align-items: center;
  animation: hero-rise-in 0.45s ease-out 0.04s both;
}

.hero-copy {
  max-width: 560px;
  padding-right: 1.6rem;
  animation: hero-copy-in 0.42s ease-out 0.08s both;
}

.hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin-bottom: 1rem;
  color: var(--gold);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hero-kicker::before {
  content: "";
  width: 2.3rem;
  height: 1px;
  background: var(--gold);
}

.hero-title {
  font-size: clamp(3rem, 5.6vw, 4.8rem);
  line-height: 1.02;
  letter-spacing: -0.04em;
  font-weight: 700;
  color: var(--text-primary);
}

.hero-title span { color: var(--gold); }

.hero-subtitle {
  max-width: 480px;
  margin: 1.05rem 0 0;
  font-size: 0.96rem;
  line-height: 1.75;
  color: var(--text-secondary);
}

.hero-actions {
  display: flex;
  gap: 0.9rem;
  flex-wrap: wrap;
  margin-top: 1.85rem;
}

.hero-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 152px;
  padding: 0.88rem 1.18rem;
  border-radius: 999px;
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.hero-button:hover {
  transform: translateY(-1px);
}

.hero-button-primary {
  background: var(--gold);
  color: var(--bg-primary);
}

.hero-button-secondary {
  background: transparent;
  border: 1px solid var(--gold-border);
  color: var(--gold);
}

.hero-button-secondary:hover { background: rgba(212, 175, 55, 0.12); }

.hero-ambient,
.hero-grid {
  position: absolute;
  pointer-events: none;
  z-index: 1;
}

.hero-ambient {
  border-radius: 999px;
  background: rgba(212, 175, 55, 0.035);
  border: 1px solid rgba(212, 175, 55, 0.12);
  box-shadow: none;
}

.ambient-one {
  width: 260px;
  height: 260px;
  top: 7rem;
  right: 8%;
}

.ambient-two {
  width: 160px;
  height: 160px;
  bottom: 4rem;
  left: 8%;
}

.hero-grid {
  inset: 0;
  background-image:
    linear-gradient(rgba(212, 175, 55, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212, 175, 55, 0.08) 1px, transparent 1px);
  background-size: 96px 96px;
  opacity: 0.5;
  mask-image: linear-gradient(90deg, black, transparent 72%);
}

.hero-motif {
  position: absolute;
  z-index: 1;
  pointer-events: none;
  color: var(--gold);
}

.hero-motif-code {
  top: 8.75rem;
  left: 51%;
  display: flex;
  gap: 0.8rem;
  padding: 0.45rem 0.65rem;
  border-block: 1px solid rgba(212, 175, 55, 0.12);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  opacity: 0.18;
}

.hero-motif-dots {
  left: 47%;
  top: 47%;
  width: 72px;
  height: 56px;
  opacity: 0.12;
  background-image: radial-gradient(
    circle,
    rgba(212, 175, 55, 0.75) 1px,
    transparent 1.2px
  );
  background-size: 12px 12px;
}

.hero-motif-circuit {
  left: 52%;
  bottom: 5.5rem;
  width: 104px;
  height: 42px;
  opacity: 0.14;
  border-left: 1px solid var(--gold);
  border-bottom: 1px solid var(--gold);
}

.hero-motif-circuit::before {
  content: "";
  position: absolute;
  top: 11px;
  left: 0;
  width: 70%;
  border-top: 1px solid var(--gold);
}

.hero-motif-circuit span {
  position: absolute;
  width: 5px;
  height: 5px;
  border: 1px solid var(--gold);
  border-radius: 50%;
  background: var(--bg-primary);
}

.hero-motif-circuit span:nth-child(1) {
  top: 8px;
  left: -3px;
}

.hero-motif-circuit span:nth-child(2) {
  top: 8px;
  left: 70%;
}

.hero-motif-circuit span:nth-child(3) {
  right: -3px;
  bottom: -3px;
}

.hero-stage {
  position: relative;
  min-height: 340px;
  max-width: 280px;
  margin-left: auto;
  perspective: 1400px;
  animation: hero-stage-in 0.48s ease-out 0.12s both;
}

@keyframes hero-fade-in {
  from {
    opacity: 0;
  }
}

@keyframes hero-rise-in {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
}

@keyframes hero-copy-in {
  from {
    opacity: 0;
    transform: translateX(-18px);
  }
}

@keyframes hero-stage-in {
  from {
    opacity: 0;
    transform: translateX(18px);
  }
}

.hero-orbit,
.hero-pattern {
  position: absolute;
  pointer-events: none;
  transition: transform 0.16s ease-out;
}

.hero-orbit {
  border-radius: 999px;
  border: 1px solid var(--gold-border);
}

.hero-orbit-one {
  width: 210px;
  height: 210px;
  top: 0.1rem;
  right: 0.2rem;
}

.hero-orbit-two {
  width: 96px;
  height: 96px;
  bottom: 2.1rem;
  left: 0.6rem;
  background:
    radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0 18%, transparent 19% 100%);
}

.hero-pattern-grid {
  top: 2.8rem;
  right: 1.15rem;
  width: 84px;
  height: 84px;
  border-radius: 22px;
  opacity: 0.6;
  background-image:
    linear-gradient(rgba(212, 175, 55, 0.14) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212, 175, 55, 0.14) 1px, transparent 1px);
  background-size: 14px 14px;
}

.hero-pattern-dots {
  right: 0.2rem;
  bottom: 4.9rem;
  width: 68px;
  height: 52px;
  opacity: 0.85;
  background-image: radial-gradient(circle, rgba(212, 175, 55, 0.35) 1.2px, transparent 1.2px);
  background-size: 14px 14px;
}

.hero-stage-card,
.hero-stage-note {
  position: absolute;
  border-radius: 30px;
  background: var(--bg-surface);
  border: 1px solid var(--gold-border);
  box-shadow: none;
  transition: transform 0.16s ease-out;
}

.hero-card-mini {
  top: 2.2rem;
  left: 0.15rem;
  width: 124px;
  padding: 0.68rem;
  display: flex;
  gap: 0.55rem;
  align-items: center;
}

.mini-icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: rgba(212, 175, 55, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--gold);
}

.mini-copy {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  color: var(--text-primary);
}

.mini-copy strong {
  font-size: 0.68rem;
}

.mini-copy span {
  font-size: 0.56rem;
  line-height: 1.45;
  color: var(--text-secondary);
}

.hero-card-code {
  top: 0.4rem;
  right: 0;
  width: 276px;
  padding: 0.7rem 0.74rem 0.78rem;
  background: var(--code-bg);
  border-color: var(--gold-border);
  box-shadow: none;
}

.code-topbar {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.55rem;
}

.code-dots {
  display: flex;
  gap: 0.38rem;
}

.code-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.code-dots span:nth-child(1) { background: var(--gold-deep); }
.code-dots span:nth-child(2) { background: var(--gold); }
.code-dots span:nth-child(3) { background: var(--gold-light); }

.code-tab {
  padding: 0.18rem 0.42rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  font-size: 0.64rem;
  color: var(--gold-muted);
}

.code-window {
  display: grid;
  gap: 0.36rem;
}

.code-line {
  display: grid;
  grid-template-columns: 16px 1fr;
  gap: 0.45rem;
  font-size: 0.58rem;
  line-height: 1.35;
}

.line-no {
  color: rgba(255, 255, 255, 0.28);
}

.line-text {
  color: var(--text-primary);
}

.line-text.soft {
  color: rgba(255, 255, 255, 0.38);
}

.line-text.indent {
  padding-left: 0.45rem;
}

.hero-card-dashboard {
  right: 0.1rem;
  bottom: 0.4rem;
  width: 256px;
  height: 164px;
  display: grid;
  grid-template-columns: 34px 1fr;
  overflow: hidden;
}

.dash-sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.48rem;
  padding: 0.58rem 0.38rem;
  border-right: 1px solid var(--gold-border);
}

.dash-sidebar span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(212, 175, 55, 0.18);
}

.dash-sidebar .dash-logo {
  width: 16px;
  height: 16px;
  background: var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.dash-logo-stem {
  width: 8px;
  height: 12px;
  border-radius: 999px;
  background: var(--bg-primary);
}

.dash-logo-dot {
  position: absolute;
  right: 4px;
  bottom: 4px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--gold);
}

@media (hover: none), (pointer: coarse), (max-width: 768px) {
  .hero-ambient,
  .hero-grid,
  .hero-orbit,
  .hero-pattern,
  .hero-stage-card,
  .hero-stage-note {
    transition: none;
  }
}

.dash-main {
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.dash-search {
  width: 38%;
  height: 7px;
  border-radius: 999px;
  background: rgba(212, 175, 55, 0.12);
}

.dash-overview {
  margin-top: 0.45rem;
  font-size: 0.58rem;
  font-weight: 600;
  color: var(--text-primary);
}

.dash-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.34rem;
  margin-top: 0.45rem;
}

.dash-stat-card {
  padding: 0.4rem 0.38rem;
  border-radius: 10px;
  background: var(--bg-surface-alt);
}

.dash-stat-label {
  font-size: 0.42rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.dash-stat-value {
  margin-top: 0.18rem;
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--gold);
}

.dash-chart {
  position: relative;
  flex: 1;
  margin-top: 0.45rem;
  border-radius: 12px;
  background:
    linear-gradient(rgba(212, 175, 55, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212, 175, 55, 0.08) 1px, transparent 1px),
    var(--bg-surface-alt);
  background-size: 26px 26px, 26px 26px, auto;
  overflow: hidden;
}

.dash-chart-line {
  position: absolute;
  left: 0.5rem;
  right: 0.5rem;
  bottom: 0.5rem;
  height: 34px;
  background:
    radial-gradient(circle at 0% 78%, var(--gold) 0 3px, transparent 4px),
    radial-gradient(circle at 18% 60%, var(--gold) 0 3px, transparent 4px),
    radial-gradient(circle at 34% 70%, var(--gold) 0 3px, transparent 4px),
    radial-gradient(circle at 52% 36%, var(--gold) 0 3px, transparent 4px),
    radial-gradient(circle at 68% 54%, var(--gold) 0 3px, transparent 4px),
    radial-gradient(circle at 84% 46%, var(--gold) 0 3px, transparent 4px),
    radial-gradient(circle at 100% 20%, var(--gold) 0 3px, transparent 4px);
}

.dash-chart-line::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0 5%, var(--gold) 6% 7%, transparent 8% 21%, var(--gold) 22% 23%, transparent 24% 37%, var(--gold) 38% 39%, transparent 40% 53%, var(--gold) 54% 55%, transparent 56% 69%, var(--gold) 70% 71%, transparent 72% 85%, var(--gold) 86% 87%, transparent 88% 100%);
  opacity: 0.5;
  mask: linear-gradient(to bottom, transparent 0, black 25%, black 100%);
}

.hero-card-snapshot {
  left: 0;
  bottom: 3.2rem;
  width: 138px;
  padding: 0.64rem 0.64rem 0.58rem;
}

.snapshot-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.58rem;
  font-weight: 700;
  color: var(--text-primary);
}

.snapshot-head strong {
  font-size: 0.8rem;
  color: var(--gold);
}

.snapshot-row {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 0.4rem;
  align-items: start;
  margin-top: 0.5rem;
}

.snapshot-icon {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  background: rgba(212, 175, 55, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  color: var(--gold);
}

.snapshot-row strong {
  display: block;
  font-size: 0.58rem;
  color: var(--text-primary);
}

.snapshot-row small {
  display: block;
  margin-top: 0.18rem;
  font-size: 0.52rem;
  line-height: 1.3;
  color: var(--text-secondary);
}

.hero-stage-note {
  padding: 0.58rem 0.68rem;
  font-size: 0.62rem;
}

.note-bottom {
  left: auto;
  right: 1rem;
  bottom: 0;
  width: 112px;
  background: var(--bg-surface-alt);
  border-color: var(--gold-border);
  color: var(--text-primary);
  box-shadow: none;
}

.note-bottom strong,
.note-bottom span {
  display: block;
}

.note-bottom span {
  margin-top: 0.2rem;
  color: var(--gold);
}

@media (min-width: 981px) {
  .hero-stage {
    right: clamp(5rem, 9vw, 11rem);
  }
}

@media (max-width: 980px) {
  .hero-motif {
    display: none;
  }

  .hero-shell {
    grid-template-columns: 1fr;
  }

  .hero-copy {
    max-width: 820px;
    text-align: center;
    margin: 0 auto;
    padding-right: 0;
  }

  .hero-subtitle {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-stage {
    max-width: 280px;
    width: 100%;
    margin: 0 auto;
    min-height: 340px;
  }
}

@media (max-width: 640px) {
  .hero {
    padding-top: 8rem;
  }

  .hero-stage {
    min-height: 260px;
  }

  .hero-card-mini,
  .hero-card-snapshot,
  .note-bottom,
  .hero-pattern-dots {
    display: none;
  }

  .hero-card-code {
    top: 0;
    left: 0.2rem;
    right: 0.2rem;
    width: auto;
    padding: 0.78rem;
  }

  .hero-card-dashboard {
    left: 0.8rem;
    right: 0;
    bottom: 0;
    width: auto;
    height: 150px;
  }

  .dash-stats {
    grid-template-columns: 1fr;
  }

  .dash-stat-card:nth-child(2),
  .dash-stat-card:nth-child(3) {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero,
  .hero-shell,
  .hero-copy,
  .hero-stage {
    animation: none;
  }
}
</style>
