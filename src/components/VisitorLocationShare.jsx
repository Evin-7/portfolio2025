"use client";

import { useEffect, useRef, useState } from "react";

const SHARED_KEY = "portfolio-device-location-shared-at";
const DISMISSED_KEY = "portfolio-device-location-dismissed-at";
const ATTEMPT_KEY = "portfolio-device-location-attempted-at";
const SHARED_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const DISMISS_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;
const ATTEMPT_COOLDOWN_MS = 10 * 60 * 1000;

async function resolvePlaceName(latitude, longitude, signal) {
  const url = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("localityLanguage", "en");

  const response = await fetch(url, { cache: "no-store", signal });
  if (!response.ok) throw new Error("place-lookup-failed");

  const result = await response.json();
  const place = {
    locality: result.locality,
    city: result.city,
    region: result.principalSubdivision,
    country: result.countryName,
  };

  if (!Object.values(place).some((value) => typeof value === "string" && value.trim())) {
    throw new Error("place-not-found");
  }

  return place;
}

function isWithinCooldown(value, cooldownMs, now) {
  const timestamp = Number(value);
  return Number.isFinite(timestamp) && timestamp > 0 && now >= timestamp && now - timestamp < cooldownMs;
}

export default function VisitorLocationShare() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const dialogRef = useRef(null);

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

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (visible && !dialog.open) dialog.showModal();
    if (!visible && dialog.open) dialog.close();
  }, [visible]);

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
      } catch {
        // The server still applies its own request limit.
      }

      let place;
      const lookupController = new AbortController();
      const lookupTimeout = window.setTimeout(() => lookupController.abort(), 10000);
      try {
        const { latitude, longitude } = position.coords;
        place = await resolvePlaceName(latitude, longitude, lookupController.signal);
      } catch {
        setStatus("We couldn’t identify your area just now. Nothing was emailed. Please try again later.");
        setBusy(false);
        return;
      } finally {
        window.clearTimeout(lookupTimeout);
      }

      try {
        try {
          window.localStorage.setItem(ATTEMPT_KEY, String(Date.now()));
        } catch {
          // The server still applies its own request limit.
        }

        const response = await fetch("/api/visitor-location", {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(place),
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
        setStatus("We couldn’t email your place name just now. Please try again later.");
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
    <dialog
      ref={dialogRef}
      aria-labelledby="location-share-title"
      aria-describedby="location-share-description"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) dismiss();
      }}
      className="location-share-dialog m-auto max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-md overflow-y-auto rounded-2xl border border-white/15 bg-panel p-0 text-copy shadow-[0_24px_90px_rgba(0,0,0,0.75)] backdrop:bg-black/75"
    >
      <div className="p-6 sm:p-7">
        <h2 id="location-share-title" className="mb-0 mt-0 text-xl font-semibold tracking-tight sm:text-2xl">
          Where are you visiting from?
        </h2>
        <p id="location-share-description" className="mb-0 mt-3 text-sm leading-6 text-muted">
          Evin would like to know where you’re visiting from. Share your place name by email?
        </p>

        {status ? <p className="mb-0 mt-4 text-sm leading-6 text-muted" role="status" aria-live="polite">{status}</p> : null}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={dismiss}
            disabled={busy}
            className="button button--outline location-share-button"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={requestLocation}
            disabled={busy || status.startsWith("Location shared")}
            autoFocus
            className="button button--primary location-share-button"
          >
            {busy ? "Finding your area…" : "Share location"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
