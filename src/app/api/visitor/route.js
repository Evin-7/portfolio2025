import { createHmac } from "node:crypto";
import {
  addAggregate,
  claimKey,
  decrementCounter,
  incrementCounter,
} from "../../../lib/visitorStore";
import {
  getConsentFromRequest,
  getHashSecret,
  getNotificationMode,
  getPseudonymousNetworkKey,
  hasPrivacyOptOut,
  isLocalTestMode,
  isSameOriginRequest,
  sendVisitorEmail,
  visitorFeatureEnabled,
} from "../../../lib/visitorSecurity";
import {
  istDayKey,
  istHourBucket,
  makeVisitorEmail,
  normalizeReferral,
  normalizeVisitedPage,
  requiresExplicitVisitorConsent,
} from "../../../lib/visitorNotifications.mjs";
import { resolveVisitorLocation } from "../../../lib/visitorLocationProviders.mjs";
import { looksAutomated } from "../../../lib/visitorRequestPolicy.mjs";

export const runtime = "nodejs";

const DAILY_VISIT_CAP = 1200;

function json(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

function isAllowedRuntime(request) {
  if (isLocalTestMode()) return true;
  return process.env.VERCEL_ENV === "production" && Boolean(request.headers.get("x-vercel-id"));
}

export async function POST(request) {
  if (!visitorFeatureEnabled() || !isAllowedRuntime(request)) return json({ ok: true, recorded: false });
  if (!isSameOriginRequest(request)) return json({ ok: false }, 403);
  if (hasPrivacyOptOut(request)) return json({ ok: true, recorded: false });
  if (looksAutomated(request)) return json({ ok: true, recorded: false });
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) return json({ ok: false }, 415);

  const consent = getConsentFromRequest(request);
  if (hasPrivacyOptOut(request) || consent?.accepted === false) return json({ ok: true, recorded: false });
  if (requiresExplicitVisitorConsent(request.headers) && consent?.accepted !== true) return json({ ok: true, recorded: false, consentRequired: true });

  const visitedAt = new Date();
  let payload;
  try {
    const text = await request.text();
    if (text.length > 2048) return json({ ok: false }, 413);
    payload = JSON.parse(text);
  } catch {
    return json({ ok: false }, 400);
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return json({ ok: false }, 400);
  // Older open tabs may still send deviceCoordinates. Ignore it entirely.
  if (Object.keys(payload).some((key) => !["page", "referrer", "deviceCoordinates"].includes(key))) return json({ ok: false }, 400);

  const day = istDayKey(visitedAt);
  const networkDigest = getPseudonymousNetworkKey(request);
  const networkKey = "portfolio:visitors:rate:" + networkDigest + ":" + day;
  const dailyCountKey = "portfolio:visitors:total:" + day;
  let countIncremented = false;

  try {
    // A short-lived HMAC key limits abusive request bursts without retaining an IP address.
    // Visits can notify again after this brief throttle window.
    const networkClaimed = await claimKey(networkKey, 60);
    if (!networkClaimed) return json({ ok: true, recorded: false, rateLimited: true });

    const total = await incrementCounter(dailyCountKey, 8 * 24 * 60 * 60);
    countIncremented = true;
    if (total > DAILY_VISIT_CAP) {
      await decrementCounter(dailyCountKey);
      countIncremented = false;
      return json({ ok: true, recorded: false, capped: true });
    }

    const location = await resolveVisitorLocation(request, {
      trackingEligible: !isLocalTestMode(),
      consentAccepted: consent?.accepted === true,
    });
    if (location.crawlerDetected) {
      await decrementCounter(dailyCountKey);
      return json({ ok: true, recorded: false });
    }
    const page = normalizeVisitedPage(payload.page);
    const userAgent = request.headers.get("user-agent") || "";
    const details = {
      location,
      page,
      pageUrl: new URL(page, request.url).origin + page,
      deviceBrowser: describeDeviceBrowser(userAgent),
      source: normalizeReferral(payload.referrer, request.url),
      visitHour: istHourBucket(visitedAt),
    };
    const bucketId = createHmac("sha256", getHashSecret()).update(JSON.stringify(details)).digest("hex");
    await addAggregate(day, bucketId, details);

    if (getNotificationMode() === "individual") {
      const email = makeVisitorEmail({ ...details, date: visitedAt });
      try {
        const result = await sendVisitorEmail(request, email);
        if (!result.sent) console.error("Portfolio visitor notification delivery failed", { status: result.status || 0 });
      } catch {
        console.error("Portfolio visitor notification delivery failed");
      }
    }

    return json({ ok: true, recorded: true });
  } catch {
    if (countIncremented) {
      try { await decrementCounter(dailyCountKey); } catch { /* storage may be unavailable */ }
    }
    console.error("Portfolio visitor notification could not be recorded");
    return json({ ok: true, recorded: false });
  }
}

function describeDeviceBrowser(userAgent) {
  if (typeof userAgent !== "string" || !userAgent) return "Unavailable";
  const ua = userAgent.slice(0, 512);
  const browser = /Edg\//.test(ua) ? "Edge"
    : /OPR\//.test(ua) ? "Opera"
      : /Firefox\//.test(ua) ? "Firefox"
        : /Chrome\//.test(ua) ? "Chrome"
          : /Safari\//.test(ua) ? "Safari"
            : /MSIE|Trident\//.test(ua) ? "Internet Explorer"
              : "Other browser";
  const platform = /Android/.test(ua) ? "Android"
    : /iPhone|iPad|iPod/.test(ua) ? "iOS"
      : /Windows NT/.test(ua) ? "Windows"
        : /Mac OS X/.test(ua) ? "macOS"
          : /Linux/.test(ua) ? "Linux"
            : "Unknown platform";
  const device = /iPad|Tablet/.test(ua) ? "Tablet"
    : /Mobi|iPhone|Android/.test(ua) ? "Mobile"
      : "Desktop";
  return `${device} · ${platform} · ${browser}`;
}
