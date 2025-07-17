<template>
  <div class="section contact" :class="{ visible: isVisible }">
    <div class="container">
      <h2 class="section-title gradient-text">Get In Touch</h2>
      <div class="contact-content">
        <p class="contact-intro">Have a project in mind? Let's work together to bring your ideas to life!</p>
        <form class="contact-form" @submit.prevent="submitForm">
          <input
            v-model="form.name"
            type="text"
            placeholder="Your Name"
            required
            class="form-input"
          >
          <input
            v-model="form.email"
            type="email"
            placeholder="Your Email"
            required
            class="form-input"
          >
          <textarea
            v-model="form.message"
            placeholder="Your Message"
            rows="5"
            required
            class="form-input"
          ></textarea>
          <button type="submit" class="submit-btn interactive" :disabled="isSubmitting">
            {{ submitText }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const isVisible = ref(false)
const isSubmitting = ref(false)
const submitText = ref('Send Message')

const form = reactive({
  name: '',
  email: '',
  message: ''
})

const submitForm = async () => {
  isSubmitting.value = true
  submitText.value = 'Sending...'
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  submitText.value = 'Message Sent!'
  
  setTimeout(() => {
    submitText.value = 'Send Message'
    isSubmitting.value = false
    Object.keys(form).forEach(key => form[key] = '')
  }, 2000)
}

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
      }
    },
    { threshold: 0.1 }
  )
  
  observer.observe(document.querySelector('.contact'))
})
</script>

<style scoped>
.contact {
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

.contact-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.contact-intro {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 3rem;
}

.form-input {
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #ff6b6b;
  box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.submit-btn {
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
}
</style>