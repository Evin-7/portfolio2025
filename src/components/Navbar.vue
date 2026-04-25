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
  background: rgba(251, 251, 253, 0.86);
  backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid rgba(29, 29, 31, 0.06);
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
}

.logo-mark {
  width: 38px;
  height: 38px;
  display: block;
  filter: drop-shadow(0 10px 18px rgba(17, 17, 17, 0.12));
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}

.nav-links a {
  color: #1d1d1f;
  text-decoration: none;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>
