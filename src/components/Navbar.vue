<template>
  <nav class="navbar">
    <div class="nav-shell site-container">
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
  background: linear-gradient(
    90deg,
    rgba(7, 8, 7, 0.82),
    rgba(17, 17, 15, 0.66)
  );
  border-bottom: 1px solid rgba(232, 218, 178, 0.12);
  box-shadow: 0 0.8rem 2.6rem rgba(0, 0, 0, 0.16);
  backdrop-filter: blur(18px) saturate(0.8);
  -webkit-backdrop-filter: blur(18px) saturate(0.8);
}

.navbar::after {
  content: "";
  position: absolute;
  right: 9%;
  bottom: -1px;
  left: 9%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(229, 203, 125, 0.5),
    transparent
  );
  opacity: 0.75;
}

.nav-shell {
  padding-block: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  padding: 0.24rem;
  border: 1px solid rgba(232, 218, 178, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.035);
  transition: border-color 180ms ease, background-color 180ms ease,
    transform 180ms ease;
}

.logo:hover,
.logo:focus-visible {
  border-color: rgba(229, 203, 125, 0.65);
  background: rgba(229, 203, 125, 0.08);
  transform: translateY(-1px);
}

.logo:focus-visible {
  outline: 2px solid var(--gold-light);
  outline-offset: 3px;
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
  color: #d8d4c9;
  text-decoration: none;
  font-size: 0.77rem;
  font-weight: 700;
  letter-spacing: 0.04em;
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
.nav-links a:focus-visible { color: var(--gold-light); }
.nav-links a:hover::after,
.nav-links a:focus-visible::after { transform: scaleX(1); }

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>
