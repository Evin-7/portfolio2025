<template>
  <section class="works">
    <div class="works-shell">
      <div class="works-heading">
        <div>
          <p class="works-eyebrow">Projects</p>
          <h2 class="works-title">Selected work.</h2>
        </div>
      </div>

      <div class="works-grid">
        <a
          v-for="work in works"
          :key="work.name"
          :href="work.link"
          target="_blank"
          rel="noopener noreferrer"
          class="work-card interactive"
          :style="workCardStyle(work)"
          @mousemove="handleMove(work.name, $event)"
          @mouseleave="resetMove(work.name)"
        >
          <div class="work-card-inner">
            <div class="work-copy">
              <h3 class="work-title">{{ work.name }}</h3>
            </div>

            <div class="work-media">
              <div class="laptop-frame">
                <div class="laptop-screen-shell">
                  <div class="laptop-topbar">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div class="laptop-camera"></div>
                  <img :src="work.image" :alt="work.name" class="work-image" />
                </div>
                <div class="laptop-base">
                  <div class="laptop-trackpad"></div>
                </div>
              </div>
            </div>

            <div class="work-footer">
              <div class="work-cta">
                <span>Visit</span>
                <strong>↗</strong>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const cardOffsets = ref({});
const motionEnabled = ref(true);
let motionQuery;

const defaultOffset = {
  "--image-x": "0px",
  "--image-y": "0px",
};

const syncMotionPreference = () => {
  if (!motionQuery) {
    return;
  }

  motionEnabled.value = !motionQuery.matches;

  if (!motionEnabled.value) {
    cardOffsets.value = {};
  }
};

const handleMove = (key, event) => {
  if (!motionEnabled.value) {
    return;
  }

  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;

  cardOffsets.value[key] = {
    "--image-x": `${x * 14}px`,
    "--image-y": `${y * 14}px`,
  };
};

const resetMove = (key) => {
  cardOffsets.value[key] = defaultOffset;
};

const workCardStyle = (work) => ({
  ...defaultOffset,
  ...(cardOffsets.value[work.name] || {}),
  "--work-accent": work.accent,
  "--work-accent-soft": work.accentSoft,
});

onMounted(() => {
  motionQuery = window.matchMedia("(max-width: 768px), (pointer: coarse), (prefers-reduced-motion: reduce)");
  syncMotionPreference();
  motionQuery.addEventListener("change", syncMotionPreference);
});

onUnmounted(() => {
  motionQuery?.removeEventListener("change", syncMotionPreference);
});

