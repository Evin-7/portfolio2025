<template>
  <div :class="{ visible: isVisible }">
    <div class="container">
      <div class="text-center">
        <h2 class="section-title text-center gradient-text">Get In Touch</h2>
      </div>
      <div class="contact-content">
        <p class="contact-intro">
          Have a project in mind? Let's work together to bring your ideas to
          life!
        </p>
        <div class="skills-section">
          <h3>My Expertise</h3>
          <ul class="skills-list">
            <li>Vue.js</li>
            <li>Next.js</li>
            <li>React.js</li>
            <li>React Native</li>
            <li>Python</li>
            <li>Bootstrap</li>
            <li>Node.js</li>
          </ul>
        </div>

        <div class="contact-info-section">
          <h3>Connect With Me</h3>
          <div class="social-links">
            <a
              href="https://www.linkedin.com/feed/"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link interactive"
            >
              <img
                src="../assets/icons/linkedin.png"
                alt="LinkedIn Logo"
                class="social-icon"
              />
              <span>LinkedIn Profile</span>
            </a>
            <a
              href="https://github.com/Evin-7"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link interactive"
            >
              <img
                src="../assets/icons/github.png"
                alt="GitHub Logo"
                class="social-icon"
              />
              <span>GitHub Profile</span>
            </a>
            <div class="contact-number interactive">
              <img
                src="../assets/icons/phone.png"
                alt="Phone Logo"
                class="social-icon"
              />
              <span>+91 7510255897</span>
            </div>
          </div>
        </div>

        <div v-if="messageText" :class="['message-display', messageType]">
          {{ messageText }}
        </div>

        <form class="contact-form" @submit.prevent="submitForm">
          <input
            v-model="form.name"
            type="text"
            placeholder="Your Name"
            required
            class="form-input"
          />
          <input
            v-model="form.email"
            type="email"
            placeholder="Your Email"
            required
            class="form-input"
          />
          <textarea
            v-model="form.message"
            placeholder="Your Message"
            rows="5"
            required
            class="form-input"
          ></textarea>
          <button
            type="submit"
            class="submit-btn interactive"
            :disabled="isSubmitting"
          >
            {{ submitText }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import emailjs from "@emailjs/browser";

const isVisible = ref(false);
const isSubmitting = ref(false);
const submitText = ref("Send Message");

// New state variables for custom message display
const messageText = ref(null); // Holds the text for the message
const messageType = ref(null); // Holds 'success' or 'error' for styling

// EmailJS credentials (replace with environment variables in production)
const SERVICE_ID = "service_c9mvwmf";
const TEMPLATE_ID = "template_rg0dxwx";
const PUBLIC_KEY = "b2a_iFqgCAGz-aaiS";

const form = reactive({
  name: "",
  email: "",
  message: "",
});

const submitForm = async () => {
  isSubmitting.value = true;
  submitText.value = "Sending...";
  messageText.value = null; // Clear previous messages

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        name: form.name,
        email: form.email,
        message: form.message,
      },
      PUBLIC_KEY
    );

    submitText.value = "Message Sent!";
    messageType.value = "success";
    messageText.value = "Your message has been sent successfully!";

    // Reset button text and clear form after a delay
    setTimeout(() => {
      submitText.value = "Send Message";
      isSubmitting.value = false;
      Object.keys(form).forEach((key) => (form[key] = "")); // Clear form fields
      messageText.value = null; // Hide the message
    }, 3000); // Display success message for 3 seconds
  } catch (error) {
    submitText.value = "Error Sending!";
    messageType.value = "error";
    messageText.value = "Failed to send your message. Please try again later.";
    console.error("Failed to send email:", error);

    // Reset button text after a delay, keep error message for longer if needed
    setTimeout(() => {
      submitText.value = "Send Message";
      isSubmitting.value = false;
      messageText.value = null; // Hide the message
    }, 5000); // Display error message for 5 seconds
  }
};

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
      }
    },
    { threshold: 0.1 }
  );

  const contactSection = document.querySelector(".contact");
  if (contactSection) {
    observer.observe(contactSection);
  } else {
    // Fallback if .contact is not found, useful for development where
    // component might be rendered without its parent
    isVisible.value = true;
  }
});
</script>

<style scoped>
/* All your existing styles */

