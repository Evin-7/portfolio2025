<template>
  <section class="about">
    <div class="about-shell">
      <div class="about-copy">
        <p class="about-eyebrow">About</p>
        <h2 class="about-title">A quiet, product-minded approach to frontend work.</h2>
        <p class="about-text">
          I build clear, scalable interfaces with strong typography, disciplined spacing, and polished interaction details.
        </p>
      </div>

      <div class="experience">
        <div class="experience-item">
          <div>
            <h3>Senior Software Engineer</h3>
            <p>Penieltech LLC, Dubai</p>
          </div>
          <span>Feb 2026 - Present</span>
        </div>
        <div class="experience-item">
          <div>
            <h3>Software Engineer</h3>
            <p>Turinix</p>
          </div>
          <span>2024 - Present</span>
        </div>
        <div class="experience-item">
          <div>
            <h3>Frontend Developer</h3>
            <p>Leopard Tech Labs</p>
          </div>
          <span>2022 - 2024</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  padding: 5.5rem 1.5rem;
  background: #ffffff;
}

.about-shell {
  max-width: 1060px;
  margin: 0 auto;
}

.about-copy {
  max-width: 720px;
}

.about-eyebrow {
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6e6e73;
}

.about-title {
  margin-top: 1rem;
  font-size: clamp(2.2rem, 5vw, 4rem);
  line-height: 1.02;
  letter-spacing: -0.04em;
  color: #1d1d1f;
}

.about-text {
  max-width: 620px;
  margin-top: 1.2rem;
  font-size: 1.05rem;
  line-height: 1.75;
  color: #6e6e73;
}

.experience-item {
  padding: 1.4rem;
  border-radius: 24px;
  background: #f5f5f7;
}
.experience-item h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1d1d1f;
}

.experience {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.experience-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.experience-item p,
.experience-item span {
  margin-top: 0.35rem;
  color: #6e6e73;
}

@media (max-width: 768px) {
  .experience {
    grid-template-columns: 1fr;
  }
}
</style>
