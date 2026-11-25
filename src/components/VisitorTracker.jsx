"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { requestGrantedDeviceCoordinates } from "../lib/visitorDevicePermission.mjs";

let deviceCoordinatesRequest;

function hasOptOutSignal() {
  return navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true;
}

async function getEligibleBrowserSignals() {
  try {
    const response = await fetch("/api/privacy-consent", {
      cache: "no-store",
      credentials: "same-origin",
    });
    if (!response.ok) return null;

    const settings = await response.json();
    if (
      !settings.enabled ||
      settings.optedOut ||
      settings.optOutSignal ||
      (settings.requiresConsent && !settings.explicitConsent) ||
      hasOptOutSignal()
    ) return null;

    const signals = {
      browserTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      browserLanguage: navigator.language,
      ...(navigator.webdriver === true ? { webdriver: true } : {}),
    };
    if (!settings.requestDeviceLocation) return signals;
    const request = deviceCoordinatesRequest ||= requestGrantedDeviceCoordinates(navigator);
    try {
      const deviceCoordinates = await request;
      if (deviceCoordinates) signals.deviceCoordinates = deviceCoordinates;
    } finally {
      if (deviceCoordinatesRequest === request) deviceCoordinatesRequest = undefined;
    }
    return signals;
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

      const browserSignals = await getEligibleBrowserSignals();
      if (hasOptOutSignal()) return;
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
          ...browserSignals,
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
