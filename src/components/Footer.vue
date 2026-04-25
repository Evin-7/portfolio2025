<template>
  <footer class="footer">
    <div class="footer-shell">
      <div class="footer-brand">
        <img :src="logoMark" alt="Evin logo" class="footer-mark" />
      </div>
      <div class="footer-links">
        <a href="mailto:yjevin75@gmail.com">Email</a>
        <a href="https://github.com/Evin-7" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
      <p class="footer-meta">&copy; {{ currentYear }}</p>
    </div>
  </footer>
</template>

<script setup>
import logoMark from "../assets/icons/peniel-mark.svg";

const currentYear = new Date().getFullYear();
</script>

<style scoped>
.footer {
  padding: 3rem 1.5rem 4rem;
  background: #ffffff;
  border-top: 1px solid rgba(29, 29, 31, 0.06);
}

.footer-shell {
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.footer-brand {
  display: inline-flex;
  align-items: center;
}

.footer-mark {
  width: 34px;
  height: 34px;
  display: block;
  filter: drop-shadow(0 10px 18px rgba(17, 17, 17, 0.1));
}

.footer-meta {
  font-size: 0.92rem;
  color: #6e6e73;
}

.footer-links {
  display: flex;
  gap: 1rem;
}

.footer-links a {
  color: #6e6e73;
  text-decoration: none;
  font-size: 0.92rem;
}

@media (max-width: 640px) {
  .footer-shell {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
