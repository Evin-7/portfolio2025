"use client";

import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { siGithub } from "simple-icons";
import Reveal from "../components/Reveal";
import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} from "../lib/emailjsConfig";

const initialForm = { name: "", email: "", message: "" };

function SocialLink({ href, label, icon }) {
  return (
    <a className="social-link" href={href} target="_blank" rel="noopener noreferrer">
      {icon ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon.path} /></svg> : <span className="social-mark-text" aria-hidden="true">in</span>}
      {label}
    </a>
  );
}

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitText, setSubmitText] = useState("Send Message");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
  }, []);

  const showToast = (type, message) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast({ type, message });
    toastTimer.current = window.setTimeout(() => setToast(null), type === "error" ? 6000 : 4800);
  };

  const dismissToast = () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast(null);
  };

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitText("Sending...");
    dismissToast();

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, EMAILJS_PUBLIC_KEY);
      showToast("success", "Thanks for reaching out. I’ll get back to you soon.");
      setForm(initialForm);
    } catch (error) {
      console.error("EmailJS Error:", error);
      showToast("error", "Your message couldn’t be sent. Please try again or email me directly.");
    } finally {
      setSubmitText("Send Message");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="section contact-section" aria-labelledby="contact-title">
        <div className="page-container contact-layout">
          <Reveal className="contact-copy nav-anchor-target" id="contact">
            <p className="section-kicker">04 / Contact</p>
            <h2 className="section-title" id="contact-title">Let’s build something meaningful.</h2>
            <a className="contact-email" href="mailto:yjevin75@gmail.com">
              yjevin75@gmail.com <span aria-hidden="true">↗</span>
            </a>
            <div className="contact-socials" aria-label="Contact and profile links">
              <SocialLink href="https://github.com/Evin-7" label="GitHub" icon={siGithub} />
              <SocialLink href="https://www.linkedin.com/in/evin-leyander-536a70236/" label="LinkedIn" />
              <a className="social-link" href="/resume"><span aria-hidden="true">↓</span>Resume</a>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <form className="contact-form" onSubmit={submitForm}>
              <label className="sr-only" htmlFor="contact-name">Name</label>
              <input className="contact-field" id="contact-name" name="name" value={form.name} onChange={updateField} type="text" autoComplete="name" placeholder="Name" required />

              <label className="sr-only" htmlFor="contact-email">Email</label>
              <input className="contact-field" id="contact-email" name="email" value={form.email} onChange={updateField} type="email" autoComplete="email" placeholder="Email" required />

              <label className="sr-only" htmlFor="contact-message">Tell me about your project</label>
              <textarea className="contact-field contact-field--message" id="contact-message" name="message" value={form.message} onChange={updateField} placeholder="Tell me about your project" rows={5} required />

              <div className="contact-submit">
                <button className="button button--primary" type="submit" disabled={isSubmitting}>{submitText}</button>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
      {toast && (
        <div
          className={`contact-toast contact-toast--${toast.type}`}
          role={toast.type === "error" ? "alert" : "status"}
          aria-live={toast.type === "error" ? "assertive" : "polite"}
          aria-atomic="true"
        >
          <span className="contact-toast-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {toast.type === "success" ? (
                <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16.5 9" /></>
              ) : (
                <><path d="M12 3.5 21 20H3L12 3.5Z" /><path d="M12 9v4m0 3.5h.01" /></>
              )}
            </svg>
          </span>
          <span className="contact-toast-copy">
            <strong>{toast.type === "success" ? "Message sent" : "Message not sent"}</strong>
            <span>{toast.message}</span>
          </span>
          <button className="contact-toast-close" type="button" onClick={dismissToast} aria-label="Dismiss notification">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
