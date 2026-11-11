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
  const [messageText, setMessageText] = useState("");
  const statusTimer = useRef(null);

  useEffect(() => () => {
    if (statusTimer.current) window.clearTimeout(statusTimer.current);
  }, []);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitText("Sending...");
    setMessageText("");

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, EMAILJS_PUBLIC_KEY);
      setSubmitText("Message Sent");
      setMessageText("Your message has been sent.");
      setForm(initialForm);
    } catch (error) {
      console.error("EmailJS Error:", error);
      setSubmitText("Send Failed");
      setMessageText("Failed to send. Please try again.");
    } finally {
      statusTimer.current = window.setTimeout(() => {
        setSubmitText("Send Message");
        setIsSubmitting(false);
        setMessageText("");
      }, 3500);
    }
  };

  return (
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
            <p className={messageText ? "contact-status" : "sr-only"} role="status" aria-live="polite">{messageText}</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
