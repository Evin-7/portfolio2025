<template>
  <div class="app">
    <div ref="cursor" class="cursor"></div>
    <div class="scroll-progress" :style="{ width: scrollProgress + '%' }"></div>
    <div class="particle-container">
      <div
        v-for="particle in particles"
        :key="particle.id"
        class="particle"
        :style="particle.style"
      ></div>
    </div>

    <!-- Navigation -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-logo gradient-text">PREJITH T S</div>
        <div class="nav-menu" :class="{ active: isMenuOpen }">
          <a href="#home" @click="scrollTo('home')" class="nav-link">Home</a>
          <a href="#about" @click="scrollTo('about')" class="nav-link">About</a>
          <a href="#experience" @click="scrollTo('experience')" class="nav-link"
            >Experience</a
          >
          <a href="#skills" @click="scrollTo('skills')" class="nav-link"
            >Skills</a
          >
          <a href="#projects" @click="scrollTo('projects')" class="nav-link"
            >Projects</a
          >
          <a href="#contact" @click="scrollTo('contact')" class="nav-link"
            >Contact</a
          >
        </div>
        <div class="nav-toggle" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text ember-glow">PREJITH T S</span>
          </h1>
          <h2 class="hero-subtitle floating-element">Flutter Developer</h2>
          <p class="hero-description">
            Accomplished Mobile Application Developer with 3.5 years of
            experience, specializing in Flutter framework and delivering
            exceptional user experiences.
          </p>
          <div class="hero-buttons">
            <button @click="scrollTo('contact')" class="btn-primary hover-lift">
              Get In Touch
            </button>

            <a
              href="/Prejith_c_v.pdf"
              download="Prejith_c_v.pdf"
              class="btn-secondary hover-lifte text-[15px]"
            >
              Download CV
            </a>
          </div>
          <div class="hero-social">
            <a
              href="https://www.linkedin.com/in/prejith-ts-a3ab7a1b2"
              target="_blank"
              class="social-link hover-lift"
            >
              <i class="fab fa-linkedin"></i>
            </a>
            <a
              href="mailto:prejithts102@gmail.com"
              class="social-link hover-lift"
            >
              <i class="fas fa-envelope"></i>
            </a>
            <a href="tel:+918086991977" class="social-link hover-lift">
              <i class="fas fa-phone"></i>
            </a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="floating-card glass-card breathing-element">
            <div class="card-icon">📱</div>
            <h3>Flutter Expert</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about-section section">
      <div class="container">
        <h2 class="section-title gradient-text">About Me</h2>
        <div class="about-content">
          <div class="about-text">
            <p class="about-description">
              I am a passionate Flutter developer with a proven track record of
              analyzing user requirements and translating client needs into
              exceptional application designs. My expertise spans across mobile
              application development, with a focus on creating high-quality,
              reliable solutions that deliver outstanding user experiences.
            </p>
            <div class="about-stats">
              <div class="stat-item glass-card hover-lift">
                <div class="stat-number gradient-text">3.5+</div>
                <div class="stat-label">Years Experience</div>
              </div>
              <div class="stat-item glass-card hover-lift">
                <div class="stat-number gradient-text">15+</div>
                <div class="stat-label">Projects Completed</div>
              </div>
              <div class="stat-item glass-card hover-lift">
                <div class="stat-number gradient-text">100%</div>
                <div class="stat-label">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section id="experience" class="experience-section section">
      <div class="container">
        <h2 class="section-title gradient-text">Professional Experience</h2>
        <div class="timeline">
          <div class="timeline-item hover-lift">
            <div class="timeline-dot"></div>
            <div class="timeline-content glass-card">
              <div class="timeline-header">
                <h3 class="timeline-title">Lead Developer</h3>
                <div class="timeline-company">
                  Gigvoc Technologies Pvt. Ltd.
                </div>
                <div class="timeline-date">Apr 2024 - Present</div>
              </div>
              <div class="timeline-description">
                <div class="project-item">
                  <strong>OhYes App:</strong> Managed development of online
                  booking application for home services including plumbing,
                  gardening, and pest control.
                </div>
                <div class="project-item">
                  <strong>OhYes Partner App:</strong> Led design and development
                  of partner-facing application for service providers.
                </div>
                <div class="project-item">
                  <strong>MyQPad:</strong> Directed creation of online booking
                  platform focusing on customer engagement.
                </div>
                <div class="project-item">
                  <strong>OhYesAI:</strong> Integrated AI-powered assistant
                  using OpenAI GPT for automated customer support.
                </div>
              </div>
            </div>
          </div>

          <div class="timeline-item hover-lift">
            <div class="timeline-dot"></div>
            <div class="timeline-content glass-card">
              <div class="timeline-header">
                <h3 class="timeline-title">Flutter Developer</h3>
                <div class="timeline-company">LEOPARD TECH LABS Pvt. Ltd.</div>
                <div class="timeline-date">Sep 2021 - Mar 2024</div>
              </div>
              <div class="timeline-description">
                <div class="project-item">
                  <strong>Styloop:</strong> E-commerce platform available on
                  Play Store enhancing online shopping experiences.
                </div>
                <div class="project-item">
                  <strong>Pakt:</strong> Online food delivery application
                  enabling seamless food ordering from nearby restaurants.
                </div>
                <div class="project-item">
                  <strong>Parambikulam:</strong> Government project for ticket
                  booking and asset management with offline functionality.
                </div>
                <div class="project-item">
                  <strong>Whale Shark:</strong> Government application for
                  monitoring whale shark populations in marine conservation.
                </div>
                <div class="project-item">
                  <strong>Additional Projects:</strong> Church Directory,
                  Attendance App, Site Guide, and Kinfolk applications.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="skills-section section">
      <div class="container">
        <h2 class="section-title gradient-text">Technical Skills</h2>
        <div class="skills-grid">
          <div class="skill-category glass-card hover-lift">
            <h3 class="skill-category-title">Primary Skills</h3>
            <div class="skills-list">
              <div class="skill-item">
                <div class="skill-name">Flutter Framework</div>
                <div class="skill-bar">
                  <div class="skill-progress" style="width: 95%"></div>
                </div>
              </div>
              <div class="skill-item">
                <div class="skill-name">Dart</div>
                <div class="skill-bar">
                  <div class="skill-progress" style="width: 90%"></div>
                </div>
              </div>
              <div class="skill-item">
                <div class="skill-name">RESTful API</div>
                <div class="skill-bar">
                  <div class="skill-progress" style="width: 85%"></div>
                </div>
              </div>
              <div class="skill-item">
                <div class="skill-name">Payment Gateway</div>
                <div class="skill-bar">
                  <div class="skill-progress" style="width: 80%"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="skill-category glass-card hover-lift">
            <h3 class="skill-category-title">Secondary Skills</h3>
            <div class="skills-list">
              <div class="skill-item">
                <div class="skill-name">Git/Version Control</div>
                <div class="skill-bar">
                  <div class="skill-progress" style="width: 85%"></div>
                </div>
              </div>
              <div class="skill-item">
                <div class="skill-name">Machine Learning</div>
                <div class="skill-bar">
                  <div class="skill-progress" style="width: 70%"></div>
                </div>
              </div>
              <div class="skill-item">
                <div class="skill-name">OpenAI API</div>
                <div class="skill-bar">
                  <div class="skill-progress" style="width: 75%"></div>
                </div>
              </div>
              <div class="skill-item">
                <div class="skill-name">Firebase</div>
                <div class="skill-bar">
                  <div class="skill-progress" style="width: 80%"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="skill-category glass-card hover-lift">
            <h3 class="skill-category-title">Specializations</h3>
            <div class="specialization-list">
              <div class="spec-item">BLoC Architecture</div>
              <div class="spec-item">Google Maps Integration</div>
              <div class="spec-item">WebSockets</div>
              <div class="spec-item">Play Store Deployment</div>
              <div class="spec-item">UI/UX Design</div>
              <div class="spec-item">Clean Code Practices</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="projects-section section">
      <div class="container">
        <h2 class="section-title gradient-text">Featured Projects</h2>
        <div class="projects-grid">
          <div
            class="project-card glass-card hover-lift"
            v-for="project in featuredProjects"
            :key="project.id"
          >
            <div class="project-header">
              <div class="project-icon">{{ project.icon }}</div>
              <div class="project-category">{{ project.category }}</div>
            </div>
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-description">{{ project.description }}</p>
            <div class="project-tech">
              <span
                class="tech-tag"
                v-for="tech in project.technologies"
                :key="tech"
                >{{ tech }}</span
              >
            </div>
            <div class="project-links">
              <button class="project-btn" v-if="project.playStore">
                <i class="fab fa-google-play"></i>
                Play Store
              </button>
              <button class="project-btn" v-if="project.github">
                <i class="fab fa-github"></i>
                GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Education Section -->
    <section id="education" class="education-section section">
      <div class="container">
        <h2 class="section-title gradient-text">Education</h2>
        <div class="education-timeline">
          <div class="education-item glass-card hover-lift">
            <div class="education-year">2017 - 2021</div>
            <div class="education-content">
              <h3 class="education-title">
                Bachelor of Information Technology
              </h3>
              <div class="education-institution">
                APJ Abdul Kalam Technological University
              </div>
              <div class="education-location">
                Amal Jyothi College of Engineering, Kerala, India
              </div>
            </div>
          </div>
          <div class="education-item glass-card hover-lift">
            <div class="education-year">2015 - 2017</div>
            <div class="education-content">
              <h3 class="education-title">Higher Secondary Education</h3>
              <div class="education-institution">St. Mary's HSS</div>
              <div class="education-location">Idukki, Kerala, India</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact-section section">
      <div class="container">
        <h2 class="section-title gradient-text">Get In Touch</h2>
        <div class="contact-content">
          <div class="contact-info">
            <div class="contact-item glass-card hover-lift">
              <div class="contact-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <div class="contact-details">
                <h3>Email</h3>
                <a href="mailto:prejithts102@gmail.com"
                  >prejithts102@gmail.com</a
                >
              </div>
            </div>
            <div class="contact-item glass-card hover-lift">
              <div class="contact-icon">
                <i class="fas fa-phone"></i>
              </div>
              <div class="contact-details">
                <h3>Phone</h3>
                <a href="tel:+918086991977">+91 8086991977</a>
              </div>
            </div>
            <div class="contact-item glass-card hover-lift">
              <div class="contact-icon">
                <i class="fab fa-linkedin"></i>
              </div>
              <div class="contact-details">
                <h3>LinkedIn</h3>
                <a
                  href="https://www.linkedin.com/in/prejith-ts-a3ab7a1b2"
                  target="_blank"
                  >Connect with me</a
                >
              </div>
            </div>
          </div>
          <div class="contact-form glass-card">
            <form @submit.prevent="submitForm">
              <div class="form-group">
                <input
                  type="text"
                  v-model="form.name"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div class="form-group">
                <input
                  type="email"
                  v-model="form.email"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div class="form-group">
                <input
                  type="text"
                  v-model="form.subject"
                  placeholder="Subject"
                  required
                />
              </div>
              <div class="form-group">
                <textarea
                  v-model="form.message"
                  placeholder="Your Message"
                  rows="5"
                  required
                ></textarea>
              </div>
              <button type="submit" class="btn-primary hover-lift">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-text">
            <p>&copy; 2024 Prejith T S. All rights reserved.</p>
          </div>
          <div class="footer-social">
            <a
              href="https://www.linkedin.com/in/prejith-ts-a3ab7a1b2"
              target="_blank"
              class="footer-link hover-lift"
            >
              <i class="fab fa-linkedin"></i>
            </a>
            <a
              href="mailto:prejithts102@gmail.com"
              class="footer-link hover-lift"
            >
              <i class="fas fa-envelope"></i>
            </a>
            <a href="tel:+918086991977" class="footer-link hover-lift">
              <i class="fas fa-phone"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from "vue";

