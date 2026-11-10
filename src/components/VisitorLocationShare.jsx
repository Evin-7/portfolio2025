"use client";

import { useEffect, useState } from "react";

const SHARED_KEY = "portfolio-device-location-shared-at";
const DISMISSED_KEY = "portfolio-device-location-dismissed-at";
const ATTEMPT_KEY = "portfolio-device-location-attempted-at";
const SHARED_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const DISMISS_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;
const ATTEMPT_COOLDOWN_MS = 10 * 60 * 1000;

function isWithinCooldown(value, cooldownMs, now) {
  const timestamp = Number(value);
  return Number.isFinite(timestamp) && timestamp > 0 && now >= timestamp && now - timestamp < cooldownMs;
}

export default function VisitorLocationShare() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const now = Date.now();
    try {
      // Retire keys used by the previous automatic IP-location email feature.
      window.localStorage.removeItem("portfolio-approx-location-notified-at");
      window.localStorage.removeItem("portfolio-approx-location-attempted-at");

      if (isWithinCooldown(window.localStorage.getItem(SHARED_KEY), SHARED_COOLDOWN_MS, now)) return;
      if (isWithinCooldown(window.localStorage.getItem(DISMISSED_KEY), DISMISS_COOLDOWN_MS, now)) return;
    } catch {
      // The request remains available when storage is blocked.
    }

    setVisible(true);
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {
      // Dismissing still works for this page view if storage is unavailable.
    }
    setVisible(false);
  }

  function requestLocation() {
    setStatus("");

    if (!navigator.geolocation) {
      setStatus("Location access is not available in this browser.");
      return;
    }

    setBusy(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const now = Date.now();
      try {
        if (isWithinCooldown(window.localStorage.getItem(ATTEMPT_KEY), ATTEMPT_COOLDOWN_MS, now)) {
          setBusy(false);
          setStatus("A location share was recently attempted from this browser. Please try again in a few minutes.");
          return;
        }
        window.localStorage.setItem(ATTEMPT_KEY, String(now));
      } catch {
        // The server still applies its own request limit.
      }

      const { latitude, longitude, accuracy } = position.coords;
      try {
        const response = await fetch("/api/visitor-location", {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude, longitude, accuracy }),
        });
        const result = await response.json().catch(() => null);

        if (response.status === 429) {
          setStatus("A location share was recently sent from this network. Please try again later.");
          return;
        }
        if (!response.ok || !result?.sent) {
          setStatus("We couldn’t send the location just now. Please try again later.");
          return;
        }

        try {
          window.localStorage.setItem(SHARED_KEY, String(Date.now()));
          window.localStorage.removeItem(ATTEMPT_KEY);
        } catch {
          // Successful sharing does not depend on storage.
        }
        setStatus("Location shared with Evin. Thank you.");
        window.setTimeout(() => setVisible(false), 3500);
      } catch {
        setStatus("We couldn’t send the location just now. Please try again later.");
      } finally {
        setBusy(false);
      }
    }, (error) => {
      setBusy(false);
      if (error.code === error.PERMISSION_DENIED) {
        setStatus("Location access was denied. Nothing was sent. You can change this in your browser’s site settings.");
      } else if (error.code === error.TIMEOUT) {
        setStatus("The browser couldn’t get a location fix in time. Please try again.");
      } else {
        setStatus("Your location is unavailable right now. Nothing was sent.");
      }
    }, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 20000,
    });
  }

  if (!visible) return null;

  return (
    <aside
      aria-label="Location sharing request"
      className="fixed bottom-4 right-4 z-[1200] w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-white/15 bg-[#0A0A0A] p-5 text-copy shadow-[0_16px_60px_rgba(0,0,0,0.65)]"
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="m-0 text-sm font-semibold">Share your location?</p>
          <p className="mb-0 mt-2 text-xs leading-5 text-muted">
            If you continue, your browser will ask for location access. If allowed, your coordinates and reported accuracy are emailed to Evin at yjevin75@gmail.com. Declining sends nothing.
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          disabled={busy}
          aria-label="Dismiss location request"
          className="-mr-2 -mt-2 inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-copy disabled:cursor-not-allowed"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      {status ? <p className="mb-0 mt-3 text-xs leading-5 text-muted" role="status" aria-live="polite">{status}</p> : null}

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={dismiss}
          disabled={busy}
          className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-full border border-white/20 px-4 text-xs font-medium text-muted transition-colors hover:border-white/40 hover:text-copy disabled:cursor-not-allowed disabled:opacity-60"
        >
          Not now
        </button>
        <button
          type="button"
          onClick={requestLocation}
          disabled={busy || status.startsWith("Location shared")}
          className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-full bg-copy px-4 text-xs font-semibold text-ink transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Getting location…" : "Share location"}
        </button>
      </div>
    </aside>
  );
}
