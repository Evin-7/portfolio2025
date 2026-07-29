<template>
  <section class="skills">
    <div class="skills-shell site-container">
      <p class="skills-eyebrow">Skills</p>
      <h2 class="skills-title">Focused stack.</h2>
      <p class="skills-text">
        Core tools I use across software engineering, product UI, responsive
        builds, and day-to-day team collaboration.
      </p>
      <div class="skills-list">
        <span v-for="skill in skills" :key="skill" class="skill-pill">{{
          skill
        }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
const skills = [
  "Vue",
  "React",
  "Next.js",
  "React Native",
  "Node.js",
  "Git",
  "Jira",
];
</script>

<style scoped>
.skills {
  padding: 4.5rem 0;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.skills::before {
  content: "";
  position: absolute;
  top: 50%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(212, 175, 55, 0.08) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.skills-shell {
  position: relative;
  z-index: 1;
  animation: slideInUp 0.8s ease-out 0.1s both;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.skills-eyebrow {
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gold);
  opacity: 0.8;
}

.skills-title {
  margin-top: 0.9rem;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.02;
  letter-spacing: -0.04em;
  background: linear-gradient(
    135deg,
    var(--text-primary) 0%,
    var(--gold-light) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.skills-text {
  max-width: 620px;
  margin-top: 1rem;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.8rem;
}

.skill-pill {
  padding: 0.72rem 0.95rem;
  border-radius: 999px;
  background: linear-gradient(
    135deg,
    var(--bg-surface) 0%,
    rgba(26, 26, 26, 0.5) 100%
  );
  border: 1.5px solid var(--gold-border);
  color: var(--gold);
  font-size: 0.92rem;
  line-height: 1;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  animation: pillReveal 0.6s ease-out forwards;
  opacity: 0;
}

.skill-pill:nth-child(1) {
  animation-delay: 0.1s;
}
.skill-pill:nth-child(2) {
  animation-delay: 0.15s;
}
.skill-pill:nth-child(3) {
  animation-delay: 0.2s;
}
.skill-pill:nth-child(4) {
  animation-delay: 0.25s;
}
.skill-pill:nth-child(5) {
  animation-delay: 0.3s;
}
.skill-pill:nth-child(6) {
  animation-delay: 0.35s;
}
.skill-pill:nth-child(7) {
  animation-delay: 0.4s;
}

@keyframes pillReveal {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (hover: hover) and (pointer: fine) {
  .skill-pill:hover {
    background: var(--gold);
    color: var(--bg-primary);
    transform: scale(1.08) translateY(-4px);
    border-color: var(--gold);
    box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
  }
}
</style>
