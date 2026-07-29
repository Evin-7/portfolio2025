<template>
  <div class="app">
    <div class="page-shell">
      <Navbar />
      <main class="content-shell">
        <section id="home"><Hero /></section>
        <Highlights />
        <section id="about"><About /></section>
        <section id="skills"><Skills /></section>
        <section id="works"><Works /></section>
        <section id="contact"><Contact /></section>
      </main>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import Hero from "./views/Hero.vue";
import Highlights from "./views/Highlights.vue";
import About from "./views/About.vue";
import Skills from "./views/Skills.vue";
import Works from "./views/Works.vue";
import Contact from "./views/Contact.vue";
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");

:root {
  --bg-primary: #0d0d0d;
  --bg-surface: #1a1a1a;
  --bg-surface-alt: #151515;
  --gold: #d4af37;
  --gold-muted: rgba(212, 175, 55, 0.6);
  --gold-border: rgba(212, 175, 55, 0.2);
  --gold-glow: rgba(212, 175, 55, 0.15);
  --text-primary: #f2f2f2;
  --text-secondary: #9a9a9a;
  --code-bg: #101010;
  --gold-deep: #9f7620;
  --gold-light: #e6cb77;
}

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
  font-family: "Plus Jakarta Sans", "SamsungOne", "Samsung One",
    "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont,
    "Helvetica Neue", Arial, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow-x: hidden;
}

.app {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #0d0d0d 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.page-shell {
  position: relative;
  z-index: 1;
}

.content-shell {
  position: relative;
  z-index: 0;
  isolation: isolate;
}

.content-shell::before {
  display: none;
}

.content-shell::after {
  display: none;
}

.content-shell > * {
  position: relative;
  z-index: 1;
  animation: revealOnScroll 0.8s ease-out forwards;
  opacity: 0;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}

.content-shell > #works {
  animation: none;
  filter: none;
  opacity: 1;
  transform: none;
}

@keyframes revealOnScroll {
  from {
    opacity: 0;
    transform: translateY(60px);
    filter: blur(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

/* Smooth scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

::-webkit-scrollbar-thumb {
  background: var(--gold);
  border-radius: 3px;
  border: 1px solid var(--bg-primary);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--gold-light);
}
</style>
