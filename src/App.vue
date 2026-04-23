<template>
  <div class="app">
    <div class="page-shell">
      <Navbar />
      <section id="home"><Hero /></section>
      <section id="about"><About /></section>
      <section id="skills"><Skills /></section>
      <section id="works"><Works /></section>
      <section id="contact"><Contact /></section>
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
  font-family: "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont,
    "Helvetica Neue", Arial, sans-serif;
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
</style>
