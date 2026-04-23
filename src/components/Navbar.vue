<template>
  <nav class="navbar">
    <div class="nav-shell">
      <a href="#home" class="logo">
        <span class="logo-badge" aria-label="JEL logo">JEL</span>
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
  height: 28px;
  width: auto;
  display: block;
}

.logo-badge {
  min-width: 118px;
  height: 36px;
  padding: 0 1.15rem;
  border-radius: 12px;
  background: #111111;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  line-height: 1;
  text-indent: 0.12em;
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
