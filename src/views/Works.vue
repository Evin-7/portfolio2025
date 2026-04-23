<template>
  <section class="works">
    <div class="works-shell">
      <div class="works-heading">
        <p class="works-eyebrow">Projects</p>
        <h2 class="works-title">Selected work.</h2>
      </div>

      <div class="works-grid">
        <a
          v-for="work in works"
          :key="work.name"
          :href="work.link"
          target="_blank"
          rel="noopener noreferrer"
          class="work-card interactive"
          :class="work.size"
          :style="cardStyle(work.name)"
          @mousemove="handleMove(work.name, $event)"
          @mouseleave="resetMove(work.name)"
        >
          <div class="work-image-wrap">
            <div class="laptop-frame">
              <div class="laptop-screen">
                <div class="laptop-camera"></div>
                <img :src="work.image" :alt="work.name" class="work-image" />
              </div>
              <div class="laptop-base">
                <div class="laptop-trackpad"></div>
              </div>
            </div>
          </div>
          <div class="work-copy">
            <p class="work-kicker">{{ work.kicker }}</p>
            <h3 class="work-title">{{ work.name }}</h3>
            <p class="work-description">{{ work.description }}</p>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const cardOffsets = ref({});

const defaultOffset = {
  "--image-x": "0px",
  "--image-y": "0px",
};

const cardStyle = (key) => cardOffsets.value[key] || defaultOffset;

const handleMove = (key, event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;

  cardOffsets.value[key] = {
    "--image-x": `${x * 12}px`,
    "--image-y": `${y * 12}px`,
  };
};

const resetMove = (key) => {
  cardOffsets.value[key] = defaultOffset;
};

const works = [
  {
    name: "Peniel Tech",
    link: "https://www.penieltech.com/",
    image: new URL("../assets/images/penieltech-shot.png", import.meta.url).href,
    description: "Corporate site for IT products and solutions.",
    kicker: "Company",
    size: "span-wide",
  },
  {
    name: "Oh Yes World",
    link: "https://ohyesworld.com/",
    image: new URL("../assets/images/ohyesworld.png", import.meta.url).href,
    description: "Brand website with a service-led product feel.",
    kicker: "Business",
    size: "span-regular",
  },
  {
    name: "Home Maintenance",
    link: "https://homemaintenance.ohyesworld.com/",
    image: new URL("../assets/images/homemaintaince.png", import.meta.url).href,
    description: "Home services website with strong conversion focus.",
    kicker: "Service",
    size: "span-regular",
  },
  {
    name: "Mezeh App",
    link: "https://mezeh.com/",
    image: new URL("../assets/images/mezehapp.png", import.meta.url).href,
    description: "Delivery-focused product UI.",
    kicker: "Mobile Product",
    size: "span-wide",
  },
  {
    name: "Mezeh Catering",
    link: "https://catering.mezeh.com/",
    image: new URL("../assets/images/mezehcat.png", import.meta.url).href,
    description: "Catering ordering platform.",
    kicker: "Food Platform",
    size: "span-regular",
  },
  {
    name: "Mezeh Frontend",
    link: "https://mezeh-frontend-production.azurewebsites.net/",
    image: new URL("../assets/images/mezehmeal.png", import.meta.url).href,
    description: "Branded customer frontend.",
    kicker: "Frontend",
    size: "span-regular",
  },
  {
    name: "Access Rooms",
    link: "https://accessrooms.com/",
    image: new URL("../assets/images/9-min.png", import.meta.url).href,
    description: "Houseboat booking platform.",
    kicker: "Travel",
    size: "span-regular",
  },
  {
    name: "Mudumalai Tiger Reserve",
    link: "https://www.mudumalaitigerreserve.com/",
    image: new URL("../assets/images/8-min.png", import.meta.url).href,
    description: "Tourism website for the reserve.",
    kicker: "Website",
    size: "span-regular",
  },
  {
    name: "Periyar Tiger Reserve",
    link: "https://www.periyartigerreserve.org/",
    image: new URL("../assets/images/6-min.png", import.meta.url).href,
    description: "National park website.",
    kicker: "Website",
    size: "span-regular",
  },
  {
    name: "Parambikulam Tiger Reserve",
    link: "https://www.parambikulam.org/",
    image: new URL("../assets/images/paramb.png", import.meta.url).href,
    description: "Reserve website.",
    kicker: "Website",
    size: "span-regular",
  },
  {
    name: "OLE Website",
    link: "https://olewebsite.leopardtechlabs.com/",
    image: new URL("../assets/images/1-min.png", import.meta.url).href,
    description: "Brand website.",
    kicker: "Brand",
    size: "span-regular",
  },
  {
    name: "Admin Panel - Whale Shark",
    link: "https://whaleshark.leopardtechlabs.com",
    image: new URL("../assets/images/2-min.png", import.meta.url).href,
    description: "Operations dashboard.",
    kicker: "Dashboard",
    size: "span-regular",
  },
  {
    name: "Mudumalai Admin Panel",
    link: "https://admin.mudumalaitigerreserve.com/",
    image: new URL("../assets/images/10-min.png", import.meta.url).href,
    description: "Admin workflow panel.",
    kicker: "Dashboard",
    size: "span-regular",
  },
];
</script>

