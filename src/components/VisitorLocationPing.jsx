"use client";

import { useEffect } from "react";

const VISIT_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const VISIT_KEY = "portfolio-approx-location-notified-at";

export default function VisitorLocationPing() {
  useEffect(() => {
    try {
      const lastNotifiedAt = Number(window.localStorage.getItem(VISIT_KEY));
      if (Number.isFinite(lastNotifiedAt) && Date.now() - lastNotifiedAt < VISIT_COOLDOWN_MS) {
        return;
      }

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
      }
    }).catch(() => {
      // Visitor insights are best-effort and must not affect portfolio rendering.
    });
  }, []);

  return null;
}
