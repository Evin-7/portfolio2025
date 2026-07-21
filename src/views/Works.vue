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
});

onMounted(() => {
  motionQuery = window.matchMedia(
    "(max-width: 768px), (pointer: coarse), (prefers-reduced-motion: reduce)"
  );
  syncMotionPreference();
  motionQuery.addEventListener("change", syncMotionPreference);
});

onUnmounted(() => {
  motionQuery?.removeEventListener("change", syncMotionPreference);
});

const works = [
  {
    name: "Elate HRMS",
    link: "https://hrms.ae/",
    image: new URL("../assets/images/hrms.ae.png", import.meta.url).href,
    description:
      "AI-powered HRMS platform for UAE businesses, covering payroll, leave, recruitment, and attendance.",
    kicker: "HRMS Platform",
    year: "2026",
    focus: "Human Resources",
    tags: ["HRMS", "Payroll", "SaaS"],
  },
  {
    name: "Elate HRMS UAE",
    link: "https://elatehrms.com/",
    image: new URL("../assets/images/elatehrms.com.png", import.meta.url).href,
    description:
      "UAE-focused HR software bringing employee records, workflows, and payroll into one organized system.",
    kicker: "Business Platform",
    year: "2026",
    focus: "HR Operations",
    tags: ["UAE", "HR", "Workflows"],
  },
  {
    name: "Elate Time",
    link: "https://elatetime.com/",
    image: new URL("../assets/images/elatetime.com.png", import.meta.url).href,
    description:
      "Attendance and leave management experience for teams across web, mobile, and biometric devices.",
    kicker: "Attendance Platform",
    year: "2026",
    focus: "Workforce Time",
    tags: ["Attendance", "Mobile", "Analytics"],
  },
  {
    name: "Elate Time Portal",
    link: "https://app.elatetime.com/login?next=%2F",
    image: new URL("../assets/images/app.elatetime.png", import.meta.url).href,
    description:
      "Sign-in portal for employee attendance, leave, and workforce-time management.",
    kicker: "Employee Portal",
    year: "2026",
    focus: "Time Tracking",
    tags: ["Portal", "Attendance", "Employees"],
  },
  {
    name: "Elate HRMS Dashboard",
    link: "https://app.elatehrms.com/dashboard",
    image: new URL("../assets/images/app.elatehrms.com.png", import.meta.url)
      .href,
    description:
      "Operations workspace for recruitment, onboarding, employee records, payroll, and HR reporting.",
    kicker: "Admin Dashboard",
    year: "2026",
    focus: "HR Operations",
    tags: ["Dashboard", "Employees", "Payroll"],
  },
  {
    name: "Abez Auto",
    link: "https://abezauto.com/",
    image: new URL("../assets/images/abezauto.com.png", import.meta.url).href,
    description:
      "Premium auto-parts storefront with vehicle-specific discovery, products, and conversion kits.",
    kicker: "E-commerce Platform",
    year: "2026",
    focus: "Auto Parts Store",
    tags: ["E-commerce", "Automotive", "Search"],
  },
  {
    name: "Peniel Tech",
    link: "https://www.penieltech.com/",
    image: new URL("../assets/images/penieltech-shot.png", import.meta.url)
      .href,
    description:
      "Corporate site for IT products and solution architecture with a clearer trust-building story.",
    kicker: "Flagship Website",
    year: "2026",
    focus: "Company Platform",
    tags: ["Frontend", "Brand", "Responsive"],
  },
  {
    name: "Mezeh App",
    link: "https://mezeh.com/",
    image: new URL("../assets/images/mezehapp.png", import.meta.url).href,
    description:
      "Delivery-led experience with stronger product framing and mobile-first commerce flows.",
    kicker: "Product UI",
    year: "2025",
    focus: "Consumer App",
    tags: ["Product", "Ordering", "Mobile"],
  },
  {
    name: "Oh Yes World",
    link: "https://ohyesworld.com/",
    image: new URL("../assets/images/ohyesworld.png", import.meta.url).href,
    description:
      "Service-led business site with a cleaner narrative rhythm and polished premium feel.",
    kicker: "Business Website",
    year: "2025",
    focus: "Marketing Site",
    tags: ["Brand", "Service", "CMS"],
  },
  {
    name: "Home Maintenance",
    link: "https://homemaintenance.ohyesworld.com/",
    image: new URL("../assets/images/homemaintaince.png", import.meta.url).href,
    description:
      "Conversion-focused service website built for clarity, trust, and quick decision making.",
    kicker: "Service Platform",
    year: "2025",
    focus: "Lead Generation",
    tags: ["Services", "Conversion", "UI"],
  },
  {
    name: "Mezeh Catering",
    link: "https://catering.mezeh.com/",
    image: new URL("../assets/images/mezehcat.png", import.meta.url).href,
    description:
      "Ordering experience for large-format catering with cleaner customer journey framing.",
    kicker: "Food Platform",
    year: "2025",
    focus: "Ordering System",
    tags: ["Catering", "Checkout", "Frontend"],
  },
  {
    name: "Mezeh Frontend",
    link: "https://mezeh-frontend-production.azurewebsites.net/",
    image: new URL("../assets/images/mezehmeal.png", import.meta.url).href,
    description:
      "Branded customer-facing frontend with consistent product hierarchy and browsing flow.",
    kicker: "Frontend System",
    year: "2025",
    focus: "Customer Flow",
    tags: ["Frontend", "UI", "Brand"],
  },
  {
    name: "Access Rooms",
    link: "https://accessrooms.com/",
    image: new URL("../assets/images/9-min.png", import.meta.url).href,
    description:
      "Booking experience with a lighter layout and hospitality-first browsing cues.",
    kicker: "Travel Product",
    year: "2024",
    focus: "Booking Site",
    tags: ["Travel", "Booking", "Responsive"],
  },
  {
    name: "Periyar Tiger Reserve",
    link: "https://www.periyartigerreserve.org/",
    image: new URL("../assets/images/6-min.png", import.meta.url).href,
    description:
      "Destination website shaped around discoverability, scenic storytelling, and simple navigation.",
    kicker: "Tourism Website",
    year: "2024",
    focus: "Information Design",
    tags: ["Tourism", "Content", "UI"],
  },
  {
    name: "St George CSI Church",
    link: "https://stgeorgecsichurchofficial.com/",
    image: new URL("../assets/images/stgeorgecsichurch.png", import.meta.url)
      .href,
    description:
      "Church website focused on clarity, community updates, and a more welcoming information flow.",
    kicker: "Community Website",
    year: "2025",
    focus: "Information Design",
    tags: ["Community", "Content", "UI"],
  },
  {
    name: "Mudumalai Tiger Reserve",
    link: "https://www.mudumalaitigerreserve.com/",
    image: new URL("../assets/images/mudumalai.png", import.meta.url).href,
    description:
      "Wildlife destination site designed around scenic storytelling and easier visitor exploration.",
    kicker: "Tourism Website",
    year: "2025",
    focus: "Visitor Experience",
    tags: ["Tourism", "Wildlife", "Responsive"],
  },
  {
    name: "Parambikulam Tiger Reserve",
    link: "https://parambikulam.org/",
    image: new URL("../assets/images/parambikulam.png", import.meta.url).href,
    description:
      "Destination platform shaped for discoverability, bookings, and clearer content hierarchy.",
    kicker: "Reserve Website",
    year: "2025",
    focus: "Visitor Platform",
    tags: ["Tourism", "Booking", "Content"],
  },
  {
    name: "Admin Panel - Whale Shark",
    link: "https://whaleshark.leopardtechlabs.com",
    image: new URL("../assets/images/2-min.png", import.meta.url).href,
    description:
      "Operations dashboard designed around fast scanning, clearer metrics, and admin workflows.",
    kicker: "Dashboard",
    year: "2024",
    focus: "Admin System",
    tags: ["Dashboard", "Ops", "Data"],
  },
];
</script>

