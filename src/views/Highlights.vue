<template>
  <section class="highlights">
    <div class="highlights-shell">
      <div class="highlights-intro">
        <div class="highlights-copy">
          <p class="highlights-eyebrow">What I Do</p>
          <h2 class="highlights-title">Software engineering with a sharper product eye.</h2>
        <p class="highlights-text">
            I build software that feels clear, usable, and production-ready, balancing engineering discipline with design sensitivity across web products, app experiences, and business platforms.
          </p>
        </div>

        <div class="highlights-feature">
          <span class="feature-label">Working Style</span>
          <h3>Calm systems. Clear interfaces. Strong execution.</h3>
          <p>
            The goal is simple: ship work that looks intentional, scales cleanly, and feels reliable in the hands of users and teams.
          </p>
          <div class="feature-points">
            <span>Web development</span>
            <span>App development</span>
            <span>PWA builds</span>
            <span>Responsive builds</span>
            <span>Reusable systems</span>
            <span>Production polish</span>
          </div>
        </div>
      </div>

      <div class="highlights-grid">
        <article class="highlight-card highlight-card-primary">
          <div class="highlight-icon">01</div>
          <h3>Web Development</h3>
          <p>Business websites, product sites, and custom web platforms built with clean structure and polished user experience.</p>
        </article>

        <article class="highlight-card">
          <div class="highlight-icon">02</div>
          <h3>App Development</h3>
          <p>Software interfaces and application flows designed for clarity, usability, and maintainable frontend systems.</p>
        </article>

        <article class="highlight-card">
          <div class="highlight-icon">03</div>
          <h3>PWA Development</h3>
          <p>Responsive progressive web apps that feel fast, reliable, and consistent across desktop and mobile devices.</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.highlights {
  padding: 4.15rem 1.5rem 2.45rem;
  background: transparent;
}

.highlights-shell {
  max-width: 1060px;
  margin: 0 auto;
}

.highlights-intro {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(230px, 285px);
  gap: 0.9rem;
  align-items: start;
}

.highlights-copy,
.highlights-feature,
.highlight-card {
  border-radius: 28px;
  border: 1px solid rgba(29, 29, 31, 0.12);
  box-shadow:
    0 18px 40px rgba(29, 29, 31, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.highlights-copy {
  padding: 1.3rem;
  background:
    radial-gradient(circle at top left, rgba(216, 178, 95, 0.12), transparent 26%),
    rgba(255, 255, 255, 0.92);
}

.highlights-eyebrow {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6e6e73;
}

.highlights-title {
  margin-top: 0.7rem;
  max-width: 11ch;
  font-size: clamp(1.65rem, 3.7vw, 2.85rem);
  line-height: 0.95;
  letter-spacing: -0.05em;
  color: #161618;
}

.highlights-text {
  max-width: 56ch;
  margin-top: 0.8rem;
  font-size: 0.9rem;
  line-height: 1.65;
  color: #6e6e73;
}

.highlights-feature {
  padding: 1.15rem;
  background:
    linear-gradient(160deg, rgba(24, 24, 28, 0.98) 0%, rgba(37, 37, 43, 0.96) 100%);
  color: #ffffff;
}

.feature-label {
  display: inline-flex;
  padding: 0.38rem 0.65rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.highlights-feature h3 {
  margin-top: 0.75rem;
  font-size: 1.12rem;
  line-height: 1.08;
  letter-spacing: -0.04em;
}

.highlights-feature p {
  margin-top: 0.7rem;
  font-size: 0.82rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.72);
}

.feature-points {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.9rem;
}

.feature-points span {
  padding: 0.3rem 0.55rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.9);
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.highlight-card {
  padding: 1.35rem;
  background: rgba(255, 255, 255, 0.92);
}

.highlight-card-primary {
  background:
    radial-gradient(circle at top left, rgba(155, 188, 247, 0.18), transparent 30%),
    rgba(255, 255, 255, 0.94);
}

.highlight-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #1d1d1f;
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 700;
}

.highlight-card h3 {
  margin-top: 1rem;
  font-size: 1.18rem;
  line-height: 1.12;
  color: #1d1d1f;
}

.highlight-card p {
  margin-top: 0.75rem;
  font-size: 0.95rem;
  line-height: 1.68;
  color: #6e6e73;
}

@media (max-width: 980px) {
  .highlights-intro {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .highlights-grid {
    grid-template-columns: 1fr;
  }
}
</style>
