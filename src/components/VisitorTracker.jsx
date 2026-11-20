"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function hasOptOutSignal() {
  return navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true;
}

async function getGrantedDeviceCoordinates() {
  if (!navigator.permissions?.query || !navigator.geolocation?.getCurrentPosition) return undefined;

  try {
    const response = await fetch("/api/privacy-consent", {
      cache: "no-store",
      credentials: "same-origin",
    });
    if (!response.ok) return undefined;
    const privacy = await response.json();
    if (!privacy.enabled || privacy.optedOut || (privacy.requiresConsent && !privacy.explicitConsent)) return undefined;

    const permission = await navigator.permissions.query({ name: "geolocation" });
    if (permission.state !== "granted") return undefined;

    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        maximumAge: 60_000,
        timeout: 2500,
      });
    });
    const latitude = Math.round(position.coords.latitude * 100) / 100;
    const longitude = Math.round(position.coords.longitude * 100) / 100;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return undefined;
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return undefined;
    return { latitude, longitude };
  } catch {
    // No permission prompt or fallback lookup; the capture route uses IP location.
    return undefined;
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

      const deviceCoordinates = await getGrantedDeviceCoordinates();
      void fetch("/api/visitor", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pathname || "/",
          referrer,
          ...(deviceCoordinates ? { deviceCoordinates } : {}),
        }),
      }).catch(() => {
        // Visitor notifications are optional and never affect page rendering.
      });
    }

    recordVisit();
    window.addEventListener("portfolio:visitor-preference-changed", recordVisit);
    return () => window.removeEventListener("portfolio:visitor-preference-changed", recordVisit);
  }, [pathname]);

  return null;
}
