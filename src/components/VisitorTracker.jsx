"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

let deviceCoordinatesRequest;

function hasOptOutSignal() {
  return navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true;
}

function requestDeviceCoordinates() {
  if (!navigator.geolocation) return Promise.resolve(null);

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracyMeters: coords.accuracy,
      }),
      () => resolve(null),
      { enableHighAccuracy: true, maximumAge: 30_000, timeout: 10_000 },
    );
  });
}

async function getDeviceCoordinatesIfEligible() {
  try {
    const response = await fetch("/api/privacy-consent", {
      cache: "no-store",
      credentials: "same-origin",
    });
    if (!response.ok) return null;

    const settings = await response.json();
    if (
      !settings.enabled ||
      !settings.requestDeviceLocation ||
      settings.optedOut ||
      settings.optOutSignal ||
      (settings.requiresConsent && !settings.explicitConsent) ||
      hasOptOutSignal()
    ) return null;

    deviceCoordinatesRequest ||= requestDeviceCoordinates();
    return await deviceCoordinatesRequest;
  } catch {
    // Fail closed if the server cannot confirm that location collection is eligible.
    return null;
  }
}

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    async function recordVisit() {
      if (hasOptOutSignal()) return;

      let referrer = "";
      try {
        if (document.referrer) referrer = new URL(document.referrer).origin;
      } catch {
        // Keep referral unavailable if the browser supplies an invalid value.
      }

      const deviceCoordinates = await getDeviceCoordinatesIfEligible();
      void fetch("/api/visitor", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pathname || "/",
          referrer,
          utcOffsetMinutes: -new Date().getTimezoneOffset(),
          ...(deviceCoordinates ? { deviceCoordinates } : {}),
        }),
      }).catch(() => {
        // Visitor notifications are optional and never affect page rendering.
      });
    }

    void recordVisit();
    window.addEventListener("portfolio:visitor-preference-changed", recordVisit);
    return () => window.removeEventListener("portfolio:visitor-preference-changed", recordVisit);
  }, [pathname]);

  return null;
}
