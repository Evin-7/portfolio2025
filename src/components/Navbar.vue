<template>
  <nav class="navbar">
    <div class="nav-shell">
      <a href="#home" class="logo">
        <img :src="logoMark" alt="Evin logo" class="logo-mark" />
      </a>
      <ul class="nav-links">
        <li><a href="#about" class="interactive">About</a></li>
        <li><a href="#skills" class="interactive">Skills</a></li>
        <li><a href="#works" class="interactive">Work</a></li>
        <li><a href="#contact" class="interactive">Contact</a></li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import logoMark from "../assets/icons/peniel-mark.svg";
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(13, 13, 13, 0.9);
  backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--gold-border);
}

.nav-shell {
  max-width: 1180px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  padding: 0.2rem;
  border: 1px solid var(--gold-border);
  border-radius: 50%;
}

.logo-mark {
  width: 38px;
  height: 38px;
  display: block;
  filter: sepia(1) saturate(1.2) hue-rotate(2deg) drop-shadow(0 8px 14px var(--gold-glow));
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}

.nav-links a {
  position: relative;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 0.95rem;
}

.nav-links a::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: -0.4rem;
  left: 0;
  height: 1px;
  background: var(--gold);
  transform: scaleX(0);
  transition: transform 0.24s ease;
}

.nav-links a:hover,
.nav-links a:focus-visible { color: var(--gold); }
.nav-links a:hover::after,
.nav-links a:focus-visible::after { transform: scaleX(1); }

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>
