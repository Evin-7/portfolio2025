<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="nav-container">
      <div class="logo">Evin Leyander</div>
      <ul class="nav-links">
        <li><a href="#home" class="interactive">Home</a></li>
        <li><a href="#about" class="interactive">About</a></li>
        <li><a href="#works" class="interactive">Works</a></li>
        <li><a href="#contact" class="interactive">Contact</a></li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isScrolled = ref(false);
let lastScrollTop = 0;

const handleScroll = () => {
  const scrollTop = window.pageYOffset;

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    isScrolled.value = true;
  } else {
    isScrolled.value = false;
  }

  lastScrollTop = scrollTop;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.navbar.scrolled {
  background: rgba(10, 10, 10, 0.95);
  transform: translateY(-100%);
  animation: slideDown 0.5s ease forwards;
}

@keyframes slideDown {
  to {
    transform: translateY(0);
  }
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: glow 2s ease-in-out infinite alternate;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav-links a {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  position: relative;
  transition: all 0.3s ease;
}

.nav-links a::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  transition: width 0.3s ease;
}

.nav-links a:hover::after {
  width: 100%;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>