<style scoped>
.works {
  padding: 5.5rem 1.5rem;
  background: #fbfbfd;
}

.works-shell {
  max-width: 980px;
  margin: 0 auto;
}

.works-heading {
  text-align: center;
  margin-bottom: 2.5rem;
}

.works-eyebrow {
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6e6e73;
}

.works-title {
  margin-top: 0.9rem;
  font-size: clamp(2.3rem, 5vw, 4.2rem);
  line-height: 1;
  letter-spacing: -0.04em;
  color: #1d1d1f;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  gap: 0.5rem;
}

.work-card {
  display: block;
  grid-column: span 2;
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.span-wide {
  grid-column: span 3;
}

.work-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(29, 29, 31, 0.07);
}

.work-image-wrap {
  aspect-ratio: 1.58 / 1;
  background: linear-gradient(180deg, #f7f7f9 0%, #f2f2f5 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 0.4rem 0.25rem;
}

.span-wide .work-image-wrap {
  aspect-ratio: 1.78 / 1;
}

.laptop-frame {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  filter: drop-shadow(0 10px 18px rgba(29, 29, 31, 0.1));
}

.laptop-screen {
  position: relative;
  width: 88%;
  aspect-ratio: 1.55 / 1;
  border-radius: 0.65rem 0.65rem 0.3rem 0.3rem;
  background: #111214;
  border: 1px solid rgba(17, 18, 20, 0.18);
  padding: 0.22rem;
  overflow: hidden;
}

.span-wide .laptop-screen {
  width: 84%;
}

.laptop-camera {
  position: absolute;
  top: 0.13rem;
  left: 50%;
  width: 18%;
  max-width: 2.3rem;
  height: 0.24rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(-50%);
  z-index: 2;
}

.work-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: translate3d(var(--image-x), var(--image-y), 0) scale(1.015);
  transition: transform 0.25s ease;
  border-radius: 0.42rem 0.42rem 0.18rem 0.18rem;
}

.laptop-base {
  position: relative;
  width: 100%;
  height: 0.75rem;
  margin-top: -0.02rem;
  border-radius: 0 0 1rem 1rem;
  background: linear-gradient(180deg, #d9d9df 0%, #bfc1c8 100%);
}

.laptop-base::before {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -0.12rem;
  width: 34%;
  height: 0.14rem;
  border-radius: 999px;
  background: rgba(29, 29, 31, 0.12);
  transform: translateX(-50%);
}

.laptop-trackpad {
  position: absolute;
  top: 0.14rem;
  left: 50%;
  width: 18%;
  height: 0.18rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.55);
  transform: translateX(-50%);
}

.work-copy {
  padding: 0.58rem 0.62rem 0.68rem;
}

.work-kicker {
  font-size: 0.54rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6e6e73;
}

.work-title {
  margin-top: 0.22rem;
  font-size: 0.78rem;
  line-height: 1.15;
  color: #1d1d1f;
}

.work-description {
  margin-top: 0.22rem;
  font-size: 0.66rem;
  line-height: 1.25;
  color: #6e6e73;
}

@media (max-width: 1100px) {
  .works-grid {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }

  .span-wide {
    grid-column: span 2;
  }
}

@media (max-width: 780px) {
  .works-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .work-card,
  .span-wide {
    grid-column: span 2;
  }
}

@media (max-width: 640px) {
  .works-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .work-card,
  .span-wide {
    grid-column: span 1;
  }

  .work-image-wrap,
  .span-wide .work-image-wrap {
    aspect-ratio: 1.5 / 1;
    padding: 0.45rem 0.28rem 0.22rem;
  }

  .laptop-screen,
  .span-wide .laptop-screen {
    width: 92%;
  }

  .work-description {
    display: none;
  }
}
</style>
