import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} from "../../../lib/emailjsConfig";

export const runtime = "nodejs";
const INDIA_REGIONS = {
  AN: "Andaman and Nicobar Islands",
  AP: "Andhra Pradesh",
  AR: "Arunachal Pradesh",
  AS: "Assam",
  BR: "Bihar",
  CH: "Chandigarh",
  CT: "Chhattisgarh",
  DD: "Dadra and Nagar Haveli and Daman and Diu",
  DL: "Delhi",
  GA: "Goa",
  GJ: "Gujarat",
  HP: "Himachal Pradesh",
  HR: "Haryana",
  JH: "Jharkhand",
  JK: "Jammu and Kashmir",
  KA: "Karnataka",
  KL: "Kerala",
  LA: "Ladakh",
  LD: "Lakshadweep",
  MH: "Maharashtra",
  ML: "Meghalaya",
  MN: "Manipur",
  MP: "Madhya Pradesh",
  MZ: "Mizoram",
  NL: "Nagaland",
  OD: "Odisha",
  PB: "Punjab",
  PY: "Puducherry",
  RJ: "Rajasthan",
  SK: "Sikkim",
  TG: "Telangana",
  TN: "Tamil Nadu",
  TR: "Tripura",
  UP: "Uttar Pradesh",
  UT: "Uttarakhand",
  WB: "West Bengal",
};

function safeHeaderValue(value, maxLength = 80) {
  if (!value) return "";

  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    // Keep the original value if a provider header contains malformed encoding.
  }

  return decoded
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/[^\p{L}\p{N} .,'’()-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function getCountryName(code) {
  if (!/^[A-Z]{2}$/.test(code)) return "";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

function getApproximateLocation(request) {
  const city = safeHeaderValue(request.headers.get("x-vercel-ip-city"));
  const countryCode = safeHeaderValue(request.headers.get("x-vercel-ip-country"), 2).toUpperCase();
  const regionCode = safeHeaderValue(request.headers.get("x-vercel-ip-country-region"), 8).toUpperCase();
  const country = getCountryName(countryCode);
  const region = countryCode === "IN" ? INDIA_REGIONS[regionCode] || "" : "";
  const location = [city, region, country].filter(Boolean).join(", ");

  return location.slice(0, 200);
}

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

  const location = getApproximateLocation(request);
  if (!location) return json({ ok: true, sent: false }, 202);

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
          name: "Portfolio visitor — approximate location",
          email: "",
          message: `Approximate location (inferred from IP, not GPS): ${location}. This estimate may be inaccurate.`,
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