const works = [
  {
    name: "Peniel Tech",
    link: "https://www.penieltech.com/",
    image: new URL("../assets/images/penieltech-shot.png", import.meta.url).href,
    description: "Corporate site for IT products and solution architecture with a clearer trust-building story.",
    kicker: "Flagship Website",
    year: "2026",
    focus: "Company Platform",
    tags: ["Frontend", "Brand", "Responsive"],
    accent: "#0f172a",
    accentSoft: "#e8eefc",
  },
  {
    name: "Mezeh App",
    link: "https://mezeh.com/",
    image: new URL("../assets/images/mezehapp.png", import.meta.url).href,
    description: "Delivery-led experience with stronger product framing and mobile-first commerce flows.",
    kicker: "Product UI",
    year: "2025",
    focus: "Consumer App",
    tags: ["Product", "Ordering", "Mobile"],
    accent: "#5b2333",
    accentSoft: "#f8e6eb",
  },
  {
    name: "Oh Yes World",
    link: "https://ohyesworld.com/",
    image: new URL("../assets/images/ohyesworld.png", import.meta.url).href,
    description: "Service-led business site with a cleaner narrative rhythm and polished premium feel.",
    kicker: "Business Website",
    year: "2025",
    focus: "Marketing Site",
    tags: ["Brand", "Service", "CMS"],
    accent: "#17352c",
    accentSoft: "#e5f3ed",
  },
  {
    name: "Home Maintenance",
    link: "https://homemaintenance.ohyesworld.com/",
    image: new URL("../assets/images/homemaintaince.png", import.meta.url).href,
    description: "Conversion-focused service website built for clarity, trust, and quick decision making.",
    kicker: "Service Platform",
    year: "2025",
    focus: "Lead Generation",
    tags: ["Services", "Conversion", "UI"],
    accent: "#7c3a13",
    accentSoft: "#fff1e8",
  },
  {
    name: "Mezeh Catering",
    link: "https://catering.mezeh.com/",
    image: new URL("../assets/images/mezehcat.png", import.meta.url).href,
    description: "Ordering experience for large-format catering with cleaner customer journey framing.",
    kicker: "Food Platform",
    year: "2025",
    focus: "Ordering System",
    tags: ["Catering", "Checkout", "Frontend"],
    accent: "#5a2b28",
    accentSoft: "#f8e8e6",
  },
  {
    name: "Mezeh Frontend",
    link: "https://mezeh-frontend-production.azurewebsites.net/",
    image: new URL("../assets/images/mezehmeal.png", import.meta.url).href,
    description: "Branded customer-facing frontend with consistent product hierarchy and browsing flow.",
    kicker: "Frontend System",
    year: "2025",
    focus: "Customer Flow",
    tags: ["Frontend", "UI", "Brand"],
    accent: "#20423b",
    accentSoft: "#e7f4f0",
  },
  {
    name: "Access Rooms",
    link: "https://accessrooms.com/",
    image: new URL("../assets/images/9-min.png", import.meta.url).href,
    description: "Booking experience with a lighter layout and hospitality-first browsing cues.",
    kicker: "Travel Product",
    year: "2024",
    focus: "Booking Site",
    tags: ["Travel", "Booking", "Responsive"],
    accent: "#103b56",
    accentSoft: "#e6f2fa",
  },
  {
    name: "Periyar Tiger Reserve",
    link: "https://www.periyartigerreserve.org/",
    image: new URL("../assets/images/6-min.png", import.meta.url).href,
    description: "Destination website shaped around discoverability, scenic storytelling, and simple navigation.",
    kicker: "Tourism Website",
    year: "2024",
    focus: "Information Design",
    tags: ["Tourism", "Content", "UI"],
    accent: "#214b32",
    accentSoft: "#e6f3ea",
  },
  {
    name: "St George CSI Church",
    link: "https://stgeorgecsichurchofficial.com/",
    image: new URL("../assets/images/stgeorgecsichurch.png", import.meta.url).href,
    description: "Church website focused on clarity, community updates, and a more welcoming information flow.",
    kicker: "Community Website",
    year: "2025",
    focus: "Information Design",
    tags: ["Community", "Content", "UI"],
    accent: "#5c3b1f",
    accentSoft: "#f8eee3",
  },
  {
    name: "Mudumalai Tiger Reserve",
    link: "https://www.mudumalaitigerreserve.com/",
    image: new URL("../assets/images/mudumalai.png", import.meta.url).href,
    description: "Wildlife destination site designed around scenic storytelling and easier visitor exploration.",
    kicker: "Tourism Website",
    year: "2025",
    focus: "Visitor Experience",
    tags: ["Tourism", "Wildlife", "Responsive"],
    accent: "#2a4a2f",
    accentSoft: "#e7f3e8",
  },
  {
    name: "Parambikulam Tiger Reserve",
    link: "https://parambikulam.org/",
    image: new URL("../assets/images/parambikulam.png", import.meta.url).href,
    description: "Destination platform shaped for discoverability, bookings, and clearer content hierarchy.",
    kicker: "Reserve Website",
    year: "2025",
    focus: "Visitor Platform",
    tags: ["Tourism", "Booking", "Content"],
    accent: "#274d3e",
    accentSoft: "#e6f3ef",
  },
  {
    name: "Admin Panel - Whale Shark",
    link: "https://whaleshark.leopardtechlabs.com",
    image: new URL("../assets/images/2-min.png", import.meta.url).href,
    description: "Operations dashboard designed around fast scanning, clearer metrics, and admin workflows.",
    kicker: "Dashboard",
    year: "2024",
    focus: "Admin System",
    tags: ["Dashboard", "Ops", "Data"],
    accent: "#29235c",
    accentSoft: "#ece9ff",
  },
];
</script>

<style scoped>
.works {
  padding: 5rem 1.5rem;
  background:
    radial-gradient(circle at top left, rgba(216, 178, 95, 0.08), transparent 28%),
    linear-gradient(180deg, #f7f8fb 0%, #ffffff 100%);
}

.works-shell {
  max-width: 1040px;
  margin: 0 auto;
}

.works-heading {
  display: block;
  margin-bottom: 2.2rem;
}

.works-eyebrow {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6e6e73;
}

.works-title {
  margin-top: 0.8rem;
  font-size: clamp(1.8rem, 3vw, 3rem);
  line-height: 0.96;
  letter-spacing: -0.05em;
  color: #121214;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.work-card {
  position: relative;
  text-decoration: none;
  color: inherit;
  min-height: 244px;
  border-radius: 22px;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(248, 248, 250, 0.94) 100%),
    var(--work-accent-soft);
  border: 1px solid rgba(18, 18, 20, 0.06);
  box-shadow:
    0 24px 70px rgba(24, 24, 28, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.work-card::before {
  content: "";
  position: absolute;
  inset: -20% auto auto -8%;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--work-accent) 18%, white) 0%, transparent 72%);
  opacity: 0.8;
  pointer-events: none;
}

