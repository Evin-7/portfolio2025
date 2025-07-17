<template>
  <section
    id="hero"
    class="min-h-screen flex flex-col justify-center items-center bg-black text-white text-center px-4"
  >
    <h1
      class="text-5xl sm:text-6xl font-extrabold mb-4 tracking-tight leading-tight bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text animate-fade-up"
      data-aos="fade-up"
    >
      Hi, I’m Evin Leyander
    </h1>

    <p
      class="text-lg sm:text-xl text-gray-400 mt-2 animate-fade-up"
      data-aos="fade-up"
      data-aos-delay="200"
    >
      Full Stack Developer • Vue | React | React Native | Node
    </p>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import AOS from "aos";
import "aos/dist/aos.css";

onMounted(() => {
  AOS.init({
    duration: 1000,
    once: true,
  });
});
</script>

<style scoped>
@keyframes fade-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-up {
  animation: fade-up 1s ease-out both;
}
</style>
