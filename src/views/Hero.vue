<template>
  <div class="hero">
    <div class="hero-bg"></div>
    <div class="floating-elements">
      <div class="floating-element circle"></div>
      <div class="floating-element square"></div>
      <div class="floating-element diamond"></div>
    </div>
    <div class="hero-content">
      <h1
        class="hero-title xl:pt-[10px] pt-[200px]"
        :class="{ animate: isVisible }"
      >
        Evin Leyander
        <br />
        Full stack Developer
      </h1>
      <p class="hero-subtitle" :class="{ animate: isVisible }">
        With over 3 years of experience in full-stack development, I have built
        dynamic and responsive applications using a wide range of frameworks and
        libraries, including Vue 2, Vue 3, Next.js, React, and React Native. On the
        frontend, I specialize in crafting visually appealing and user-friendly
        interfaces with CSS frameworks such as Tailwind CSS, Bootstrap, and
        Vuetify. On the backend, I have hands-on experience with Node.js and
        MySQL, enabling me to design robust APIs and manage efficient database
        interactions. My full-stack skill set allows me to develop seamless,
        end-to-end web and mobile solutions tailored to user needs.
      </p>
      <div   class="cta-buttons-container " :class="{ animate: isVisible }">
        <a href="#works" class="cta-button interactive uppercase text-[15px]">
          Explore My Creations
        </a>
        <a
          href="/JEvinLeyander-Resume.pdf"
          download="JEvinLeyander-Resume.pdf"
          class="cta-button interactive download-cv-btn uppercase text-[15px]"
        >
          Download CV
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isVisible = ref(false);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 500);
});
</script>

<style scoped>
.hero {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* Keep this for absolute children */
  overflow: hidden; /* Keep this for containing elements */
  width: 100%; /* Ensure it takes 100% of its parent's width */
}

/* Background Gradient Animation */
.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120%; /* Slightly taller to accommodate potential parallax movement */
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24);
  background-size: 400% 400%; /* Allows for larger gradient movement */
  animation: gradientShift 8s ease infinite;
  opacity: 0.1; /* Subtle background */
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Floating Decorative Elements */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Allows clicks to pass through to content below */
}
@media (max-width: 768px) {
  .cta-buttons-container {
    flex-direction: column; /* Stack vertically */
    align-items: center;    /* Center align horizontally */
    gap: 1rem;
  }

  .cta-button {
    flex: none;             /* Remove forced flex sizing */
    width: 100%;            /* Make them stretch nicely */
    max-width: 250px;       /* Keep them from becoming too wide */
  }
}


.floating-element {
  position: absolute;
  opacity: 0.1; /* Subtle opacity for decorative elements */
  filter: blur(2px); /* Soften them slightly */
}

.floating-element.circle {
  top: 20%;
  left: 10%;
  width: 60px;
  height: 60px;
  background: #ff6b6b;
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.floating-element.square {
  top: 60%;
  right: 10%;
  width: 80px;
  height: 80px;
  background: #4ecdc4;
  border-radius: 20px;
  animation: float 8s ease-in-out infinite reverse;
}

.floating-element.diamond {
  bottom: 20%;
  left: 20%;
  width: 40px;
  height: 40px;
  background: #45b7d1;
  transform: rotate(45deg);
  animation: float 7s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

/* Hero Content Styling */
.hero-content {
  text-align: center;
  z-index: 10; /* Ensure content is above background and floating elements */
  max-width: 800px; /* Keep content readable and contained */
  padding: 0 2rem;
  color: #fff; /* Ensure text is visible against backgrounds */
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Subtle text shadow for contrast */
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  font-family: "DM Sans", sans-serif; /* Changed to DM Sans */
  -webkit-text-fill-color: transparent;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease;
}

.hero-title.animate {
  opacity: 1;
  transform: translateY(0);
}

.hero-subtitle {
  font-size: 1.1rem; /* Corrected typo from '11' */
  font-family: "DM Sans", sans-serif;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease 0.2s;
  line-height: 1.4;
}

.hero-subtitle.animate {
  opacity: 0.8;
  transform: translateY(0);
}

/* Container for multiple CTA buttons */
/* Ensure CTA buttons have equal width */
.cta-buttons-container {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease 0.4s;
}

.cta-button {
  display: inline-block;
  flex: 1; /* Make both buttons take equal width */
  text-align: center; /* Center text inside */
  min-width: 200px; /* Optional: enforce minimum size */
  max-width: 300px; /* Optional: keep it from stretching too much */
}


.cta-buttons-container.animate {
  opacity: 1;
  transform: translateY(0);
}


/* Call to Action Button */
.cta-button {
  display: inline-block;
  padding: 1rem 2.5rem; /* Slightly more padding for a bolder look */
  background: linear-gradient(
    45deg,
    #a855f7,
    #6366f1
  ); /* More vibrant gradient example */
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  letter-spacing: 0.05em; /* Slightly spaced letters */
  transition: all 0.3s ease;
  position: relative;
  
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); /* Initial subtle shadow */
}

/* No direct .cta-button.animate anymore, parent container handles it */
/* .cta-button.animate {
  opacity: 1;
  transform: translateY(0);
  transition: all 1s ease 0.4s, transform 0.3s ease, box-shadow 0.3s ease;
} */

.cta-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  ); /* Stronger hover shine */
  transition: left 0.5s ease;
}

.cta-button:hover::before {
  left: 100%;
}

.cta-button:hover {
  transform: translateY(-5px); /* Lift button on hover */
  box-shadow: 0 15px 40px rgba(168, 85, 247, 0.4); /* More prominent shadow on hover */
  background: linear-gradient(
    45deg,
    #6366f1,
    #a855f7
  ); /* Reverse gradient on hover */
}

/* Specific style for the download CV button if needed to differentiate */
.download-cv-btn {
  /* You can add different background, border, etc., if you want it to look distinct */
  background: linear-gradient(45deg, #4ecdc4, #45b7d1); /* Example: different gradient */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.download-cv-btn:hover {
  box-shadow: 0 15px 40px rgba(78, 205, 196, 0.4);
  background: linear-gradient(45deg, #45b7d1, #4ecdc4);
}


/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.8rem;
  }

  .hero-subtitle {
    font-size: 1rem; /* Adjusted for better readability on smaller screens */
  }

  .hero-content {
    padding: 0 1rem;
  }

  .cta-buttons-container {
    flex-direction: column; /* Stack buttons vertically */
    gap: 1rem; /* Adjust gap for vertical stacking */
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 0.9rem; /* Further adjustment for very small screens */
  }

}
</style>