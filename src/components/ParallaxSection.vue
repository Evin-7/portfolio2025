<template>
    <section class="relative h-screen overflow-hidden">
      <div
        ref="rellaxRef"
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundColor: '#ffffff' }"
        :data-rellax-speed="speed"
      ></div>
  
      <div class="relative z-10 h-full flex items-center justify-center">
        <slot />
      </div>
    </section>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import Rellax from 'rellax'
  
  const props = defineProps({
    background: String,
    speed: {
      type: Number,
      default: -2,
    },
  })
  
  const rellaxRef = ref(null)
  
  onMounted(() => {
    if (rellaxRef.value) {
      new Rellax(rellaxRef.value, {
        center: true,
        speed: props.speed,
      })
    }
  })
  </script>
  