// Reactive state
const cursor = ref(null);
const scrollProgress = ref(0);
const particles = ref([]);
const isMenuOpen = ref(false);

// Form data
const form = reactive({
  name: "",
  email: "",
  subject: "",
  message: "",
});

// Featured projects data
const featuredProjects = ref([
  {
    id: 1,
    title: "OhYes App",
    description:
      "Online booking application for home services including plumbing, gardening, pest control, and maintenance.",
    icon: "🏠",
    category: "Service Booking",
    technologies: ["Flutter", "Dart", "Firebase", "Payment Gateway"],
    playStore: true,
  },
  {
    id: 2,
    title: "Styloop",
    description:
      "Innovative e-commerce platform available on Play Store, enhancing online shopping experiences.",
    icon: "🛒",
    category: "E-Commerce",
    technologies: ["Flutter", "RESTful API", "Payment Gateway", "UI/UX"],
    playStore: true,
  },
  {
    id: 3,
    title: "Pakt Food Delivery",
    description:
      "Seamless food ordering application from nearby restaurants with real-time tracking.",
    icon: "🍕",
    category: "Food Delivery",
    technologies: ["Flutter", "Google Maps", "WebSockets", "Firebase"],
    playStore: true,
  },
  {
    id: 4,
    title: "Whale Shark Monitor",
    description:
      "Government project for monitoring whale shark populations contributing to marine conservation.",
    icon: "🦈",
    category: "Conservation",
    technologies: ["Flutter", "ML", "GPS Tracking", "Government APIs"],
    github: true,
  },
  {
    id: 5,
    title: "OhYesAI Assistant",
    description:
      "AI-powered customer support system using OpenAI GPT for automated service recommendations.",
    icon: "🤖",
    category: "AI Integration",
    technologies: ["Flutter", "OpenAI API", "Machine Learning", "NLP"],
    github: true,
  },
  {
    id: 6,
    title: "Parambikulam",
    description:
      "Government ticket booking and asset management system with online and offline functionality.",
    icon: "🎫",
    category: "Government",
    technologies: [
      "Flutter",
      "Offline Storage",
      "Asset Management",
      "Government APIs",
    ],
    github: true,
  },
]);

