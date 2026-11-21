"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

let deviceCoordinatesRequest;

function hasOptOutSignal() {
  return navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true;
}

function readDeviceCoordinates(options) {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracyMeters: coords.accuracy,
      }),
      (error) => resolve({ errorCode: error.code }),
      options,
    );
  });
}

async function requestDeviceCoordinates() {
  if (!navigator.geolocation) return null;

  const first = await readDeviceCoordinates({
    enableHighAccuracy: true,
    maximumAge: 30_000,
    timeout: 10_000,
  });
  if (!first?.errorCode) return first;
  if (first.errorCode === 1) return null;

  const retry = await readDeviceCoordinates({
    enableHighAccuracy: false,
    maximumAge: 30_000,
    timeout: 10_000,
  });
  return retry?.errorCode ? null : retry;
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

    const request = deviceCoordinatesRequest ||= requestDeviceCoordinates();
    const coordinates = await request;
    if (!coordinates && deviceCoordinatesRequest === request) deviceCoordinatesRequest = undefined;
    return coordinates;
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
