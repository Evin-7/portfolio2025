"use client";

import { useEffect } from "react";

const VISIT_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const VISIT_KEY = "portfolio-approx-location-notified-at";
const ATTEMPT_COOLDOWN_MS = 10 * 60 * 1000;
const ATTEMPT_KEY = "portfolio-approx-location-attempted-at";

function isWithinCooldown(value, cooldownMs, now) {
  const timestamp = Number(value);
  return Number.isFinite(timestamp) && timestamp > 0 && now >= timestamp && now - timestamp < cooldownMs;
}

export default function VisitorLocationPing() {
  useEffect(() => {
    const now = Date.now();
    try {
      if (isWithinCooldown(window.localStorage.getItem(VISIT_KEY), VISIT_COOLDOWN_MS, now)) {
        return;
      }
      if (isWithinCooldown(window.localStorage.getItem(ATTEMPT_KEY), ATTEMPT_COOLDOWN_MS, now)) {
        return;
      }
      // Remember the attempt before fetching so reloads and repeated failures
      // cannot continuously hit the public endpoint or trigger Vercel's 429.
      window.localStorage.setItem(ATTEMPT_KEY, String(now));
    } catch {
      // If storage is unavailable, send only this page-view request.
    }

    fetch("/api/visitor-location", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    }).then(async (response) => {
      const result = await response.json().catch(() => null);
      if (response.ok && result?.sent) {
        window.localStorage.setItem(VISIT_KEY, String(Date.now()));
        window.localStorage.removeItem(ATTEMPT_KEY);
      }
    }).catch(() => {
      // Visitor insights are best-effort and must not affect portfolio rendering.
    });
  }, []);

  return null;
}
