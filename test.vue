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

  above is my orks use that please 


  <template>
    <div class="section works" :class="{ visible: isVisible }">
      <div class="container">
        <h2 class="section-title gradient-text">My Works</h2>
        <div class="works-grid">
          <div
            v-for="(work, index) in works"
            :key="work.id"
            class="work-card glass-card hover-lift interactive"
            :class="{ animate: isVisible }"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <h3 class="work-title">{{ work.title }}</h3>
            <p class="work-description">{{ work.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const isVisible = ref(false)
  
  const works = ref([
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A modern e-commerce solution built with React and Node.js, featuring real-time inventory management and seamless payment integration.'
    },
    {
      id: 2,
      title: 'Portfolio Website',
      description: 'A responsive portfolio website showcasing creative animations and smooth user interactions, built with Vue.js and modern CSS.'
    },
    {
      id: 3,
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.'
    },
    {
      id: 4,
      title: 'Weather Dashboard',
      description: 'An interactive weather dashboard with data visualization, location-based forecasts, and beautiful animated weather icons.'
    }
  ])
  
  onMounted(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true
        }
      },
      { threshold: 0.1 }
    )
    
    observer.observe(document.querySelector('.works'))
  })
  </script>
  
  <style scoped>
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
    padding: 2rem;
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
  }
  
  .work-card.animate {
    opacity: 1;
    transform: translateY(0);
  }
  
  .work-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .work-card:hover::before {
    opacity: 1;
  }
  
  .work-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(255, 107, 107, 0.2);
  }
  
  .work-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #ff6b6b;
    position: relative;
    z-index: 2;
  }
  
  .work-description {
    opacity: 0.8;
    line-height: 1.6;
    position: relative;
    z-index: 2;
  }
  
  @media (max-width: 768px) {
    .section-title {
      font-size: 2rem;
    }
  }
  </style>
  