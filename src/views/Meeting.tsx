"use client";

import { useState } from "react";
import Reveal from "../components/Reveal";

function getGoogleBookingUrl(value: string | undefined): string | null {
  if (!value?.trim()) return null;

  try {
    const url = new URL(value.trim());
    const isGoogleAppointmentPage =
      url.protocol === "https:" &&
      url.hostname === "calendar.google.com" &&
      url.pathname.includes("/appointments/schedules/");

    return isGoogleAppointmentPage ? url.toString() : null;
  } catch {
    return null;
  }
}

const bookingUrl = getGoogleBookingUrl(process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_BOOKING_URL);
const emailFallback = "mailto:yjevin75@gmail.com?subject=Meeting%20request";

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17M8 13h3m2 0h3m-8 3h3" />
    </svg>
  );
}

function MeetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
      <rect x="3" y="6" width="13" height="12" rx="2.5" />
      <path d="m16 10 5-3v10l-5-3" />
    </svg>
  );
}

export default function Meeting() {
  const [isCalendarLoaded, setIsCalendarLoaded] = useState(false);

  return (
    <section
      className="section relative isolate overflow-hidden border-y border-[var(--line)] bg-[var(--page-bg-secondary)]"
      aria-labelledby="meeting-title"
      data-story="meeting"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_82%_14%,rgba(121,217,158,0.075),transparent_42%)]"
      />

      <div className="page-container relative z-10">
        <Reveal className="section-heading nav-anchor-target" id="meeting" variant="soft">
          <p className="section-kicker">04 / Schedule a Meeting</p>
          <h2 className="section-title max-w-[16ch]" id="meeting-title">Let&apos;s find a time to talk.</h2>
          <p className="section-description max-w-[680px]">
            Have a job opportunity, project or collaboration in mind? Schedule a meeting with me.
          </p>
        </Reveal>

        <div className="mt-9 flex flex-col items-start justify-between gap-5 border-y border-[var(--glass-border)] py-5 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-[var(--glass-border)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--text)]">
              <CalendarIcon />
              30 minutes
            </span>
            <span className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-[var(--glass-border)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--text)]">
              <MeetIcon />
              Google Meet
            </span>
            <span className="text-sm leading-relaxed text-[var(--text-muted)]">
              {bookingUrl ? "Choose a time from my live availability." : "Online booking is being connected."}
            </span>
          </div>

          <a
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[var(--glass-border-hover)] bg-[var(--accent-soft)] px-5 text-sm font-semibold text-[var(--accent-light)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[rgba(121,217,158,0.18)] hover:text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-light)]"
            href={bookingUrl ?? emailFallback}
            target={bookingUrl ? "_blank" : undefined}
            rel={bookingUrl ? "noopener noreferrer" : undefined}
          >
            {bookingUrl ? "Open booking page" : "Email to schedule"}
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <Reveal id={undefined} className="mt-7" delay={0.08} variant="mask">
          <div className="meeting-frame rounded-[24px] p-px shadow-[0_28px_90px_rgba(0,0,0,0.34)]">
            {bookingUrl ? (
              <div className="relative h-[940px] overflow-hidden rounded-[23px] bg-[#0c0f0e] sm:h-[800px] lg:h-[740px]">
                {!isCalendarLoaded && (
                  <div className="absolute inset-0 z-10 grid place-items-center bg-[#0c0f0e] px-6" role="status" aria-live="polite">
                    <div className="flex items-center gap-3 rounded-full border border-[var(--glass-border)] bg-[var(--surface)] px-5 py-3 text-sm text-[var(--text-secondary)] shadow-xl">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[rgba(121,217,158,0.24)] border-t-[var(--accent-light)]" aria-hidden="true" />
                      Loading live availability…
                    </div>
                  </div>
                )}
                <iframe
                  className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-500 ${isCalendarLoaded ? "opacity-100" : "opacity-0"}`}
                  src={bookingUrl}
                  title="Google Calendar appointment availability"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  onLoad={() => setIsCalendarLoaded(true)}
                />
              </div>
            ) : (
              <div className="grid min-h-[360px] place-items-center rounded-[23px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(121,217,158,0.07),transparent_52%),#0c0f0e] px-6 py-12 text-center sm:min-h-[390px]">
                <div className="max-w-md">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[var(--glass-border-hover)] bg-[var(--accent-soft)] text-[var(--accent-light)] shadow-[0_0_38px_rgba(121,217,158,0.08)]">
                    <CalendarIcon />
                  </span>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-light)]">Live scheduling</p>
                  <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[var(--text)] sm:text-2xl">Let&apos;s arrange a time.</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                    Send me a quick email and we can find a time that works for both of us.
                  </p>
                  <a
                    href={emailFallback}
                    className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--glass-border-hover)] px-5 text-sm font-semibold text-[var(--accent-light)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--accent-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-light)]"
                  >
                    Email me to schedule <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
