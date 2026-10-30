"use client";

import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import Reveal from "../components/Reveal";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_1ajllgm";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_mtqwxq5";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "zV-JGz4jw4hDv3m2h";
const initialForm = { name: "", email: "", message: "" };

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
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY);
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

  const fieldClass = "w-full rounded-xl border border-white/15 bg-panel px-4 py-3.5 text-sm text-copy outline-none transition-colors placeholder:text-muted/80 focus:border-white/50";

  return (
    <section className="border-t border-white/10 bg-panel py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[90rem] px-5 sm:px-8 md:px-12 lg:px-20 2xl:px-[clamp(6rem,7vw,13.75rem)]">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal className="max-w-[36rem]">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Contact</p>
            <h2 className="mt-4 text-[clamp(2.3rem,5vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.065em] text-copy">
              Let’s work together.
            </h2>
            <p className="mt-6 text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Software, product UI, and websites.
            </p>
            <a
              href="mailto:yjevin75@gmail.com"
              className="mt-7 inline-flex min-h-12 items-center rounded-full border border-white/25 px-5 py-3 text-sm font-medium text-copy transition-colors hover:bg-white/[0.07]"
            >
              yjevin75@gmail.com <span className="ml-3 text-muted" aria-hidden="true">↗</span>
            </a>
          </Reveal>

          <Reveal delay={0.08}>
            <form className="flex flex-col gap-3" onSubmit={submitForm}>
              <label className="sr-only" htmlFor="contact-name">Name</label>
              <input id="contact-name" name="name" value={form.name} onChange={updateField} type="text" autoComplete="name" placeholder="Name" required className={fieldClass} />

              <label className="sr-only" htmlFor="contact-email">Email</label>
              <input id="contact-email" name="email" value={form.email} onChange={updateField} type="email" autoComplete="email" placeholder="Email" required className={fieldClass} />

              <label className="sr-only" htmlFor="contact-message">Tell me about your project</label>
              <textarea id="contact-message" name="message" value={form.message} onChange={updateField} placeholder="Tell me about your project" rows={5} required className={fieldClass + " resize-y"} />

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="text-sm text-muted" role="status" aria-live="polite">{messageText}</div>
                <button
                  type="submit"
                  className="inline-flex min-h-12 min-w-40 items-center justify-center rounded-full bg-copy px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSubmitting}
                >
                  {submitText}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
