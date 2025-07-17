<template>
  <div class="scroll-smooth">
    <Navbar />
    
    <section id="hero"><Hero /></section>
    <section id="about"><About /></section>
    <section id="works"><Works /></section>
    <section id="contact"><Contact /></section>
    
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import Hero from './views/Hero.vue'
import About from './views/About.vue'
import Works from './views/Works.vue'
import Contact from './views/Contact.vue'
</script>
