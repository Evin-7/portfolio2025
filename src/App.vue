<template>
  <div class="app">
    <div class="page-shell">
      <Navbar />
      <main class="content-shell">
        <section id="home"><Hero /></section>
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
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import Hero from './views/Hero.vue'
import About from './views/About.vue'
import Skills from './views/Skills.vue'
import Works from './views/Works.vue'
import Contact from './views/Contact.vue'
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap");

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
  font-family: "Montserrat", "SamsungOne", "Samsung One", "SF Pro Display", "SF Pro Text", -apple-system,
    BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
  background: #fbfbfd;
  color: #1d1d1f;
  overflow-x: hidden;
}

.app {
  position: relative;
  min-height: 100vh;
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
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 14% 12%, rgba(20, 20, 22, 0.065), transparent 22%),
    radial-gradient(circle at 82% 18%, rgba(20, 20, 22, 0.07), transparent 24%),
    radial-gradient(circle at 50% 56%, rgba(20, 20, 22, 0.045), transparent 30%),
    linear-gradient(rgba(20, 20, 22, 0.075) 1px, transparent 1px),
    linear-gradient(90deg, rgba(20, 20, 22, 0.075) 1px, transparent 1px),
    linear-gradient(180deg, #f9f9fb 0%, #f4f5f8 100%);
  background-size: auto, auto, auto, 88px 88px, 88px 88px, auto;
  background-attachment: fixed, fixed, fixed, fixed, fixed, scroll;
}

.content-shell::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.62) 0%, rgba(255, 255, 255, 0.14) 28%, rgba(255, 255, 255, 0.2) 100%);
}

.content-shell > * {
  position: relative;
  z-index: 1;
}
</style>