// Particle system
let particleId = 0;
const createParticle = () => {
  const particle = {
    id: particleId++,
    style: {
      left: Math.random() * 100 + "%",
      animationDelay: Math.random() * 3 + "s",
      animationDuration: 3 + Math.random() * 2 + "s",
    },
  };
  particles.value.push(particle);

  setTimeout(() => {
    particles.value = particles.value.filter((p) => p.id !== particle.id);
  }, 5000);
};

// Navigation functions
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const scrollTo = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
  isMenuOpen.value = false;
};

// Form submission
const submitForm = () => {
  // Here you would typically send the form data to a server
  alert("Thank you for your message! I will get back to you soon.");

  // Reset form
  form.name = "";
  form.email = "";
  form.subject = "";
  form.message = "";
};

// Download resume
const downloadResume = () => {
  // Create a simple text resume content
  const resumeContent = `
PREJITH T S - Flutter Developer
Email: prejithts102@gmail.com
Phone: +91 8086991977
LinkedIn: https://www.linkedin.com/in/prejith-ts-a3ab7a1b2

EXPERIENCE:
- Lead Developer at Gigvoc Technologies (Apr 2024 - Present)
- Flutter Developer at LEOPARD TECH LABS (Sep 2021 - Mar 2024)

SKILLS:
- Flutter Framework, Dart, RESTful API, Payment Gateway
- Firebase, Google Maps, Machine Learning, OpenAI API
- Git, BLoC Architecture, UI/UX Design

EDUCATION:
- Bachelor of IT, APJ Abdul Kalam Technological University (2017-2021)
  `;

  const blob = new Blob([resumeContent], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Prejith_TS_Resume.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// Custom cursor
const updateCursor = (e) => {
  if (cursor.value) {
    cursor.value.style.left = e.clientX + "px";
    cursor.value.style.top = e.clientY + "px";
  }
};

// Scroll progress
const updateScrollProgress = () => {
  const scrollTop = window.pageYOffset;
  const docHeight = document.body.offsetHeight - window.innerHeight;
  scrollProgress.value = (scrollTop / docHeight) * 100;
};

// Intersection Observer for animations
const observeElements = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  });

  document.querySelectorAll(".section").forEach((section) => {
    observer.observe(section);
  });
};

