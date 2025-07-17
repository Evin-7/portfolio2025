<template>
  <section id="works" class="min-h-screen bg-black text-white py-16 px-6">
    <div class="max-w-6xl mx-auto">
      <h2
        class="text-4xl font-bold text-center mb-12 tracking-wide"
        data-aos="fade-up"
      >
        My Work
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(project, index) in projects"
          :key="index"
          class="bg-[#0f0f0f] rounded-2xl overflow-hidden border border-green-500/30 shadow-lg hover:shadow-green-400/50 transition-shadow hover:scale-[1.02] duration-300"
          :data-aos="'fade-up'"
          :data-aos-delay="index * 100"
        >
          <a :href="project.link" target="_blank" class="block h-full group">
            <div class="relative overflow-hidden">
              <img
                :src="project.image"
                :alt="project.name"
                class="w-full h-52 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>
            </div>
            <div class="p-5">
              <h3 class="text-xl font-semibold mb-2 group-hover:text-green-400 transition-colors">
                {{ project.name }}
              </h3>
              <p class="text-sm text-gray-400">{{ project.description }}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
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

const projects = [
  {
    name: "Access Rooms",
    link: "https://accessrooms.com/",
    image: new URL("@/assets/images/9-min.png", import.meta.url).href,
    description: "Online houseboat booking platform",
  },
  {
    name: "Mudumalai Tiger Reserve",
    link: "https://www.mudumalaitigerreserve.com/",
    image: new URL("@/assets/images/8-min.png", import.meta.url).href,
    description: "Official website of the wildlife sanctuary",
  },
  {
    name: "Periyar Tiger Reserve",
    link: "https://www.periyartigerreserve.org/",
    image: new URL("@/assets/images/6-min.png", import.meta.url).href,
    description: "National park website for Periyar reserve",
  },
  {
    name: "GT School of Logistics",
    link: "https://www.gtschooloflogistics.com/",
    image: new URL("@/assets/images/4-min.png", import.meta.url).href,
    description: "Educational institute website",
  },
  {
    name: "Wissen ITC",
    link: "https://wissenitc.com/",
    image: new URL("@/assets/images/5-min.png", import.meta.url).href,
    description: "Construction and consulting firm site",
  },
  {
    name: "OLE Website",
    link: "https://olewebsite.leopardtechlabs.com/",
    image: new URL("@/assets/images/1-min.png", import.meta.url).href,
    description: "Official site for OLE project",
  },
  {
    name: "Admin Panel - Whale Shark",
    link: "https://whaleshark.leopardtechlabs.com",
    image: new URL("@/assets/images/2-min.png", import.meta.url).href,
    description: "Rescue application admin panel",
  },
  {
    name: "Poacher Portal - WTI",
    link: "https://poacher.wti.org.in/",
    image: new URL("@/assets/images/3-min.png", import.meta.url).href,
    description: "Wildlife Trust of India donation portal",
  },
  {
    name: "Mudumalai Admin Panel",
    link: "https://admin.mudumalaitigerreserve.com/",
    image: new URL("@/assets/images/10-min.png", import.meta.url).href,
    description: "Admin dashboard for sanctuary",
  },
];
</script>

<style scoped>
/* Custom scroll animation styles (optional) */
</style>
