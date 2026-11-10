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

function cleanPlacePart(value) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 100);
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
    return json({ ok: false, reason: "invalid-place" }, 400);
  }

  const placeParts = [location?.locality, location?.city, location?.region, location?.country]
    .map(cleanPlacePart)
    .filter((part, index, parts) => part && parts.findIndex((candidate) => candidate.toLocaleLowerCase() === part.toLocaleLowerCase()) === index);
  if (placeParts.length === 0) return json({ ok: false, reason: "invalid-place" }, 400);
  const placeName = placeParts.join(", ");

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
          name: "Portfolio visitor — shared location",
          email: "",
          message: [
            "A visitor shared their location from the portfolio.",
            "",
            "LOCATION",
            placeName,
            "",
            "The place name was resolved from browser location after the visitor chose Share.",
            "Coordinates are not included in this email.",
          ].join("\n"),
        },
      }),
    });

    if (!response.ok) {
      // Do not log the visitor's location or the provider response body.
      console.error("Visitor location email delivery failed", { status: response.status });
      return json({ ok: false }, 502);
    }

    return json({ ok: true, sent: true }, 202);
  } catch {
    console.error("Visitor location email delivery failed");
    return json({ ok: false }, 502);
  }
}