/* General Section Styling */
.contact {
  padding: 5rem 2rem;
  background-color: #1a1a2e; /* Dark background to match gradient theme */
  color: white;
  min-height: 100vh; /* Ensure it takes at least full viewport height */
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0; /* Hidden by default for fade-in effect */
  transform: translateY(20px); /* Slightly moved down for slide-up effect */
  transition: opacity 1s ease-out, transform 1s ease-out;
}

.contact.visible {
  opacity: 1;
  transform: translateY(0);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.section-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
  position: relative;
  display: inline-block;
  background: linear-gradient(
    45deg,
    #ff6b6b,
    #4ecdc4
  ); /* Gradient text background */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent; /* Fallback for non-webkit browsers */
}

.contact-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem; /* Spacing between main content blocks */
}

.contact-intro {
  font-size: 1.2rem;
  margin-bottom: 0; /* Removed default margin as gap handles it */
  opacity: 0.9;
}

/* Skills Section Styling */
.skills-section {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.skills-section h3 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #fff;
  text-align: center;
}

.skills-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.skills-list li {
  background: linear-gradient(45deg, #4ecdc4, #ff6b6b);
  color: white;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;

  /* 👇 New for equal width */
  flex: 1 1 120px;  /* Grow/shrink but minimum width 120px */
  max-width: 150px; /* Prevent them from being too wide */
  
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.skills-list li:hover {
  transform: translateY(-3px);
}

/* Contact Info & Social Links Section Styling */
.contact-info-section {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.contact-info-section h3 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #fff;
  text-align: center;
}


.social-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  width: 100%; /* Ensure they line up nicely */
}

.social-link,
.contact-number {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  padding: 0.8rem 2rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50px;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  /* 👇 New equal width rules */
  max-width: 260px;  /* Prevent them from stretching too much */
  width: 100%;       /* Fill evenly within container */
  text-align: center;
}


.social-link:hover,
.contact-number.interactive:hover {
  transform: translateY(-3px);
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  box-shadow: 0 5px 20px rgba(255, 107, 107, 0.4);
}

/* Styling for the social icons (images) */
.social-icon {
  height: 20px; /* Specific height for your icons */
  width: 20px; /* Specific width for your icons */
  object-fit: contain; /* Ensure the image fits within the bounds without stretching */
  flex-shrink: 0; /* Prevent icons from shrinking on smaller screens */
}

/* Contact Form Styling */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 0; /* Reset margin-top as gap on contact-content handles it */
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
  background: rgba(255, 255, 255, 0.1);
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
  font-size: 1.1rem;
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.2);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #555;
  box-shadow: none;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .contact {
    padding: 3rem 1.5rem;
  }
  .section-title {
    font-size: 2.5rem;
  }
  .contact-intro {
    font-size: 1.1rem;
  }
  .skills-section h3,
  .contact-info-section h3 {
    font-size: 1.5rem;
  }
  .skills-list li {
    font-size: 0.8rem;
    padding: 0.4rem 1rem;
  }
  .social-link,
  .contact-number {
    font-size: 1rem;
    padding: 0.7rem 1.5rem;
  }
  .form-input,
  .submit-btn {
    font-size: 0.95rem;
    padding: 0.9rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 2rem;
  }
  .contact-intro {
    font-size: 1rem;
  }
  .social-link,
  .contact-number {
    flex-direction: column;
    gap: 0.3rem;
    padding: 0.5rem 1rem;
  }
  .social-link span,
  .contact-number span {
    font-size: 0.85rem;
  }
  .social-icon {
    height: 18px;
    width: 18px;
  }
}

/* --- New Styles for Message Display --- */
.message-display {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem; /* Space before the form */
  font-weight: 600;
  text-align: center;
  opacity: 1;
  transition: opacity 0.5s ease-out;
}

.message-display.success {
  background-color: #4caf50; /* Green background */
  color: white;
  border: 1px solid #388e3c;
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
}

.message-display.error {
  background-color: #f44336; /* Red background */
  color: white;
  border: 1px solid #d32f2f;
  box-shadow: 0 4px 10px rgba(244, 67, 54, 0.3);
}

/* Optional: Add a subtle fade-out transition for the message if you want */
.message-display.fade-out {
  opacity: 0;
}
</style>