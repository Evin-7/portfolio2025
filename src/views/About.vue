<template>
  <div class="section about" :class="{ visible: isVisible }">
    <div class="container">
      <h2 class="section-title gradient-text">About Me</h2>
      <div class="about-content">
        <div class="about-text">
          <p class="fade-in" :class="{ animate: isVisible }">
            I'm a passionate developer who loves creating beautiful, functional,
            and user-friendly digital experiences. With expertise in modern web
            technologies and a keen eye for design, I bring ideas to life
            through code.
          </p>
          <p
            class="fade-in"
            :class="{ animate: isVisible }"
            style="animation-delay: 0.2s"
          >
            My journey in web development has been driven by curiosity and a
            desire to solve problems creatively. I specialize in front-end
            development, UX/UI design, and creating seamless user experiences.
          </p>
        </div>

        <div
          class="about-image glass-card hover-lift"
          :class="{ animate: isVisible }"
          style="animation-delay: 0.4s"
        >
          <img
            src="../assets/images/evin.jpeg"
            alt="Evin Leyander - Software Engineer"
            class="profile-photo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isVisible = ref(false);

const profileImage = new URL("@/assets/images/evin.jpeg", import.meta.url).href;

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(document.querySelector(".about"));
});
</script>

<style scoped>
.about {
  padding: 5rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about-text {
  font-size: 1.2rem;
  line-height: 1.8;
}

.about-text p {
  margin-bottom: 1.5rem;
}

.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
}

.fade-in.animate {
  opacity: 0.9;
  transform: translateY(0);
}

.about-image {
  width: 100%;
  height: 400px; /* Fixed height for consistency */
  border-radius: 20px;
  overflow: hidden; /* Ensures image respects border-radius */
  position: relative; /* For containing the image and potential overlays */
  display: flex; /* To center content if image doesn't fill perfectly */
  align-items: center;
  justify-content: center;
  /* Removed original background gradient as image will cover it */

  /* Added animation for the image container itself */
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.about-image.animate {
  opacity: 1;
  transform: translateY(0);
}

.profile-photo {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the image covers the entire container without distortion */
  display: block; /* Removes extra space below image */
  border-radius: 20px; /* Match container border-radius */
  filter: grayscale(20%) brightness(90%); /* Subtle professional filter */
  transition: transform 0.5s ease, filter 0.5s ease;
}

.about-image:hover .profile-photo {
  transform: scale(1.05); /* Slight zoom on hover */
  filter: grayscale(0%) brightness(100%); /* Restore color on hover */
}

/* Optional: If you want a subtle colored overlay on the image for a techy look */
/*
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(255, 107, 107, 0.2), rgba(78, 205, 196, 0.2));
  mix-blend-mode: multiply; // Blends nicely with the image
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 20px;
}
.about-image:hover .image-overlay {
  opacity: 1;
}
*/

@media (max-width: 768px) {
  .about-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .section-title {
    font-size: 2rem;
  }

  .about-image {
    height: 300px; /* Adjust height for smaller screens */
  }
}
</style>