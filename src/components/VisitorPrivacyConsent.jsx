"use client";

import { useCallback, useEffect, useState } from "react";

function hasOptOutSignal() {
  return navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true;
}

async function recordVisit() {
  if (hasOptOutSignal() || window.__portfolioVisitorRequestStarted) return;
  window.__portfolioVisitorRequestStarted = true;
  const pathname = window.location.pathname;
  const page = ["/", "/resume", "/privacy"].includes(pathname) ? pathname : "/other";
  let referrer = "";
  try {
    if (document.referrer) referrer = new URL(document.referrer).origin;
  } catch {
    // Keep referral unavailable if the browser supplies an invalid value.
  }
  try {
    await fetch("/api/visitor", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page, referrer }),
    });
  } catch {
    // Visitor notifications are optional and must never affect navigation.
  }
}

export default function VisitorPrivacyConsent() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/privacy-consent", { cache: "no-store", credentials: "same-origin" });
      const result = await response.json();
      if (!result.enabled || hasOptOutSignal()) {
        setVisible(false);
        return;
      }
      if (result.decision === "accepted") {
        setVisible(false);
        void recordVisit();
        return;
      }
      if (result.decision === "declined") {
        setVisible(false);
        return;
      }
      setVisible(true);
    } catch {
      setVisible(false);
    }
  }, []);

  useEffect(() => {
    const refreshTimer = window.setTimeout(() => void refresh(), 0);
    const openChoices = () => setVisible(true);
    window.addEventListener("portfolio:privacy-choices", openChoices);
    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("portfolio:privacy-choices", openChoices);
    };
  }, [refresh]);

  async function choose(decision) {
    setBusy(true);
    try {
      const response = await fetch("/api/privacy-consent", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) return;
      setVisible(false);
      if (result?.decision === "accepted") await recordVisit();
    } catch {
      // If consent cannot be saved, no visitor event is sent.
    } finally {
      setBusy(false);
    }
  }

  if (!visible) return null;

  return (
    <aside className="visitor-consent" aria-labelledby="visitor-consent-title" aria-live="polite">
      <div className="visitor-consent-copy">
        <p className="visitor-consent-eyebrow">Privacy choice</p>
        <h2 id="visitor-consent-title">Help improve this portfolio</h2>
        <p>
          If you allow it, this site records an approximate country, region, city, page, and referral source from network information. A daily email summary is the default. No GPS or contact details are collected. <a href="/privacy">Read the privacy notice</a>.
        </p>
      </div>
      <div className="visitor-consent-actions">
        <button type="button" className="visitor-consent-decline" disabled={busy} onClick={() => void choose("declined")}>Decline</button>
        <button type="button" className="visitor-consent-accept" disabled={busy} onClick={() => void choose("accepted")}>{busy ? "Saving…" : "Allow"}</button>
      </div>
    </aside>
  );
}
