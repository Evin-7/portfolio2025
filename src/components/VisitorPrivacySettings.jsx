"use client";

import { useEffect, useState } from "react";

function normalizeSettings(result) {
  return {
    status: "ready",
    enabled: Boolean(result.enabled),
    optedOut: Boolean(result.optedOut),
    optOutSignal: Boolean(result.optOutSignal),
    requiresConsent: Boolean(result.requiresConsent),
    explicitConsent: Boolean(result.explicitConsent),
  };
}

export default function VisitorPrivacySettings() {
  const [state, setState] = useState({ status: "loading", enabled: false, optedOut: false, optOutSignal: false, requiresConsent: false, explicitConsent: false });
  const [busy, setBusy] = useState(false);

  async function refresh() {
    try {
      const response = await fetch("/api/privacy-consent", { cache: "no-store", credentials: "same-origin" });
      const result = await response.json();
      setState(normalizeSettings(result));
    } catch {
      setState((current) => ({ ...current, status: "error" }));
    }
  }

  useEffect(() => {
    let active = true;
    fetch("/api/privacy-consent", { cache: "no-store", credentials: "same-origin" })
      .then((response) => response.json())
      .then((result) => {
        if (active) setState(normalizeSettings(result));
      })
      .catch(() => {
        if (active) setState((current) => ({ ...current, status: "error" }));
      });
    return () => { active = false; };
  }, []);

  async function savePreference() {
    if (busy || !state.enabled || state.optOutSignal) return;
    setBusy(true);
    try {
      const needsEnable = state.optedOut || (state.requiresConsent && !state.explicitConsent);
      const decision = needsEnable ? "accepted" : "declined";
      const response = await fetch("/api/privacy-consent", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      if (response.ok) {
        await refresh();
        if (decision === "accepted") window.dispatchEvent(new Event("portfolio:visitor-preference-changed"));
      }
      else setState((current) => ({ ...current, status: "error" }));
    } catch {
      setState((current) => ({ ...current, status: "error" }));
    } finally {
      setBusy(false);
    }
  }

  const message = state.status === "loading"
    ? "Checking your current setting…"
    : state.status === "error"
      ? "Your setting could not be updated. Please try again."
      : !state.enabled
        ? "Visitor email notifications are currently disabled."
        : state.optOutSignal
          ? "Disabled because your browser sends a Do Not Track or Global Privacy Control signal."
          : state.optedOut
            ? "Off. This browser will not send visitor-location notifications."
            : state.requiresConsent && !state.explicitConsent
              ? "Off until you explicitly allow visitor notifications."
              : "On. Visitor notifications are active; the browser may ask for device location for individual alerts.";
  const needsEnable = state.optedOut || (state.requiresConsent && !state.explicitConsent);

  return (
    <section id="visitor-notifications" className="privacy-settings" aria-labelledby="visitor-notifications-title">
      <h2 id="visitor-notifications-title">Visitor-location notifications</h2>
      <p>
        Allowing enables approximate IP-based visitor analytics and email alerts. For eligible visits, Vercel and, when configured, IPinfo and IPapi.co process the request IP to estimate city-level location; the portfolio does not store raw IP addresses. For eligible visitors when individual email alerts are enabled, the browser may show its native location-permission prompt. If allowed, browser-reported coordinates and accuracy are included in that individual email only; they are not stored in grouped records. No custom location modal is shown. Your choice is saved in a signed first-party preference cookie.
      </p>
      <div className="privacy-settings-control">
        <p role="status" aria-live="polite">{message}</p>
        <button
          type="button"
          className="button button--outline"
          disabled={busy || state.status === "loading" || !state.enabled || state.optOutSignal}
          onClick={() => void savePreference()}
        >
          {busy ? "Saving…" : needsEnable ? "Allow visitor notifications" : "Turn off visitor notifications"}
        </button>
      </div>
    </section>
  );
}
