"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function hasOptOutSignal() {
  return navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true;
}

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    function recordVisit() {
      if (hasOptOutSignal()) return;
      let referrer = "";
      try {
        if (document.referrer) referrer = new URL(document.referrer).origin;
      } catch {
        // Keep referral unavailable if the browser supplies an invalid value.
      }

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
