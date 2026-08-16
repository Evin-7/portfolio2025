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

  return (
    <section className="relative overflow-hidden bg-ink/88 py-[5.5rem]">
      <div className="pointer-events-none absolute -top-1/2 left-1/2 size-[31.25rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.08),transparent_70%)]" aria-hidden="true" />
      <div className="mx-auto w-full max-w-[90rem] px-5 sm:px-8 md:px-12 lg:px-20 2xl:max-w-none 2xl:px-[clamp(6rem,7vw,13.75rem)]">
        <Reveal className="relative z-10 mx-auto max-w-[47.5rem] text-center">
          <p className="m-0 text-xs font-bold uppercase tracking-[0.12em] text-amber">Contact</p>
          <h2 className="mt-3 bg-gradient-to-br from-copy to-amber-light bg-clip-text text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-tight tracking-[-0.055em] text-transparent">Let’s work together.</h2>
          <p className="mt-4 text-base leading-7 text-muted">Software, product UI, and websites.</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="mailto:yjevin75@gmail.com" className="rounded-full border border-amber bg-amber px-4 py-2.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-amber-light focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-cyan">yjevin75@gmail.com</a>
          </div>

          {messageText ? <div className="mt-6 text-muted" role="status">{messageText}</div> : null}

          <form className="mt-8 flex flex-col gap-3" onSubmit={submitForm}>
            <input name="name" value={form.name} onChange={updateField} type="text" placeholder="Name" required className="w-full rounded-2xl border border-amber/20 bg-gradient-to-br from-panel to-panel/50 px-4 py-4 text-copy outline-none transition placeholder:text-muted focus:border-amber focus:shadow-[0_0_24px_rgba(212,175,55,0.15)]" />
            <input name="email" value={form.email} onChange={updateField} type="email" placeholder="Email" required className="w-full rounded-2xl border border-amber/20 bg-gradient-to-br from-panel to-panel/50 px-4 py-4 text-copy outline-none transition placeholder:text-muted focus:border-amber focus:shadow-[0_0_24px_rgba(212,175,55,0.15)]" />
            <textarea name="message" value={form.message} onChange={updateField} placeholder="Tell me about your project" rows={5} required className="w-full resize-y rounded-2xl border border-amber/20 bg-gradient-to-br from-panel to-panel/50 px-4 py-4 text-copy outline-none transition placeholder:text-muted focus:border-amber focus:shadow-[0_0_24px_rgba(212,175,55,0.15)]" />
            <button type="submit" className="mx-auto min-w-44 rounded-full bg-gradient-to-br from-amber to-amber-light px-5 py-4 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-amber/20 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-cyan disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting}>{submitText}</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
