<template>
  <div class="section works" :class="{ visible: isVisible }">
    <div class="container">
      <h2 class="section-title gradient-text">My Works</h2>
      <div class="works-grid">
        <a
          v-for="(work, index) in works"
          :key="index"
          :href="work.link"
          target="_blank"
          rel="noopener noreferrer"
          class="work-card glass-card hover-lift interactive"
          :class="{ animate: isVisible }"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="work-image-container">
            <img :src="work.image" :alt="work.name" class="work-image" />
          </div>
          <div class="work-content">
            <h3 class="work-title">{{ work.name }}</h3>
            <p class="work-description">{{ work.description }}</p>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isVisible = ref(false);

const works = ref([
  {
    name: "Mezeh App",
    link: "",
    image: new URL("../assets/images/mezehapp.png", import.meta.url).href,
    description: "A high-performance delivery app designed with a sleek interface and robust features to ensure a smooth and reliable user experience.",
  },
  {
    name: "Mezeh Catering",
    link: "https://catering.mezeh.com/",
    image: new URL("../assets/images/mezehcat.png", import.meta.url).href,
    description: "Catering platform for Mezeh Mediterranean Grill.",
  },
  {
    name: "Mezeh Frontend",
    link: "https://mezeh-frontend-production.azurewebsites.net/",
    image: new URL("../assets/images/mezehmeal.png", import.meta.url).href,
    description: "Frontend application for Mezeh Mediterranean Grill.",
  },

  
  {
    name: "Access Rooms",
    link: "https://accessrooms.com/",
    // Changed @/assets to ../assets
    image: new URL("../assets/images/9-min.png", import.meta.url).href,
    description: "Online houseboat booking platform",
  },
  {
    name: "Mudumalai Tiger Reserve",
    link: "https://www.mudumalaitigerreserve.com/",
    // Changed @/assets to ../assets
    image: new URL("../assets/images/8-min.png", import.meta.url).href,
    description: "Official website of the wildlife sanctuary",
  },
  {
    name: "Periyar Tiger Reserve",
    link: "https://www.periyartigerreserve.org/",
    // Changed @/assets to ../assets
    image: new URL("../assets/images/6-min.png", import.meta.url).href,
    description: "National park website for Periyar reserve",
  },
  
  {
    name: "Parambikulam Tiger Reserve",

    link: "https://www.parambikulam.org/",
    // Changed @/assets to ../assets
    image: new URL("../assets/images/paramb.png", import.meta.url).href,
    description: "National park website for Parambikulam reserve",
  },
  {
    name: "OLE Website",
    link: "https://olewebsite.leopardtechlabs.com/",
    // Changed @/assets to ../assets
    image: new URL("../assets/images/1-min.png", import.meta.url).href,
    description: "Official site for OLE project",
  },
  {
    name: "Admin Panel - Whale Shark",
    link: "https://whaleshark.leopardtechlabs.com",
    // Changed @/assets to ../assets
    image: new URL("../assets/images/2-min.png", import.meta.url).href,
    description: "Rescue application admin panel",
  },
  
  {
    name: "Mudumalai Admin Panel",
    link: "https://admin.mudumalaitigerreserve.com/",
    // Changed @/assets to ../assets
    image: new URL("../assets/images/10-min.png", import.meta.url).href,
    description: "Admin dashboard for sanctuary",
  },

  {
    name: "Flight MS",
    link: "https://flightms.netlify.app/flights",
    image: new URL("../assets/images/flightms.png", import.meta.url).href,
    description: "Flight Management System",
  },
  {
    name: "Vue Verse",
    link: "https://vueverseblogs-fd452c.netlify.app/",
    image: new URL("../assets/images/vueverse.png", import.meta.url).href,
    description: "Blog application",
  },

  {
    name: "Tech Blogs",
    link: "https://tech-blogs-init.netlify.app/",
    image: new URL("../assets/images/techblogs.png", import.meta.url).href,
    description: "Blog application",

  },
]);

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(document.querySelector(".works"));
});
</script>

<style scoped>
/* Your styles remain unchanged, as they were already correct */
.works {
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

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.work-card {
  display: flex; /* Make it a flex container */
  flex-direction: column; /* Stack image and text vertically */
  text-decoration: none; /* Remove underline from link */
  color: inherit; /* Inherit text color */
  padding: 0; /* Remove padding from card itself, apply to content */
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
  height: 100%; /* Ensure cards fill grid space */
}

.work-card.animate {
  opacity: 1;
  transform: translateY(0);
}

/* Image Container */
.work-image-container {
  width: 100%;
  height: 200px; /* Fixed height for image container */
  overflow: hidden;
  border-radius: 20px 20px 0 0; /* Match top radius of glass card */
  position: relative; /* For potential overlays */
  background-color: rgba(0, 0, 0, 0.2); /* Placeholder for transparent images */
}

.work-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Cover the container, cropping if necessary */
  display: block; /* Remove extra space below image */
  transition: transform 0.3s ease;
}

.work-card:hover .work-image {
  transform: scale(1.05); /* Subtle zoom on hover */
}

/* Content Area within the card */
.work-content {
  padding: 1.5rem; /* Padding for text content */
  flex-grow: 1; /* Allow content to grow and fill space */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Pushes description to bottom if title is short */
}

.work-title {
  font-size: 1.4rem; /* Slightly smaller for better fit */
  margin-bottom: 0.8rem;
  color: #ff6b6b; /* Accent color for title */
  position: relative;
  z-index: 2;
}

.work-description {
  font-size: 0.95rem; /* Slightly smaller for dense info */
  opacity: 0.8;
  line-height: 1.6;
  position: relative;
  z-index: 2;
}

/* Original Hover Effects (slightly adjusted for new structure) */
.work-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(255, 107, 107, 0.1),
    rgba(78, 205, 196, 0.1)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 20px; /* Apply to match card radius */
  z-index: 1; /* Ensure it's behind text, but over image container */
}

.work-card:hover::before {
  opacity: 1;
}

.work-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(255, 107, 107, 0.2);
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
  .works-grid {
    grid-template-columns: 1fr; /* Stack cards on smaller screens */
  }
}
</style>