// Lifecycle
onMounted(() => {
  document.addEventListener("mousemove", updateCursor);
  window.addEventListener("scroll", updateScrollProgress);

  // Start particle system
  setInterval(createParticle, 350);

  // Setup intersection observer
  observeElements();

  // Cursor hover effects
  setTimeout(() => {
    const interactiveElements = document.querySelectorAll(
      "a, button, .hover-lift"
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () =>
        cursor.value?.classList.add("hover")
      );
      el.addEventListener("mouseleave", () =>
        cursor.value?.classList.remove("hover")
      );
    });
  }, 100);
});

onUnmounted(() => {
  document.removeEventListener("mousemove", updateCursor);
  window.removeEventListener("scroll", updateScrollProgress);
});
</script>

<style>
/* Import Font Awesome for icons */
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap");

/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: "Poppins", sans-serif;
  background: radial-gradient(
    ellipse at top,
    #2d1b69 0%,
    #1a0b3d 25%,
    #0f051f 50%,
    #000000 100%
  );
  background-attachment: fixed;
  color: #f8fafc;
  overflow-x: hidden;
  min-height: 100vh;
  line-height: 1.6;
}

.app {
  position: relative;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Custom Cursor */
.cursor {
  position: fixed;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: radial-gradient(circle, #ff6b35, #f7931e, #ffb347);
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: multiply;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 0 25px rgba(255, 107, 53, 0.7), 0 0 50px rgba(247, 147, 30, 0.4);
  animation: cursorPulse 2s ease-in-out infinite;
}

.cursor.hover {
  transform: scale(3);
  background: radial-gradient(circle, #ff4757, #ff6b35, #ffa726);
  mix-blend-mode: screen;
}

/* Scroll Progress Bar */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 5px;
  background: linear-gradient(
    90deg,
    #ff4757,
    #ff6b35,
    #f7931e,
    #ffb347,
    #ff8a65
  );
  background-size: 300% 100%;
  animation: sunsetWave 4s linear infinite;
  z-index: 9999;
  transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 0 15px rgba(255, 107, 53, 0.8),
    0 2px 10px rgba(247, 147, 30, 0.4);
}

/* Particle System */
.particle-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: radial-gradient(circle, #ff6b35, #f7931e);
  box-shadow: 0 0 10px rgba(255, 107, 53, 0.8);
  animation: emberFloat 5s linear infinite;
}

/* Navigation */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(255, 107, 53, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 179, 71, 0.2);
  z-index: 1000;
  transition: all 0.3s ease;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.nav-menu {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav-link {
  color: #f8fafc;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 0;
}

.nav-link:hover {
  color: #ff6b35;
  transform: translateY(-2px);
}

.nav-link:hover::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #ff4757, #ff6b35);
  border-radius: 2px;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 4px;
}

.nav-toggle span {
  width: 25px;
  height: 3px;
  background: #f8fafc;
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 0 80px;
  position: relative;
  overflow: hidden;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-content {
  z-index: 10;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 2rem;
  color: #ff6b35;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.hero-description {
  font-size: 1.2rem;
  color: #cbd5e1;
  margin-bottom: 2.5rem;
  max-width: 600px;
  line-height: 1.7;
}

.hero-buttons {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.btn-primary,
.btn-secondary {
  padding: 15px 30px;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(135deg, #ff4757, #ff6b35);
  color: white;
  box-shadow: 0 8px 25px rgba(255, 71, 87, 0.4);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(255, 71, 87, 0.6);
}

.btn-secondary {
  background: transparent;
  color: #ff6b35;
  border: 2px solid #ff6b35;
}

.btn-secondary:hover {
  background: #ff6b35;
  color: white;
  transform: translateY(-3px);
}

.hero-social {
  display: flex;
  gap: 1.5rem;
}

.social-link {
  width: 50px;
  height: 50px;
  background: rgba(255, 107, 53, 0.1);
  border: 1px solid rgba(255, 107, 53, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff6b35;
  font-size: 1.2rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #ff6b35;
  color: white;
  transform: translateY(-5px);
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.floating-card {
  padding: 2rem;
  text-align: center;
  max-width: 300px;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.floating-card h3 {
  color: #ff6b35;
  font-size: 1.5rem;
  font-weight: 600;
}

/* Section Styles */
.section {
  padding: 100px 0;
  opacity: 0;
  transform: translateY(50px);
  transition: all 1s ease;
}

.section.visible {
  opacity: 1;
  transform: translateY(0);
}

.section-title {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 4rem;
  font-weight: 700;
}

/* About Section */
.about-content {
  max-width: 800px;
  margin: 0 auto;
}

.about-description {
  font-size: 1.2rem;
  text-align: center;
  color: #cbd5e1;
  margin-bottom: 4rem;
  line-height: 1.8;
}

.about-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.stat-item {
  text-align: center;
  padding: 2rem;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #cbd5e1;
  font-size: 1.1rem;
  font-weight: 500;
}

/* Experience Section */
.timeline {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.timeline::before {
  content: "";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, #ff4757, #ff6b35, #f7931e);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 4rem;
  width: calc(50% - 2rem);
}

.timeline-item:nth-child(odd) {
  margin-left: 0;
}

.timeline-item:nth-child(even) {
  margin-left: calc(50% + 2rem);
}

.timeline-dot {
  position: absolute;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #ff4757, #ff6b35);
  border-radius: 50%;
  top: 2rem;
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.8);
}

.timeline-item:nth-child(odd) .timeline-dot {
  right: -3rem;
}

.timeline-item:nth-child(even) .timeline-dot {
  left: -3rem;
}

.timeline-content {
  padding: 2rem;
}

.timeline-header {
  margin-bottom: 1.5rem;
}

.timeline-title {
  color: #ff6b35;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.timeline-company {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.3rem;
}

.timeline-date {
  color: #94a3b8;
  font-size: 0.9rem;
}

.project-item {
  margin-bottom: 1rem;
  padding-left: 1rem;
  border-left: 2px solid rgba(255, 107, 53, 0.3);
  line-height: 1.6;
}

/* Skills Section */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.skill-category {
  padding: 2rem;
}

.skill-category-title {
  color: #ff6b35;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
}

.skill-item {
  margin-bottom: 1.5rem;
}

.skill-name {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.skill-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, #ff4757, #ff6b35, #f7931e);
  border-radius: 4px;
  transition: width 2s ease;
}

.specialization-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.spec-item {
  background: rgba(255, 107, 53, 0.2);
  color: #ff6b35;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
  border: 1px solid rgba(255, 107, 53, 0.3);
  transition: all 0.3s ease;
}

.spec-item:hover {
  background: #ff6b35;
  color: white;
  transform: translateY(-2px);
}

/* Projects Section */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.project-card {
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.project-icon {
  font-size: 2.5rem;
}

.project-category {
  background: rgba(255, 107, 53, 0.2);
  color: #ff6b35;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
}

.project-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #f8fafc;
}

.project-description {
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.tech-tag {
  background: rgba(255, 179, 71, 0.2);
  color: #ffb347;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.project-links {
  display: flex;
  gap: 1rem;
}

.project-btn {
  background: rgba(255, 107, 53, 0.1);
  border: 1px solid rgba(255, 107, 53, 0.3);
  color: #ff6b35;
  padding: 0.8rem 1.2rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.project-btn:hover {
  background: #ff6b35;
  color: white;
  transform: translateY(-2px);
}

/* Education Section */
.education-timeline {
  max-width: 600px;
  margin: 0 auto;
}

.education-item {
  padding: 2rem;
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 2rem;
  align-items: center;
}

.education-year {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ff6b35;
  text-align: center;
  padding: 1rem;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 10px;
}

.education-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.education-institution {
  font-weight: 500;
  margin-bottom: 0.3rem;
}

.education-location {
  color: #94a3b8;
  font-size: 0.9rem;
}

/* Contact Section */
.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1000px;
  margin: 0 auto;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact-item {
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.contact-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ff4757, #ff6b35);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
}

.contact-details h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.contact-details a {
  color: #cbd5e1;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-details a:hover {
  color: #ff6b35;
}

.contact-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 10px;
  color: #f8fafc;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #94a3b8;
}

/* Footer */
.footer {
  background: rgba(0, 0, 0, 0.5);
  padding: 2rem 0;
  border-top: 1px solid rgba(255, 107, 53, 0.2);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-text {
  color: #94a3b8;
}

.footer-social {
  display: flex;
  gap: 1rem;
}

.footer-link {
  width: 40px;
  height: 40px;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff6b35;
  text-decoration: none;
  transition: all 0.3s ease;
}

.footer-link:hover {
  background: #ff6b35;
  color: white;
}

/* Utility Classes */
.gradient-text {
  background: linear-gradient(135deg, #ff4757, #ff6b35, #f7931e, #ffb347);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: sunsetShimmer 4s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(255, 107, 53, 0.4));
}

.glass-card {
  background: rgba(255, 107, 53, 0.12);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 179, 71, 0.25);
  border-radius: 28px;
  box-shadow: 0 12px 40px rgba(255, 71, 87, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 rgba(255, 107, 53, 0.1);
}

.hover-lift {
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.hover-lift:hover {
  transform: translateY(-12px) scale(1.03) rotateX(5deg);
  box-shadow: 0 25px 50px rgba(255, 71, 87, 0.3),
    0 0 40px rgba(255, 107, 53, 0.2), 0 0 80px rgba(247, 147, 30, 0.1);
}

.floating-element {
  animation: sunsetFloat 6s ease-in-out infinite;
}

.breathing-element {
  animation: breathe 4s ease-in-out infinite;
}

.ember-glow {
  animation: warmGlow 3s ease-in-out infinite alternate;
}

/* Animations */
@keyframes cursorPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes sunsetWave {
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

@keyframes emberFloat {
  0% {
    transform: translateY(100vh) translateX(0) rotate(0deg) scale(0);
    opacity: 0;
  }
  15% {
    opacity: 1;
    transform: translateY(85vh) translateX(10px) rotate(45deg) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translateY(50vh) translateX(-20px) rotate(180deg) scale(1.2);
  }
  85% {
    opacity: 0.3;
    transform: translateY(15vh) translateX(15px) rotate(270deg) scale(0.8);
  }
  100% {
    transform: translateY(-10vh) translateX(0) rotate(360deg) scale(0);
    opacity: 0;
  }
}

@keyframes sunsetShimmer {
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

@keyframes warmGlow {
  0%,
  100% {
    text-shadow: 0 0 15px rgba(255, 107, 53, 0.8),
      0 0 25px rgba(255, 107, 53, 0.5), 0 0 35px rgba(247, 147, 30, 0.3);
  }
  50% {
    text-shadow: 0 0 25px rgba(255, 71, 87, 0.8),
      0 0 35px rgba(255, 107, 53, 0.5), 0 0 45px rgba(255, 138, 101, 0.3);
  }
}

@keyframes sunsetFloat {
  0%,
  100% {
    transform: translateY(0px) rotateZ(0deg);
    filter: hue-rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotateZ(2deg);
    filter: hue-rotate(10deg);
  }
  66% {
    transform: translateY(-5px) rotateZ(-2deg);
    filter: hue-rotate(-10deg);
  }
}

@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 968px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }

  .hero-title {
    font-size: 3rem;
  }

  .timeline::before {
    left: 2rem;
  }

  .timeline-item {
    width: calc(100% - 4rem);
    margin-left: 4rem;
  }

  .timeline-item:nth-child(even) {
    margin-left: 4rem;
  }

  .timeline-dot {
    left: -3rem !important;
  }

  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .cursor {
    display: none;
  }

  .nav-menu {
    position: fixed;
    top: 100%;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 2rem;
    gap: 1rem;
    transition: all 0.3s ease;
    opacity: 0;
    visibility: hidden;
  }

  .nav-menu.active {
    top: 100%;
    opacity: 1;
    visibility: visible;
  }

  .nav-toggle {
    display: flex;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.5rem;
  }

  .hero-buttons {
    flex-direction: column;
    gap: 1rem;
  }

  .section-title {
    font-size: 2.5rem;
  }

  .about-stats {
    grid-template-columns: 1fr;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .education-item {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .timeline-item {
    margin-left: 2rem;
    width: calc(100% - 2rem);
  }

  .timeline-dot {
    left: -1.5rem !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .particle,
  .cursor,
  .scroll-progress,
  .gradient-text,
  .floating-element,
  .breathing-element,
  .ember-glow {
    animation: none;
    transition: none;
  }
}
</style>