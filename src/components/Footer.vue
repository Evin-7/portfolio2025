<template>
  <footer class="footer">
    <div class="footer-shell">
      <div class="footer-brand">
        <img :src="logoMark" alt="Evin logo" class="footer-mark" />
      </div>
      <div class="footer-links">
        <a href="mailto:yjevin75@gmail.com" class="footer-link">
          <span class="footer-link-icon" aria-hidden="true">✉</span>
          <span>Email</span>
        </a>
        <a href="https://github.com/Evin-7" target="_blank" rel="noopener noreferrer" class="footer-link">
          <span class="footer-link-icon" aria-hidden="true">GH</span>
          <span>GitHub</span>
        </a>
        <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer" class="footer-link">
          <span class="footer-link-icon" aria-hidden="true">in</span>
          <span>LinkedIn</span>
        </a>
        <a href="tel:+917510255897" class="footer-link">
          <span class="footer-link-icon" aria-hidden="true">☎</span>
          <span>+91 7510255897</span>
        </a>
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
  flex-wrap: wrap;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 0.48rem;
  padding: 0.48rem 0.72rem;
  border-radius: 999px;
  background: rgba(245, 245, 247, 0.95);
  border: 1px solid rgba(29, 29, 31, 0.08);
  color: #6e6e73;
  text-decoration: none;
  font-size: 0.92rem;
}

.footer-link-icon {
  width: 1.55rem;
  height: 1.55rem;
  border-radius: 999px;
  background: #1d1d1f;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1;
}

@media (max-width: 640px) {
  .footer-shell {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
