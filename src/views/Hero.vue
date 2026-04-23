<template>
  <section
    class="hero"
    @mousemove="handleMouseMove"
    @mouseleave="resetMouse"
  >
    <div class="hero-ambient ambient-one" :style="layerStyle(18, -12, 0.03)"></div>
    <div class="hero-ambient ambient-two" :style="layerStyle(-14, 16, 0.02)"></div>
    <div class="hero-grid" :style="layerStyle(10, 8, 0.01)"></div>

    <div class="hero-shell">
      <div class="hero-copy">
        <h1 class="hero-title">Software Engineer crafting clean, scalable experiences.</h1>
        <p class="hero-subtitle">
          Product-focused frontend work with a calm, premium visual approach.
        </p>
        <div class="hero-actions">
          <a href="#works" class="hero-button hero-button-primary interactive">View Projects</a>
          <a href="#contact" class="hero-button hero-button-secondary interactive">Contact</a>
        </div>
      </div>

      <div class="hero-stage">
        <div
          class="hero-orbit hero-orbit-one"
          :style="layerStyle(-16, 10, 0.02)"
        ></div>
        <div
          class="hero-orbit hero-orbit-two"
          :style="layerStyle(10, -14, 0.018)"
        ></div>
        <div
          class="hero-pattern hero-pattern-grid"
          :style="layerStyle(12, 9, 0.015)"
        ></div>
        <div
          class="hero-pattern hero-pattern-dots"
          :style="layerStyle(-10, 8, 0.012)"
        ></div>

        <div class="hero-stage-card hero-card-mini" :style="cardStyle(-6, 9, -0.25, 0.28, 0.018)">
          <div class="mini-icon">&lt;/&gt;</div>
          <div class="mini-copy">
            <strong>Clean code.</strong>
            <span>Thoughtful architecture.</span>
          </div>
        </div>

        <div class="hero-stage-card hero-card-code" :style="cardStyle(12, -14, 0.45, 0.55, 0.03)">
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

        <div class="hero-stage-card hero-card-dashboard" :style="cardStyle(10, 10, -0.35, -0.45, 0.024)">
          <div class="dash-sidebar">
            <span class="dash-logo">J</span>
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

        <div class="hero-stage-card hero-card-snapshot" :style="cardStyle(-8, 12, -0.25, 0.35, 0.02)">
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

        <div class="hero-stage-note note-bottom" :style="cardStyle(-4, 9, 0.2, -0.25, 0.018)">
          <strong>Built for impact.</strong>
          <span>Designed to scale.</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const mouseX = ref(0);
const mouseY = ref(0);
const scrollY = ref(0);

const handleMouseMove = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  mouseX.value = (event.clientX - rect.left) / rect.width - 0.5;
  mouseY.value = (event.clientY - rect.top) / rect.height - 0.5;
};

const resetMouse = () => {
  mouseX.value = 0;
  mouseY.value = 0;
};

const handleScroll = () => {
  scrollY.value = Math.min(window.scrollY, 500);
};

const layerStyle = (xFactor, yFactor, scrollFactor) => ({
  transform: `translate3d(${mouseX.value * xFactor}px, ${mouseY.value * yFactor + scrollY.value * scrollFactor}px, 0)`,
});

const cardStyle = (xFactor, yFactor, rotateXFactor, rotateYFactor, scrollFactor) => ({
  transform: `
    translate3d(${mouseX.value * xFactor}px, ${mouseY.value * yFactor + scrollY.value * 28 * scrollFactor}px, 0)
    rotateX(${mouseY.value * rotateXFactor * 12}deg)
    rotateY(${mouseX.value * rotateYFactor * 12}deg)
  `,
});

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding: 10rem 1.5rem 5rem;
  background: #fbfbfd;
}

.hero-shell {
  position: relative;
  z-index: 2;
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, 420px);
  gap: 2rem;
  align-items: center;
}

.hero-copy {
  max-width: 700px;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 5.6rem);
  line-height: 0.98;
  letter-spacing: -0.05em;
  font-weight: 700;
  color: #1d1d1f;
}

.hero-subtitle {
  max-width: 560px;
  margin: 1.4rem 0 0;
  font-size: 1rem;
  line-height: 1.7;
  color: #6e6e73;
}

.hero-actions {
  display: flex;
  gap: 0.9rem;
  flex-wrap: wrap;
  margin-top: 2.2rem;
}

.hero-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 168px;
  padding: 0.95rem 1.3rem;
  border-radius: 999px;
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.hero-button:hover {
  transform: translateY(-1px);
}

