<template>
  <div class="app font-dmsans">
    <div ref="cursor" class="cursor"></div>
    <div class="scroll-progress" :style="{ width: scrollProgress + '%' }"></div>
    <div class="particle-container">
      <div
        v-for="particle in particles"
        :key="particle.id"
        class="particle"
        :style="particle.style"
      ></div>
    </div>

    <div class="scroll-smooth">
      <Navbar />
      <ParallaxSection background="/images/hero.jpg" :speed="-4">
        <Hero />
      </ParallaxSection>
      <section id="about"><About /></section>
      <section id="works"><Works /></section>
      <section id="contact"><Contact /></section>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import Hero from './views/Hero.vue'
import About from './views/About.vue'
import Works from './views/Works.vue'
import Contact from './views/Contact.vue'
import ParallaxSection from './components/ParallaxSection.vue'

// Reactive state
const cursor = ref(null)
const scrollProgress = ref(0)
const particles = ref([])

// Particle system
let particleId = 0
const createParticle = () => {
  const particle = {
    id: particleId++,
    style: {
      left: Math.random() * 100 + '%',
      animationDelay: Math.random() * 2 + 's'
    }
  }
  particles.value.push(particle)
  
  setTimeout(() => {
    particles.value = particles.value.filter(p => p.id !== particle.id)
  }, 3000)
}

// Custom cursor
const updateCursor = (e) => {
  if (cursor.value) {
    cursor.value.style.left = e.clientX + 'px'
    cursor.value.style.top = e.clientY + 'px'
  }
}

// Scroll progress
const updateScrollProgress = () => {
  const scrollTop = window.pageYOffset
  const docHeight = document.body.offsetHeight - window.innerHeight
  scrollProgress.value = (scrollTop / docHeight) * 100
}

// Lifecycle
onMounted(() => {
  document.addEventListener('mousemove', updateCursor)
  window.addEventListener('scroll', updateScrollProgress)
  
  // Start particle system
  setInterval(createParticle, 300)
  
  // Cursor hover effects
  const interactiveElements = document.querySelectorAll('a, button, .interactive')
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.value?.classList.add('hover'))
    el.addEventListener('mouseleave', () => cursor.value?.classList.remove('hover'))
  })
})

onUnmounted(() => {
  document.removeEventListener('mousemove', updateCursor)
  window.removeEventListener('scroll', updateScrollProgress)
})
</script>

<style>
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #0a0a0a;
  color: #ffffff;
  overflow-x: hidden;
}

.app {
  position: relative;
  min-height: 100vh;
}

/* Custom Cursor */
.cursor {
  position: fixed;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  transition: transform 0.1s ease;
}

.cursor.hover {
  transform: scale(2);
}

/* Scroll Progress Bar */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  z-index: 9999;
  transition: width 0.1s ease;
}

/* Particle Effect */
.particle-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #4ecdc4;
  border-radius: 50%;
  animation: particle-float 3s linear infinite;
}

@keyframes particle-float {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(1);
    opacity: 0;
  }
}

/* Section Animation Base */
.section {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease;
}

.section.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Utility Classes */
.gradient-text {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

.hover-lift {
  transition: all 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.2);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glow {
  from {
    text-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
  }
  to {
    text-shadow: 0 0 20px rgba(78, 205, 196, 0.5);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>