import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} from "../../../lib/emailjsConfig";

export const runtime = "nodejs";

function json(body, status) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function POST(request) {
  // This feature is intended for the production Vercel deployment only.
  if (process.env.VERCEL_ENV !== "production" || !request.headers.get("x-vercel-id")) {
    return json({ ok: false, reason: "not-production" }, 200);
  }

  const origin = request.headers.get("origin");
  let sameOrigin = false;
  try {
    sameOrigin = Boolean(origin) && new URL(origin).origin === new URL(request.url).origin;
  } catch {
    sameOrigin = false;
  }
  if (!sameOrigin) return json({ ok: false }, 403);

  let location;
  try {
    location = await request.json();
  } catch {
    return json({ ok: false, reason: "invalid-location" }, 400);
  }

  const { latitude, longitude, accuracy } = location ?? {};
  if (
    typeof latitude !== "number" || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
    typeof longitude !== "number" || !Number.isFinite(longitude) || longitude < -180 || longitude > 180 ||
    typeof accuracy !== "number" || !Number.isFinite(accuracy) || accuracy < 0 || accuracy > 100000
  ) {
    return json({ ok: false, reason: "invalid-location" }, 400);
  }

  const latitudeText = latitude.toFixed(6);
  const longitudeText = longitude.toFixed(6);
  const accuracyText = Math.round(accuracy);
  const mapUrl = `https://maps.google.com/?q=${latitudeText},${longitudeText}`;

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      cache: "no-store",
      // EmailJS uses the source Origin header for its domain allowlist. The
      // incoming Origin has already been checked against this request's host.
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          name: "Portfolio visitor — shared device location",
          email: "",
          message: [
            "A visitor chose to share their browser-reported device location.",
            `Coordinates: ${latitudeText}, ${longitudeText}`,
            `Reported accuracy: approximately ${accuracyText} metres (the device's estimate; actual accuracy may vary).`,
            `Open in Google Maps: ${mapUrl}`,
          ].join("\n"),
        },
      }),
    });

    if (!response.ok) {
      // Do not log the visitor's coordinates or the provider response body.
      console.error("Visitor location email delivery failed", { status: response.status });
      return json({ ok: false }, 502);
    }

    return json({ ok: true, sent: true }, 202);
  } catch {
    console.error("Visitor location email delivery failed");
    return json({ ok: false }, 502);
  }
}