.hero-button-primary {
  background: #1d1d1f;
  color: #ffffff;
}

.hero-button-secondary {
  background: #f5f5f7;
  color: #1d1d1f;
}

.hero-ambient,
.hero-grid {
  position: absolute;
  pointer-events: none;
  z-index: 1;
}

.hero-ambient {
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(29, 29, 31, 0.05);
  box-shadow: 0 24px 80px rgba(29, 29, 31, 0.04);
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
    linear-gradient(rgba(29, 29, 31, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(29, 29, 31, 0.035) 1px, transparent 1px);
  background-size: 96px 96px;
  mask-image: radial-gradient(circle at center, black 42%, transparent 92%);
}

.hero-stage {
  position: relative;
  min-height: 520px;
  perspective: 1400px;
}

.hero-orbit,
.hero-pattern {
  position: absolute;
  pointer-events: none;
  transition: transform 0.16s ease-out;
}

.hero-orbit {
  border-radius: 999px;
  border: 1px solid rgba(29, 29, 31, 0.08);
}

.hero-orbit-one {
  width: 260px;
  height: 260px;
  top: 0.3rem;
  right: 0.5rem;
}

.hero-orbit-two {
  width: 132px;
  height: 132px;
  bottom: 2.8rem;
  left: 1rem;
  background:
    radial-gradient(circle at center, rgba(29, 29, 31, 0.055) 0 18%, transparent 19% 100%);
}

.hero-pattern-grid {
  top: 3.5rem;
  right: 2rem;
  width: 112px;
  height: 112px;
  border-radius: 28px;
  opacity: 0.6;
  background-image:
    linear-gradient(rgba(29, 29, 31, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(29, 29, 31, 0.07) 1px, transparent 1px);
  background-size: 14px 14px;
}

.hero-pattern-dots {
  right: 0.3rem;
  bottom: 6.6rem;
  width: 90px;
  height: 64px;
  opacity: 0.85;
  background-image: radial-gradient(circle, rgba(29, 29, 31, 0.26) 1.2px, transparent 1.2px);
  background-size: 14px 14px;
}

.hero-stage-card,
.hero-stage-note {
  position: absolute;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(29, 29, 31, 0.06);
  box-shadow: 0 20px 50px rgba(29, 29, 31, 0.06);
  transition: transform 0.16s ease-out;
}

.hero-card-mini {
  top: 4rem;
  left: 1.4rem;
  width: 190px;
  padding: 1rem;
  display: flex;
  gap: 0.9rem;
  align-items: center;
}

.mini-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: #f5f5f7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1d1d1f;
}

.mini-copy {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  color: #1d1d1f;
}

.mini-copy strong {
  font-size: 0.95rem;
}

.mini-copy span {
  font-size: 0.72rem;
  line-height: 1.45;
  color: #6e6e73;
}

.hero-card-code {
  top: 1.6rem;
  right: 0;
  width: 430px;
  padding: 1rem 1.05rem 1.1rem;
  background: #1d1d1f;
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: 0 28px 60px rgba(29, 29, 31, 0.16);
}

.code-topbar {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.code-dots {
  display: flex;
  gap: 0.38rem;
}

.code-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.code-dots span:nth-child(1) { background: #ff6b57; }
.code-dots span:nth-child(2) { background: #febc2e; }
.code-dots span:nth-child(3) { background: #28c840; }

.code-tab {
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.76);
}

.code-window {
  display: grid;
  gap: 0.5rem;
}

.code-line {
  display: grid;
  grid-template-columns: 22px 1fr;
  gap: 0.7rem;
  font-size: 0.8rem;
  line-height: 1.45;
}

.line-no {
  color: rgba(255, 255, 255, 0.28);
}

.line-text {
  color: rgba(255, 255, 255, 0.88);
}

.line-text.soft {
  color: rgba(255, 255, 255, 0.38);
}

.line-text.indent {
  padding-left: 0.9rem;
}

.hero-card-dashboard {
  right: 0.8rem;
  bottom: 0.8rem;
  width: 408px;
  height: 286px;
  display: grid;
  grid-template-columns: 56px 1fr;
  overflow: hidden;
}

.dash-sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.95rem;
  padding: 0.95rem 0.7rem;
  border-right: 1px solid rgba(29, 29, 31, 0.06);
}

.dash-sidebar span {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #f1f1f3;
}

.dash-sidebar .dash-logo {
  width: 24px;
  height: 24px;
  background: #1d1d1f;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dash-main {
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.dash-search {
  width: 38%;
  height: 12px;
  border-radius: 999px;
  background: #f2f2f4;
}

.dash-overview {
  margin-top: 1rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #1d1d1f;
}

.dash-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
  margin-top: 0.9rem;
}

.dash-stat-card {
  padding: 0.8rem 0.72rem;
  border-radius: 16px;
  background: #fafafc;
}

.dash-stat-label {
  font-size: 0.56rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8d8d92;
}

.dash-stat-value {
  margin-top: 0.45rem;
  font-size: 1rem;
  font-weight: 700;
  color: #1d1d1f;
}

.dash-chart {
  position: relative;
  flex: 1;
  margin-top: 0.9rem;
  border-radius: 18px;
  background:
    linear-gradient(rgba(29, 29, 31, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(29, 29, 31, 0.05) 1px, transparent 1px),
    #fafafc;
  background-size: 26px 26px, 26px 26px, auto;
  overflow: hidden;
}

.dash-chart-line {
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 1.1rem;
  height: 72px;
  background:
    radial-gradient(circle at 0% 78%, #9bbcf7 0 3px, transparent 4px),
    radial-gradient(circle at 18% 60%, #9bbcf7 0 3px, transparent 4px),
    radial-gradient(circle at 34% 70%, #9bbcf7 0 3px, transparent 4px),
    radial-gradient(circle at 52% 36%, #9bbcf7 0 3px, transparent 4px),
    radial-gradient(circle at 68% 54%, #9bbcf7 0 3px, transparent 4px),
    radial-gradient(circle at 84% 46%, #9bbcf7 0 3px, transparent 4px),
    radial-gradient(circle at 100% 20%, #9bbcf7 0 3px, transparent 4px);
}

.dash-chart-line::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0 5%, #9bbcf7 6% 7%, transparent 8% 21%, #9bbcf7 22% 23%, transparent 24% 37%, #9bbcf7 38% 39%, transparent 40% 53%, #9bbcf7 54% 55%, transparent 56% 69%, #9bbcf7 70% 71%, transparent 72% 85%, #9bbcf7 86% 87%, transparent 88% 100%);
  opacity: 0.5;
  mask: linear-gradient(to bottom, transparent 0, black 25%, black 100%);
}

.hero-card-snapshot {
  left: 0;
  bottom: 5.6rem;
  width: 220px;
  padding: 1rem 1rem 0.9rem;
}

.snapshot-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
  font-weight: 700;
  color: #1d1d1f;
}

.snapshot-head strong {
  font-size: 1rem;
  color: #3b82f6;
}

.snapshot-row {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 0.7rem;
  align-items: start;
  margin-top: 0.9rem;
}

.snapshot-icon {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: #f5f5f7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  color: #1d1d1f;
}

.snapshot-row strong {
  display: block;
  font-size: 0.76rem;
  color: #1d1d1f;
}

.snapshot-row small {
  display: block;
  margin-top: 0.18rem;
  font-size: 0.68rem;
  line-height: 1.4;
  color: #8b8b90;
}

.hero-stage-note {
  padding: 1rem 1.1rem;
  font-size: 0.92rem;
  backdrop-filter: blur(18px);
}

.note-bottom {
  left: 8.8rem;
  bottom: 0;
  width: 180px;
  background: #232325;
  border-color: rgba(35, 35, 37, 0.12);
  color: #ffffff;
  box-shadow: 0 22px 46px rgba(29, 29, 31, 0.14);
}

.note-bottom strong,
.note-bottom span {
  display: block;
}

.note-bottom span {
  margin-top: 0.2rem;
  color: rgba(255, 255, 255, 0.72);
}

@media (max-width: 980px) {
  .hero-shell {
    grid-template-columns: 1fr;
  }

  .hero-copy {
    max-width: 820px;
    text-align: center;
    margin: 0 auto;
  }

  .hero-subtitle {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-stage {
    max-width: 420px;
    width: 100%;
    margin: 0 auto;
    min-height: 480px;
  }
}

@media (max-width: 640px) {
  .hero {
    padding-top: 8.5rem;
  }

  .hero-stage {
    min-height: 340px;
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
    padding: 0.85rem;
  }

  .hero-card-dashboard {
    left: 1rem;
    right: 0;
    bottom: 0;
    width: auto;
    height: 180px;
  }

  .dash-stats {
    grid-template-columns: 1fr;
  }

  .dash-stat-card:nth-child(2),
  .dash-stat-card:nth-child(3) {
    display: none;
  }
}
</style>
