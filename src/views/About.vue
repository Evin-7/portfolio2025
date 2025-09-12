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
            development, back-end development, UX/UI design, and creating seamless
            user experiences.
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

      <div class="experience-section">
        <h3 class="experience-title gradient-text">Work Experience</h3>
        <div class="experience-timeline">
          <div
            class="experience-item glass-card fade-in"
            :class="{ animate: isVisible }"
            style="animation-delay: 0.6s"
          >
            <div class="experience-header">
              <div class="company-info">
                <div class="company-logo">
                  <span class="company-initial">T</span>
                </div>
                <div class="company-details">
                  <h4 class="job-title">Software Engineer</h4>
                  <p class="company-name">Turinix · Full-time</p>
                </div>
              </div>
              <div class="job-duration">
                <span class="duration">Apr 2024 - Present</span>
                <span class="duration-length">1 yr 6 mos</span>
              </div>
            </div>
            <p class="job-location">Mumbai, Maharashtra, India · On-site</p>
          </div>

          <div
            class="experience-item glass-card fade-in"
            :class="{ animate: isVisible }"
            style="animation-delay: 0.8s"
          >
            <div class="experience-header">
              <div class="company-info">
                <div class="company-logo">
                  <span class="company-initial">L</span>
                </div>
                <div class="company-details">
                  <h4 class="job-title">Frontend Developer</h4>
                  <p class="company-name">Leopard Tech Labs Pvt Ltd · Full-time</p>
                </div>
              </div>
              <div class="job-duration">
                <span class="duration">Oct 2022 - Mar 2024</span>
                <span class="duration-length">1 yr 6 mos</span>
              </div>
            </div>
            <p class="job-location">Kottayam Kerala India· On-site</p>
          </div>
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
  margin-bottom: 5rem;
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
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
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
  object-fit: cover;
  display: block;
  border-radius: 20px;
  filter: grayscale(20%) brightness(90%);
  transition: transform 0.5s ease, filter 0.5s ease;
}

.about-image:hover .profile-photo {
  transform: scale(1.05);
  filter: grayscale(0%) brightness(100%);
}

/* Experience Section Styles */
.experience-section {
  margin-top: 4rem;
}

.experience-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

.experience-timeline {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.experience-item {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.experience-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 0 4px 4px 0;
}

.experience-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.company-logo {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  color: white;
  flex-shrink: 0;
}

.company-initial {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.company-details {
  flex: 1;
}

.job-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #fff;
}

.company-name {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.job-duration {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.duration {
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
}

.duration-length {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.job-location {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  padding-left: 66px;
}

@media (max-width: 768px) {
  .about-content {
    grid-template-columns: 1fr;
    text-align: center;
    margin-bottom: 3rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .experience-title {
    font-size: 2rem;
  }

  .about-image {
    height: 300px;
  }

  .experience-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .job-duration {
    text-align: left;
  }

  .job-location {
    padding-left: 0;
    margin-top: 0.5rem;
  }

  .company-info {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .about {
    padding: 3rem 1rem;
  }

  .experience-item {
    padding: 1.5rem;
  }

  .company-logo {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .job-title {
    font-size: 1.2rem;
  }
}
</style>