.work-card-inner {
  position: relative;
  z-index: 1;
  height: 100%;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 1rem;
  padding: 1rem;
}

.work-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
}

.work-title {
  font-size: clamp(0.88rem, 1.15vw, 1.15rem);
  line-height: 1.15;
  letter-spacing: -0.04em;
  color: #121214;
}
.work-media {
  min-height: 0;
  display: flex;
  align-items: center;
}

.laptop-frame {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  filter: drop-shadow(0 18px 30px rgba(17, 17, 20, 0.14));
}

.laptop-screen-shell {
  position: relative;
  width: 92%;
  aspect-ratio: 1.56 / 1;
  padding: 0.42rem 0.42rem 0.32rem;
  border-radius: 16px 16px 10px 10px;
  background: linear-gradient(180deg, rgba(17, 17, 19, 0.98) 0%, rgba(26, 26, 30, 0.98) 100%);
  box-shadow:
    0 18px 40px rgba(17, 17, 20, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.laptop-screen-shell::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  height: 32%;
  background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.04) 100%);
  pointer-events: none;
}

.laptop-topbar {
  display: flex;
  gap: 0.38rem;
  padding: 0 0 0.4rem 0.08rem;
}

.laptop-topbar span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.24);
}

.laptop-topbar span:nth-child(1) {
  background: #ff6b57;
}

.laptop-topbar span:nth-child(2) {
  background: #febc2e;
}

.laptop-topbar span:nth-child(3) {
  background: #28c840;
}

.laptop-camera {
  position: absolute;
  top: 0.18rem;
  left: 50%;
  width: 18%;
  max-width: 2rem;
  height: 0.18rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.09);
  transform: translateX(-50%);
}

.work-image {
  width: 100%;
  height: calc(100% - 13px);
  object-fit: contain;
  object-position: center center;
  display: block;
  padding: 0.25rem;
  border-radius: 12px;
  background: #ffffff;
  transform: translate3d(var(--image-x), var(--image-y), 0) scale(1.02);
  transform-origin: center;
  transition: transform 0.28s ease;
}

.laptop-base {
  position: relative;
  width: 100%;
  height: 0.72rem;
  margin-top: -0.02rem;
  border-radius: 0 0 1rem 1rem;
  background: linear-gradient(180deg, #d7d9e0 0%, #bcc0c8 100%);
}

.laptop-base::before {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -0.08rem;
  width: 34%;
  height: 0.12rem;
  border-radius: 999px;
  background: rgba(17, 17, 20, 0.12);
  transform: translateX(-50%);
}

.laptop-trackpad {
  position: absolute;
  top: 0.12rem;
  left: 50%;
  width: 18%;
  height: 0.16rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.58);
  transform: translateX(-50%);
}

.work-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-left: auto;
  padding: 0.55rem 0.75rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(18, 18, 20, 0.05);
  color: #22242a;
}

.work-cta span,
.work-cta strong {
  margin: 0;
  font-size: 0.68rem;
  font-weight: 700;
}

@media (hover: hover) and (pointer: fine) {
  .work-card:hover {
    transform: translateY(-5px);
    border-color: color-mix(in srgb, var(--work-accent) 20%, rgba(18, 18, 20, 0.06));
    box-shadow:
      0 32px 80px rgba(24, 24, 28, 0.09),
      inset 0 1px 0 rgba(255, 255, 255, 0.85);
  }
}

@media (max-width: 1100px) {
  .works-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 780px) {
  .works {
    padding: 4.4rem 1.2rem;
  }

  .works-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .work-card-inner {
    padding: 1rem;
  }

  .laptop-screen-shell {
    width: 100%;
  }
}

@media (max-width: 520px) {
  .works-title {
    font-size: 2.25rem;
  }

  .work-title {
    font-size: 1.1rem;
  }

  .work-description {
    font-size: 0.88rem;
  }

  .laptop-screen-shell {
    aspect-ratio: 1.52 / 1;
  }
}

@media (hover: none), (pointer: coarse), (max-width: 768px) {
  .work-image {
    transform: none;
    transition: none;
  }
}
</style>
