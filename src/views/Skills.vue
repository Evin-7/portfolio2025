<template>
  <section class="skills">
    <div class="skills-shell">
      <p class="skills-eyebrow">Skills</p>
      <h2 class="skills-title">Focused stack.</h2>
      <div class="skills-list">
        <span v-for="skill in skills" :key="skill" class="skill-pill">{{ skill }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
const skills = ["Vue", "React", "Next.js", "React Native", "Git", "Jira"];
</script>

<style scoped>
.skills {
  padding: 4.5rem 1.5rem;
  background: transparent;
}

.skills-shell {
  max-width: 1060px;
  margin: 0 auto;
}

.skills-eyebrow {
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6e6e73;
}

.skills-title {
  margin-top: 0.9rem;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.02;
  letter-spacing: -0.04em;
  color: #1d1d1f;
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
  background: #f5f5f7;
  color: #1d1d1f;
  font-size: 0.92rem;
  line-height: 1;
}
</style>
