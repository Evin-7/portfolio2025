import { createHmac } from "node:crypto";
import {
  addAggregate,
  claimKey,
  decrementCounter,
  incrementCounter,
  releaseKey,
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
  istMonthKey,
  locationFromHeaders,
  makeVisitorEmail,
  normalizeReferral,
  normalizeVisitedPage,
} from "../../../lib/visitorNotifications.mjs";

export const runtime = "nodejs";

const DAILY_VISIT_CAP = 1200;
const INDIVIDUAL_EMAIL_DAILY_CAP = 2;
const INDIVIDUAL_EMAIL_MONTHLY_CAP = 25;

function json(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

function looksAutomated(request) {
  const agent = request.headers.get("user-agent") || "";
  if (!agent || /bot|crawler|spider|slurp|headless|phantom|python-requests|curl\/|wget\/|scrapy/i.test(agent)) return true;
  const fetchSite = request.headers.get("sec-fetch-site");
  return Boolean(fetchSite && fetchSite !== "same-origin");
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
  if (!consent?.accepted) return json({ ok: true, recorded: false });

  let payload;
  try {
    const text = await request.text();
    if (text.length > 2048) return json({ ok: false }, 413);
    payload = JSON.parse(text);
  } catch {
    return json({ ok: false }, 400);
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return json({ ok: false }, 400);
  if (Object.keys(payload).some((key) => !["page", "referrer"].includes(key))) return json({ ok: false }, 400);

  const day = istDayKey();
  const visitorDigest = createHmac("sha256", getHashSecret()).update(consent.id).digest("hex");
  const networkDigest = getPseudonymousNetworkKey(request);
  const visitorKey = "portfolio:visitors:seen:" + day + ":" + visitorDigest;
  const networkKey = "portfolio:visitors:rate:" + networkDigest + ":" + day;
  const dailyCountKey = "portfolio:visitors:total:" + day;
  let visitorClaimed = false;
  let countIncremented = false;

  try {
    visitorClaimed = await claimKey(visitorKey, 26 * 60 * 60);
    if (!visitorClaimed) return json({ ok: true, recorded: false, duplicate: true });

    // A short-lived HMAC key limits abusive request bursts without retaining an IP address.
    const networkClaimed = await claimKey(networkKey, 60);
    if (!networkClaimed) {
      await releaseKey(visitorKey);
      return json({ ok: true, recorded: false, rateLimited: true });
    }

    const total = await incrementCounter(dailyCountKey, 8 * 24 * 60 * 60);
    countIncremented = true;
    if (total > DAILY_VISIT_CAP) {
      await decrementCounter(dailyCountKey);
      countIncremented = false;
      return json({ ok: true, recorded: false, capped: true });
    }

    const location = locationFromHeaders(request.headers);
    const details = {
      location,
      page: normalizeVisitedPage(payload.page),
      source: normalizeReferral(payload.referrer, request.url),
      visitHour: istHourBucket(),
    };
    const bucketId = createHmac("sha256", getHashSecret()).update(JSON.stringify(details)).digest("hex");
    await addAggregate(day, bucketId, details);

    if (getNotificationMode() === "individual") {
      const dailyKey = "portfolio:visitors:individual-email-count:day:" + day;
      const dailyAttempts = await incrementCounter(dailyKey, 8 * 24 * 60 * 60);
      if (dailyAttempts <= INDIVIDUAL_EMAIL_DAILY_CAP) {
        const month = istMonthKey();
        const monthlyKey = "portfolio:visitors:individual-email-count:month:" + month;
        const monthlyAttempts = await incrementCounter(monthlyKey, 40 * 24 * 60 * 60);
        if (monthlyAttempts > INDIVIDUAL_EMAIL_MONTHLY_CAP) {
          await decrementCounter(dailyKey);
          await decrementCounter(monthlyKey);
          return json({ ok: true, recorded: true });
        }
        const email = makeVisitorEmail({ ...details, date: new Date() });
        try {
          const result = await sendVisitorEmail(request, email);
          if (!result.sent) console.error("Portfolio visitor notification delivery failed", { status: result.status || 0 });
        } catch {
          console.error("Portfolio visitor notification delivery failed");
        }
      } else {
        await decrementCounter(dailyKey);
      }
    }

    return json({ ok: true, recorded: true });
  } catch {
    if (countIncremented) {
      try { await decrementCounter(dailyCountKey); } catch { /* storage may be unavailable */ }
    }
    if (visitorClaimed) {
      try { await releaseKey(visitorKey); } catch { /* storage may be unavailable */ }
    }
    console.error("Portfolio visitor notification could not be recorded");
    return json({ ok: true, recorded: false });
  }
}
