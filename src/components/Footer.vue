<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-logo">Evin Leyander</div>
      <ul class="footer-links">
        <li><a href="#home" class="interactive">Home</a></li>
        <li><a href="#about" class="interactive">About</a></li>
        <li><a href="#works" class="interactive">Works</a></li>
        <li><a href="#contact" class="interactive">Contact</a></li>
      </ul>
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Evin Leyander. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.footer {
  background-color: #0a0a0a;
  padding: 3rem 2rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 6rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-logo {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: glow 2s ease-in-out infinite alternate;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
}

.footer-links a {
  color: #ffffff;
  font-weight: 500;
  text-decoration: none;
  position: relative;
  transition: all 0.3s ease;
}

.footer-links a::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  transition: width 0.3s ease;
}

.footer-links a:hover::after {
  width: 100%;
}

.footer-bottom p {
  font-size: 0.9rem;
  color: #aaa;
  margin: 0;
}

@keyframes glow {
  from {
    text-shadow: 0 0 5px #ff6b6b;
  }
  to {
    text-shadow: 0 0 10px #4ecdc4;
  }
}

@media (max-width: 768px) {
  .footer-links {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