<style scoped>
.works {
  padding: 5rem 1.5rem;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.works::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 50% 0%,
    rgba(212, 175, 55, 0.03) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.works-shell {
  max-width: 1040px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.works-heading {
  display: block;
  margin-bottom: 2.2rem;
  animation: slideInUp 0.8s ease-out 0.2s both;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.works-eyebrow {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.works-title {
  margin-top: 0.8rem;
  font-size: clamp(1.8rem, 3vw, 3rem);
  line-height: 0.96;
  letter-spacing: -0.05em;
  color: var(--text-primary);
  background: linear-gradient(
    135deg,
    var(--text-primary) 0%,
    var(--gold-light) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.work-card {
  position: relative;
  text-decoration: none;
  color: inherit;
  min-height: 244px;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    var(--bg-surface) 0%,
    rgba(26, 26, 26, 0.8) 100%
  );
  border: 1.5px solid var(--gold-border);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  backdrop-filter: blur(10px);
  animation: cardReveal 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(50px);
}

.work-card:nth-child(1) {
  animation-delay: 0.1s;
}
.work-card:nth-child(2) {
  animation-delay: 0.2s;
}
.work-card:nth-child(3) {
  animation-delay: 0.3s;
}
.work-card:nth-child(4) {
  animation-delay: 0.4s;
}
.work-card:nth-child(5) {
  animation-delay: 0.5s;
}
.work-card:nth-child(6) {
  animation-delay: 0.6s;
}
.work-card:nth-child(7) {
  animation-delay: 0.7s;
}
.work-card:nth-child(8) {
  animation-delay: 0.8s;
}
.work-card:nth-child(9) {
  animation-delay: 0.9s;
}

@keyframes cardReveal {
  from {
    opacity: 0;
    transform: translateY(50px) rotateX(10deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

.work-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(212, 175, 55, 0.1) 0%,
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
}

.work-card-inner {
  position: relative;
  z-index: 2;
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
  color: var(--text-primary);
  font-weight: 600;
}

.work-media {
  min-height: 0;
  display: flex;
  align-items: center;
  transition: transform 0.4s ease;
}

.laptop-frame {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5));
  transition: filter 0.4s ease;
}

.laptop-screen-shell {
  position: relative;
  width: 92%;
  aspect-ratio: 1.56 / 1;
  padding: 0.42rem 0.42rem 0.32rem;
  border-radius: 16px 16px 10px 10px;
  background: linear-gradient(135deg, var(--bg-surface-alt) 0%, #0f0f0f 100%);
  overflow: hidden;
  box-shadow: inset 0 0 30px rgba(212, 175, 55, 0.1);
}

.laptop-screen-shell::after {
  display: none;
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
  transition: all 0.3s ease;
}

.laptop-topbar span:nth-child(1) {
  background: var(--gold-deep);
}

.laptop-topbar span:nth-child(2) {
  background: var(--gold);
}

.laptop-topbar span:nth-child(3) {
  background: var(--gold-light);
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
  object-fit: cover;
  object-position: center;
  display: block;
  padding: 0.25rem;
  border-radius: 12px;
  background: var(--bg-surface-alt);
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
  background: linear-gradient(
    to right,
    #7a6f5f,
    var(--text-secondary),
    #7a6f5f
  );
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
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
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid var(--gold-border);
  color: var(--gold);
  transition: all 0.3s ease;
  font-weight: 600;
}

.work-cta span,
.work-cta strong {
  margin: 0;
  font-size: 0.68rem;
  font-weight: 700;
}

@media (hover: hover) and (pointer: fine) {
  .work-card:hover {
    transform: translateY(-12px) scale(1.02);
    border-color: var(--gold);
    background: linear-gradient(
      135deg,
      rgba(26, 26, 26, 0.9) 0%,
      rgba(26, 26, 26, 0.6) 100%
    );
  }

  .work-card:hover::before {
    opacity: 1;
  }

  .work-card:hover .work-media {
    transform: scale(1.08);
  }

  .work-card:hover .laptop-frame {
    filter: drop-shadow(0 30px 60px rgba(212, 175, 55, 0.2));
  }

  .work-card:hover .work-cta {
    background: var(--gold);
    color: var(--bg-primary);
    transform: translateX(4px);
  }

  .work-card:hover .laptop-topbar span {
    transform: scale(1.3);
  }
}

@media (max-width: 1100px) {
  .works-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.2rem;
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
