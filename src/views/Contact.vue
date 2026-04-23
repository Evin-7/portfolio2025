<template>
  <section class="contact">
    <div class="contact-shell">
      <p class="contact-eyebrow">Contact</p>
      <h2 class="contact-title">Let’s work together.</h2>
      <p class="contact-text">
        For product UI, websites, and frontend-focused work.
      </p>

      <div class="contact-links">
        <a href="mailto:yjevin75@gmail.com" class="contact-link contact-link-primary interactive">
          yjevin75@gmail.com
        </a>
        <a
          href="https://www.linkedin.com/feed/"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-link interactive"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/Evin-7"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-link interactive"
        >
          GitHub
        </a>
        <a href="tel:+917510255897" class="contact-link interactive">
          +91 7510255897
        </a>
      </div>

      <div v-if="messageText" class="message-display">
        {{ messageText }}
      </div>

      <form class="contact-form" @submit.prevent="submitForm">
        <input
          v-model="form.name"
          type="text"
          placeholder="Name"
          required
          class="form-input"
        />
        <input
          v-model="form.email"
          type="email"
          placeholder="Email"
          required
          class="form-input"
        />
        <textarea
          v-model="form.message"
          placeholder="Tell me about your project"
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
  </section>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount } from "vue";
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_1ajllgm";
const TEMPLATE_ID = "template_mtqwxq5";
const PUBLIC_KEY = "zV-JGz4jw4hDv3m2h";

const isSubmitting = ref(false);
const submitText = ref("Send Message");
const messageText = ref(null);
let statusTimer = null;

const form = reactive({
  name: "",
  email: "",
  message: "",
});

emailjs.init({
  publicKey: PUBLIC_KEY,
});

const resetForm = () => {
  form.name = "";
  form.email = "";
  form.message = "";
};

const clearStatusTimer = () => {
  if (statusTimer) {
    clearTimeout(statusTimer);
    statusTimer = null;
  }
};

const resetUiState = () => {
  submitText.value = "Send Message";
  isSubmitting.value = false;
  messageText.value = null;
};

const submitForm = async () => {
  clearStatusTimer();
  isSubmitting.value = true;
  submitText.value = "Sending...";
  messageText.value = null;

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        name: form.name,
        email: form.email,
        message: form.message,
      },
      PUBLIC_KEY // ✅ only this needed
    );

    submitText.value = "Message Sent";
    messageText.value = "Your message has been sent.";
    resetForm();

    statusTimer = setTimeout(resetUiState, 3000);
  } catch (error) {
    console.error("EmailJS Error:", error);

    submitText.value = "Send Failed";
    messageText.value = "Failed to send. Check setup.";
    statusTimer = setTimeout(resetUiState, 4000);
  }
};

onBeforeUnmount(() => {
  clearStatusTimer();
});
</script>

<style scoped>
.contact {
  padding: 5.5rem 1.5rem;
  background: #ffffff;
}

.contact-shell {
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
}

.contact-eyebrow {
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6e6e73;
}

.contact-title {
  margin-top: 0.9rem;
  font-size: clamp(2.2rem, 5vw, 4rem);
  line-height: 1.02;
  letter-spacing: -0.04em;
  color: #1d1d1f;
}

.contact-text {
  margin-top: 1rem;
  font-size: 1rem;
  line-height: 1.7;
  color: #6e6e73;
}

.contact-links {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.contact-link {
  padding: 0.68rem 1rem;
  border-radius: 999px;
  background: #f5f5f7;
  color: #1d1d1f;
  text-decoration: none;
  font-size: 0.9rem;
  line-height: 1;
}
.contact-link-primary {
  background: #1d1d1f;
  color: #ffffff;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin-top: 2rem;
}

.form-input {
  width: 100%;
  padding: 1rem 1.1rem;
  border: none;
  border-radius: 20px;
  background: #f5f5f7;
  color: #1d1d1f;
  font-size: 0.98rem;
  font-family: inherit;
}

.form-input:focus {
  outline: 2px solid rgba(29, 29, 31, 0.12);
}

.submit-btn {
  align-self: center;
  min-width: 180px;
  padding: 0.95rem 1.25rem;
  border: none;
  border-radius: 999px;
  background: #1d1d1f;
  color: #ffffff;
  font-size: 0.95rem;
  font-family: inherit;
}

.submit-btn:disabled {
  opacity: 0.6;
}

.message-display {
  margin-top: 1.5rem;
  color: #6e6e73;
}
</style>
