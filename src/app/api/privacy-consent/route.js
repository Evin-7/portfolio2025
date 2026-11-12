import {
  createConsentCookie,
  getConsentFromRequest,
  isSameOriginRequest,
  hasPrivacyOptOut,
  visitorFeatureEnabled,
} from "../../../lib/visitorSecurity";

export const runtime = "nodejs";

function json(body, status = 200, headers = {}) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0", ...headers },
  });
}

export async function GET(request) {
  const consent = getConsentFromRequest(request);
  return json({
    enabled: visitorFeatureEnabled(),
    decision: hasPrivacyOptOut(request) ? "declined" : consent?.accepted ? "accepted" : consent ? "declined" : null,
  });
}

export async function POST(request) {
  if (!visitorFeatureEnabled()) return json({ ok: false, enabled: false }, 200);
  if (!isSameOriginRequest(request)) return json({ ok: false }, 403);
  if (hasPrivacyOptOut(request)) return json({ ok: false, decision: "declined" }, 200, { "Set-Cookie": createConsentCookie("declined") });
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) return json({ ok: false }, 415);

  let body;
  try {
    const text = await request.text();
    if (text.length > 256) return json({ ok: false }, 413);
    body = JSON.parse(text);
  } catch {
    return json({ ok: false }, 400);
  }
  if (!body || !["accepted", "declined"].includes(body.decision)) return json({ ok: false }, 400);

  return json(
    { ok: true, decision: body.decision },
    200,
    { "Set-Cookie": createConsentCookie(body.decision) },
  );
}
